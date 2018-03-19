
//"import" express javascript library
var express = require('express');
var bodyParser = require('body-parser');
var path = require('path');
var fs = require('fs');
var mysql = require('mysql');
var fileUpload = require('express-fileupload');
var chartParser = require('./chartParser.js');
var generator = require('generate-password');
var session = require('client-sessions');

//the function returns an express "object", which we can do all sorts of things with
var app = express();
app.use(fileUpload());
var publicPath = path.join(__dirname, 'public');

//sessions allows for persistent logins with authentication
app.use(session({
    cookieName: 'session',
    secret: 'randomsecretstringssshhh123',
    duration: 30 * 60 * 1000,
    activeDuration: 5 * 60 * 1000,
}));

//connect to mysql database
var con = mysql.createConnection({
    host: "localhost",
    port: "3306",
    user: "guest",
    password: "guestpass",
    database: "testdb"
});

//middleware, serves static files
app.use('/', express.static(publicPath));

//read urls and receive json from post requests
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

//handles requests
app.get('/', function (req, res) {
    req.session.user = null;
    res.sendFile(path.join(publicPath, 'views/home', 'homepage.html'));
});

app.get('/login', function (req, res) {
    req.session.user = null;
    res.sendFile(path.join(publicPath, 'views/login', 'login.html'));
});

app.post('/login', function (req, res) {
    req.session.user = null;
    if (req.body && req.body.email && req.body.password) {
        var email = req.body.email;
        var password = req.body.password;
        con.query('SELECT * FROM user WHERE email = ?', [email], function (error, results, fields) {
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

app.get('/resapp', function (req, res) {
        res.sendFile(path.join(publicPath, 'views/webapp', 'resapp.html'));
});

app.get('/accounts', function (req, res) {
    //safe version
    /*if (req.session && req.session.user) {
        res.sendFile(path.join(publicPath, 'views/webapp', 'accounts.html'));
    } else {
        res.redirect('/login');
    }*/
    res.sendFile(path.join(publicPath, 'views/webapp', 'accounts.html'));
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
                var sql = `INSERT INTO user (email, password, role) VALUES ('${email}', '${password}', '${role}')`;
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
            var sql = `DELETE FROM user WHERE email = '${email}'`;
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

app.get('/settings', function (req, res) {
    res.sendFile(path.join(publicPath, 'views/webapp', 'settings.html'));
});

app.post('/settings', function (req, res) {
    if (req.body && req.body.password && req.body.passcheck) {
        if (req.body.password == req.body.passcheck) {
            //update password in database
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

app.get('/roster', function (req, res) {
    res.sendFile(path.join(publicPath, 'views/webapp', 'roster.html'));
});
app.get('/calendar', function (req, res) {
    res.sendFile(path.join(publicPath, 'views/webapp', 'calendar.html'));
});
app.get('/inopen', function (req, res) {
    res.sendFile(path.join(publicPath, 'views/webapp', 'inopen.html'));
});
app.get('/emergency', function (req, res) {
    res.sendFile(path.join(publicPath, 'views/webapp', 'emergency.html'));
});

app.get('/blank', function (req, res) {
    res.sendFile(path.join(publicPath, 'views/webapp', 'blank.html'));
});

// This handles the uploading done in the roster tab.
app.post('/upload', function (req, res) {
    if (!req.files)
        return res.status(400).send('No files were uploaded.');

    // The name of the input field is used to retrieve the uploaded file
    var chart = req.files.chartupload;

    console.log("Dorm: " + req.body["dorm"] + "\nSemester: " + req.body["semester"] + " of "
        + req.body["year"]);

    var chartid = req.body["dorm"] + req.body["semester"] + req.body["year"];

    // Use the mv() method to place the file somewhere on your server
    chart.mv(path.join(__dirname, 'chart'), function (err) {
        if (err) {
            return res.status(500).send(err);
        }

        // after uploading, send you back to the roster page.
        res.redirect("/roster");
        var con = mysql.createConnection({
            host: "localhost",
            user: "root",
            password: "",
            database: "housing"
        });

        chartParser.parseIntoDatabase(con, "./chart", chartid, function () {
            // After dealing with the file, delete it.
            fs.unlink(path.join(__dirname, 'chart'), function (err) { });
        });
    });
});




//the server is listening on port 3000. access in browser with localhost:3000
app.listen(3000, function (req, res) {
    console.log('Listening on port 3000...');
});
