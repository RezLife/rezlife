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
var generator = require('generate-password');
var session = require('client-sessions');
let api = require('./model/api.js');
var app = express();
let handlebars = require('express-handlebars');

app.use(fileUpload());

//set template engine
app.engine('handlebars', handlebars({
    //main layout in views/layout/main.handlebars
    defaultLayout: 'main',
    //helper to inject head/script files in template
    helpers: {
        section: function(name, options){
            if(!this._sections) this._sections = {};
            this._sections[name] = options.fn(this);
            return null;
        }
    }
}));

app.set('view engine', 'handlebars');

//sessions allows for persistent logins with authentication
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
app.get('/api/:table', (req,res) => {
    api.getAllFromTable(req,res,req.params.table);
});

//get all data from a specific column 
//SELECT  + column +  FROM  + table
app.get('/api/:table/:column', (req,res) => {
    api.getColumnFromTable(req,res,req.params.table,req.params.column);
});

//get the row of data conditional to data of a specific column
//SELECT * FROM + table + WHERE + column + row
app.get('/api/:table/:column/:row', (req,res) => {
    api.getRowFromTableEqual(req,res,req.params.table,req.params.column,req.params.row);
});

/**
 * HTML get requests, render handlebar files
 */
app.get('/', function (req, res) {
    req.session.user = null;
    res.sendFile(path.join(publicPath, 'views/home', 'homepage.html'));
});

app.get('/login', function (req, res) {
    req.session.user = null;
    res.sendFile(path.join(publicPath, 'views/login', 'login.html'));
});

app.get('/resapp', function (req, res) {
    res.render('resapp');
});

app.get('/accounts', function (req, res) {
    res.render('accounts');
    //safe version
/*if (req.session && req.session.user) {
    res.sendFile(path.join(publicPath, 'views/webapp', 'accounts.html'));
} else {
    res.redirect('/login');
}*/
});

app.get('/settings', function (req, res) {
    res.render('settings');
});

app.get('/roster', function (req, res) {
    res.render('roster');
});
app.get('/calendar', function (req, res) {
    res.render('calendar');
});
app.get('/inopen', function (req, res) {
    res.render('inopen');
});
app.get('/emergency', function (req, res) {
    res.render('emergency');
});

//handles get requests for account
app.post('/login', function (req, res) {
    req.session.user = null;
    if (req.body && req.body.email && req.body.password) {
        var email = req.body.email;
        var password = req.body.password;
        con.query('SELECT * FROM t_users WHERE email = ?', [email], function (error, results, fields) {
            if (error) {
                console.log("Error occurred:", error);
                res.send({
                    "code": 400,
                    "failed": "error ocurred"
                })
            } else {
                console.log('Results: ', results);
                if (results.length > 0) {
                    if (results[0].password == password) {
                        req.user = results[0];
                        delete req.user.password; // delete the password from the session
                        req.session.user = req.user;  //refresh the session value
                        res.sendFile(path.join(publicPath, 'views/webapp', 'resapp.html'));
                    }
                    else {
                        res.send({
                            "code": 204,
                            "success": "Email and password do not match"
                        });
                    }
                }
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

app.post('/accounts', function (req, res) {
        if (req.body && req.body.email && req.body.role) {
            if (req.body.role == "Select") {
                res.send({
                    "code": "400",
                    "failed": "Error: must select a role."
                });
            } else {
                var email = req.body.email;
                var password = generator.generate();
                var role = req.body.role;
                var sql = `INSERT INTO t_users (email, password, role) VALUES ('${email}', '${password}', '${role}')`;
                con.query(sql, function (err, result) {
                    if (err) {
                        res.send({
                            "code": "400",
                            "failed": err
                        });
                        throw err;
                    } else {
                        res.send("Account added!");
                        console.log("1 record inserted:", result);
                    }
                });
            }
        } else {
            if (req.body) res.send({
                "code": "400",
                "failed": "Error: must enter email and select role."
            });
            else res.send({
                "code": "400",
                "failed": "Error: no parameters received."
            });
        }
});

app.post('/deleteAccount', function (req, res) {
        if (req.body && req.body.email) {
            var email = req.body.email;
            var sql = `DELETE FROM t_users WHERE email = '${email}'`;
            con.query(sql, function (err, result) {
                if (err) {
                    res.send({
                        "code": "400",
                        "failed": err
                    });
                    throw err;
                } else {
                    console.log("1 record deleted:", result);
                    res.send("Account deleted");
                }
            });
        } else {
            if (req.body) res.send(req.body);
            else res.send({
                "code": "400",
                "failed": "Error: must enter email to delete account."
            });
        }
});

app.post('/settings', function (req, res) {
    if (req.body && req.body.password && req.body.passcheck) {
        if (req.body.password == req.body.passcheck) {
            var email = req.session.user.email;
            //need to encrypt this password
            var password = req.body.password;
            var sql = `UPDATE t_users SET password = '${password}' WHERE email = '${email}'`;
            con.query(sql, function (err, result) {
                if (err) {
                    res.send({
                        "code": "400",
                        "failed": err
                    });
                    throw err;
                } else {
                    console.log("1 record updated:", result);
                }
            });
        } else {
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
});

// This handles the uploading done in the roster tab.
app.post('/upload', function (req, res) {
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
        res.redirect("/roster");
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
