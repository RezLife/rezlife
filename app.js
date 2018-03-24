/**
 * Load modules
 */
var express = require('express');
var bodyParser = require('body-parser');
var path = require('path');
var fs = require('fs');
var mysql = require('mysql');
var fileUpload = require('express-fileupload');
var chartParser = require('./chartParser.js');
var createAccount = require('./createAccount.js');
var session = require('client-sessions');
var bcrypt = require('bcrypt');
const saltRounds = 11; //number of salt rounds for encryption
let api = require('./model/api.js');
let app_routes = require('./routes/app_routes');

var app = express();
let handlebars = require('express-handlebars');
/**
 * Set Handlebars as Template Engine
 */
app.engine('handlebars', handlebars({
    //main layout in views/layout/main.handlebars
    defaultLayout: 'main',
    //helper to inject head/script files in template
    helpers: {
        section: function (name, options) {
            if (!this._sections) this._sections = {};
            this._sections[name] = options.fn(this);
            return null;
        }
    }
}));

app.set('view engine', 'handlebars');

//middleware for roster csv upload
app.use(fileUpload());

//session allows for persistent logins with authentication
app.use(session({
    cookieName: 'session',
    secret: 'randomsecretstringssshhh123',
    duration: 30 * 60 * 1000,
    activeDuration: 5 * 60 * 1000,
}));

//middleware, serves static files
app.use('/', express.static(path.join(__dirname, 'public')));

//read urls and receive json from post requests
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

//connect to mysql database
var con = mysql.createConnection({
    host: "csdb.wheaton.edu",
    port: "3306",
    user: "reslife_user",
    password: "rez4Life!)GrTZ",
    database: "reslife"
});

/**
 * API data requests
 */

//get all data from designated table
//SELECT * FROM 'table'
app.get('/api/:table', (req, res) => {
    api.getAllFromTable(req, res, req.params.table);
});

//get all data from a specific column 
//SELECT  + column +  FROM  + table
app.get('/api/:table/:column', (req, res) => {
    api.getColumnFromTable(req, res, req.params.table, req.params.column);
});

//get the row of data conditional to data of a specific column
//SELECT * FROM + table + WHERE + column + row
app.get('/api/:table/:column/:row', (req, res) => {
    api.getRowFromTableEqual(req, res, req.params.table, req.params.column, req.params.row);
});

/**
 * HTML get requests, render handlebar files
 */
app.get('/', function (req, res) {
    req.session.user = null;
    res.sendFile(path.join(__dirname, 'views/homepage.html'));
});

app.get('/demo', (req, res) => {
    res.sendFile(path.join(__dirname, 'views/demo.html'));
});

app.post('/demo', (req, res) => {
    res.send("you posted! Nice.");
});

app.get('/login', function (req, res) {
    req.session.user = null;
    res.sendFile(path.join(__dirname, 'views/login.html'));
});

app.use('/resapp', app_routes);

//post method called after the login button is pressed
app.post('/login', function (req, res) {
    //make sure there is no current user logged in, this also takes care of logout
    req.session.user = null;
    //if email and password were entered
    if (req.body && req.body.email && req.body.password) {
        var email = req.body.email;
        var password = req.body.password;
        //find the user in the database
        con.query('SELECT * FROM t_users WHERE email = ?', [email], function (error, results, fields) {
            if (error) {
                console.log("Error occurred:", error);
                res.send({
                    "code": 400,
                    "failed": "error ocurred"
                })
            } else {
                console.log('Results: ', results);
                //check if the user email exists
                if (results.length > 0) {
                    //verify the password entered
                    bcrypt.compare(password, results[0].password, function (err, check) {
                        if (check == false) {
                            res.send({
                                "code": 204,
                                "success": "Email and password do not match"
                            });
                        } else {
                            req.user = results[0];
                            delete req.user.password; // delete the password from the session
                            req.session.user = req.user;  //refresh the session value
                            res.redirect('/resapp');
                        }
                    });
                } //error handling
                else {
                    res.send({
                        "code": 204,
                        "success": "Email does not exist"
                    });
                }
            }
        });
    } else {
        res.send({
            "code": 400,
            "failed": "Must enter email and password."
        });
    }
});

//post method called after the create button is pressed
app.post('/accounts', function (req, res) {
    //authentication and only allow admin to create an account
    if (req.session && req.session.user && req.session.user.role == "Admin") {
        //if an email and role were entered
        if (req.body && req.body.email && req.body.role) {
            //make sure the role is valid
            if (req.body.role == "RA" || req.body.role == "Admin") {
                createAccount.addAccount(con, req.body.email, req.body.role, res);
            } else {
                res.send({
                    "code": "400",
                    "failed": "Error: must select a role."
                });
            }
        } //error handling
        else {
            if (req.body) res.send({
                "code": "400",
                "failed": "Error: must enter email and select role."
            });
            else res.send({
                "code": "400",
                "failed": "Error: no parameters received."
            });
        }
    } else {
        res.redirect("/login");
    }
});

//post method called after the delete button is pressed
app.post('/deleteAccount', function (req, res) {
    //authentication and only allow admins to delete an account
    if (req.session && req.session.user && req.session.user.role == "Admin") {
        //if email was entered
        if (req.body && req.body.email) {
            var email = req.body.email;
            //delete the user from the database
            var sql = `DELETE FROM t_users WHERE email = ?`;
            con.query(sql, email, function (err, result) {
                if (err) {
                    res.send({
                        "code": "400",
                        "failed": err
                    });
                } else {
                    console.log("1 record deleted:", result);
                    res.send("Account deleted");
                }
            });
        } //error handling
        else {
            res.send({
                "code": "400",
                "failed": "Error: must enter email to delete account."
            });
        }
    } else {
        res.redirect("/login");
    }
});

//post method called after the update button is pressed
app.post('/settings', function (req, res) {
    //authentication
    if (req.session && req.session.user) {
        //if new password was entered twice
        if (req.body && req.body.password && req.body.passcheck) {
            //verify that passwords match
            if (req.body.password == req.body.passcheck) {
                var email = req.session.user.email;
                //encrypt the password
                bcrypt.hash(req.body.password, saltRounds, function (err, hash) {
                    if (err) {
                        res.send({
                            "code": "400",
                            "error": err
                        });
                        console.log("Error hashing password: " + err);
                    } else {
                        //update the user's password
                        var sql = `UPDATE t_users SET password = '${hash}' WHERE email = '${email}'`;
                        con.query(sql, function (err, result) {
                            if (err) {
                                res.send({
                                    "code": "400",
                                    "failed": err
                                });
                            } else {
                                res.send("Password updated!");
                                console.log("1 record updated:", result);
                            }
                        });
                    }
                });
            } //error handling
            else {
                res.send({
                    "code": "400",
                    "failed": "Error: passwords do not match."
                });
            }
        } else {
            res.send({
                "code": "400",
                "failed": "Error: must enter new password to update."
            });
        }
    } else {
        res.redirect("/login");
    }
});

// This handles the uploading done in the roster tab.
app.post('/resapp/upload', function (req, res) {
    //authentication, only admin can upload document
    if (req.session && req.session.user && req.session.user.role == "Admin") {
        if (!req.files)
            return res.status(400).send('No files were uploaded.');

        // The name of the input field is used to retrieve the uploaded file
        var chart = req.files.chartupload;

        var chartid = req.body["dorm"] + req.body["semester"] + req.body["year"];

        // Use the mv() method to place the file somewhere on your server
        chart.mv(path.join(__dirname, 'chart'), function (err) {
            if (err) {
                return res.status(500).send(err);
            }

            // after uploading, send you back to the roster page.
            res.redirect("/resapp/roster");
            var con = mysql.createConnection({
                host: "csdb.wheaton.edu",
                user: "reslifeadmin",
                password: "eoekK8bRe4wa",
                database: "reslife"
            });

            chartParser.parseIntoDatabase(con, "./chart", chartid, req.body["year"], function () {
                // After dealing with the file, delete it.
                fs.unlink(path.join(__dirname, 'chart'), function (err) { });
            });

            con.end;
        });
    } else {
        res.redirect('/login');
    }
});

// // 404 catch-all handler (middleware)
// app.use(function(req, res, next){
//     res.status(404);
//     res.render('404');
// });
// // 500 error handler (middleware)
// app.use(function(err, req, res, next){
//     console.error(err.stack);
//     res.status(500);
//     res.render('500');
// });

//the server is listening on port 3000. access in browser with localhost:3000
app.listen(3000, function (req, res) {
    console.log('Listening on port 3000...');
});
