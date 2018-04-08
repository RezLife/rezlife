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
app.use('/resapp', express.static(path.join(__dirname, 'public')));

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
// app.get('/api/:table', (req, res) => {
//     api.getAllFromTable(req, res, req.params.table);
// });
//
// //get all data from a specific column
// //SELECT  + column +  FROM  + table
// app.get('/api/:table/:column', (req, res) => {
//     api.getColumnFromTable(req, res, req.params.table, req.params.column);
// });
//
// //get the row of data conditional to data of a specific column
// //SELECT * FROM + table + WHERE + column + row
// app.get('/api/:table/:column/:row', (req, res) => {
//     api.getRowFromTableEqual(req, res, req.params.table, req.params.column, req.params.row);
// });

// Get all data relating to students
app.get('/resapp/api/students', (req, res) => {
    api.getAllStudents(req, res);
});

// Get all data about students in a specific building
// TRABE SMITH FISCH MCMAN EVANS ...
app.get('/resapp/api/students/:building', (req, res) => {
    api.getAllFromBuilding(req, res, req.params.building);
});

// Get all data about students on a specific floor
// Traber: 2 3 4 5 6 7 Smith: S1 E2 S2 E3 S3 Fischer: E2-5 S3-5 W1-5
app.get('/resapp/api/students/:building/:floor', (req, res) => {
    api.getAllFromFloor(req, res, req.params.building, req.params.floor);
});

// Get all data about students in a specific room
// examples: 211 E408 S100 613 ...
app.get('/resapp/api/students/:building/:floor/:room', (req, res) => {
    api.getAllFromRoom(req, res, req.params.building, req.params.floor, req.params.room);
});

// Search for students who's attributes match the query string.
app.get('/resapp/api/stu-search/:query', (req, res) => {
    api.searchAllStudents(req, res, req.params.query);
});

// Add a student to the roster
app.get('/resapp/api/students/add/:first/:last/:preferred/:email/:id/:dob/:year/:class/:state/:city/:rsd', (req, res) => {
    api.addStudent(req, res, [req.params.first, req.params.last, req.params.preferred, req.params.email, req.params.id, 
        req.params.dob, req.params.year, req.params.class, req.params.state, req.params.city, req.params.rsd]);
});

// Delete a student from the roster by ID
app.delete('/resapp/api/student/:id', (req, res) => {
    console.log("thing");
    api.deleteStudent(req, res, req.params.id);
});

/**
 * HTML get requests, render handlebar files
 */
app.get('/', function (req, res) {
    req.session.user = null;
    res.sendFile(path.join(__dirname, 'views/homepage.html'));
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
                return res.status(400).send('Error occured.');
                // res.send({
                //     "code": 400,
                //     "failed": "error ocurred"
                // })
            } else {
                console.log('Results: ', results);
                //check if the user email exists
                if (results.length > 0) {
                    //verify the password entered
                    bcrypt.compare(password, results[0].password, function (err, check) {
                        if (check == false) {
                            // res.send({
                            //     "code": 204,
                            //     "success": "Email and password do not match"
                            // });
                            return res.status(400).send('Email and password do not match.');
                        } else {
                            req.user = results[0];
                            delete req.user.password; // delete the password from the session
                            req.session.user = req.user;  //refresh the session value
                            
                            res.send({redirect: '/resapp'}); //send redirect to AJAX
                        }
                    });
                } //error handling
                else {
                    // res.send({
                    //     "code": 204,
                    //     "success": "Email does not exist"
                    // });
                    return res.status(400).send('Email does not exist.');
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
        // send error when no file is uploaded.
        if (!req.files.chartupload) {
            return res.status(400).send('No files were uploaded.');
        }

        // The name of the input field is used to retrieve the uploaded file
        var chart = req.files.chartupload;

        var chartid = req.body["dorm"] + req.body["semester"] + req.body["year"];

        // Use the mv() method to place the file somewhere on your server
        chart.mv(path.join(__dirname, 'chart'), function (err) {
            if (err) return res.status(500).send(err);

            // connect to the database as the reslifeadmin
            var con = mysql.createConnection({
                host: "csdb.wheaton.edu",
                user: "reslifeadmin",
                password: "eoekK8bRe4wa",
                database: "reslife"
            });
            // Parse the uploaded file into the database with the chartParser.js
            chartParser.parseIntoDatabase(con, "./chart", chartid, req.body["year"], function (errstr) {
                // if ChartParser sends an error, send it back to the page.
                if (errstr) return res.status(400).send(errstr);
                // After dealing with the file, delete it.
                fs.unlink(path.join(__dirname, 'chart'), function (err) {
                    // otherwise, everything is good! Send a success message.
                    res.status(200).send("File successfully uploaded and parsed!");
                });
            });

            con.end;
        });
    } else {
        res.redirect('/login');
    }
});

// This sends a floor chart with the necessary information
app.get('/resapp/printlist', function (req, res) {
    //authentication, only admin print floor charts
    if (req.session && req.session.user && req.session.user.role == "Admin") {
        console.log(req.query);
        printlistParams = [req.query["dorm"].split(" ")[0], req.query["dorm"].split(" ")[1] + '%', parseInt(req.query["year"], 10)];
        res.send();
    } else {
        res.redirect('/login');
    }
});

app.get('/resapp/floorlist', function (req, res) {
    //authentication, only admin print floor charts
    if (req.session && req.session.user && req.session.user.role == "Admin") {
        res.sendFile(path.join(__dirname, 'views/floorlist.html'));
    } else {
        res.redirect('/login');
    }
})

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
