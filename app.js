/**
 * app.js
 * Load modules
 */
let api = require('./model/api.js');
var bcrypt = require('bcrypt');
var bodyParser = require('body-parser');
var chartParser = require('./chartParser.js');
var createAccount = require('./controller/createAccount.js');
var deleteAccount = require('./controller/deleteAccount.js');
var express = require('express');
var fileUpload = require('express-fileupload');
var fs = require('fs');
var generator = require('generate-password');
let handlebars = require('express-handlebars');
var log = require('simple-node-logger').createSimpleLogger('errors.log');
var login = require('./controller/login.js');
var mysql = require('mysql');
var path = require('path');
let resapp = require('./routes/resapp');
var sendEmail = require('./controller/sendEmail.js');
var session = require('client-sessions');
var settings = require('./controller/settings.js');
const saltRounds = 11; //number of salt rounds for encryption

var app = express();

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
app.use('/login', express.static(path.join(__dirname, 'public')));
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

// Get all data relating to students ordered by order
app.get('/resapp/api/students/:order', (req, res) => {
    if (req.session && req.session.user) {
        api.getAllStudents(req, res, req.params.order);
    } else {
        res.redirect('/login');
    }
});

// Get all data about students in a specific building ordered by order
// TRABE SMITH FISCH MCMAN EVANS ...
app.get('/resapp/api/students/:building/:order', (req, res) => {
    if (req.session && req.session.user) {
        api.getAllFromBuilding(req, res, req.params.building, req.params.order);
    } else {
        res.redirect('/login');
    }
});

// Get all data about students on a specific floor ordered by order
// Traber: 2 3 4 5 6 7 Smith: S1 E2 S2 E3 S3 Fischer: E2-5 S3-5 W1-5
app.get('/resapp/api/students/:building/:floor/:order', (req, res) => {
    if (req.session && req.session.user) {
        api.getAllFromFloor(req, res, req.params.building, req.params.floor, req.params.order);
    } else {
        res.redirect('/login');
    }
});

// Get all data about students in a specific room ordered by order
// examples: 211 E408 S100 613 ...
app.get('/resapp/api/students/:building/:floor/:room/:order', (req, res) => {
    if (req.session && req.session.user) {
        api.getAllFromRoom(req, res, req.params.building, req.params.floor, req.params.room, req.params.order);
    } else {
        res.redirect('/login');
    }
});

// Search for students who's attributes match the query string ordered by order
app.get('/resapp/api/stu-search/:query/:order', (req, res) => {
    if (req.session && req.session.user) {
        api.searchAllStudents(req, res, req.params.query, req.params.order);
    } else {
        res.redirect('/login');
    }
});

// Add a student to the roster
app.get('/resapp/api/students/add/:first/:last/:preferred/:email/:id/:dob/:year/:class/:state/:city/:building/:floor/:room', (req, res) => {
    if (req.session && req.session.user) {
        api.addStudent(req, res, [req.params.first, req.params.last, req.params.preferred, req.params.email, req.params.id,
        req.params.dob, req.params.year, req.params.class, req.params.state, req.params.city, req.params.building, req.params.floor, req.params.room]);
    } else {
        res.redirect('/login');
    }
});

// Load in Building Drown Down list
app.get('/resapp/api/load-building-list', (req, res) => {
    if (req.session && req.session.user) {
        api.loadBuildingList(req, res);
    } else {
        res.redirect('/login');
    }
});

// Load in building name by ID
app.get('/resapp/api/load-building-name/:id', (req, res, id) => {
    if (req.session && req.session.user) {
        api.loadBuildingNameByID(req, res, req.params.id);
    } else {
        res.redirect('/login');
    }
});

// Load in the floor list by building
app.get('/resapp/api/load-floor-list/:buildingid', (req, res) => {
    if (req.session && req.session.user) {
        api.loadFloorsFromBuilding(req, res, req.params.buildingid);
    } else {
        res.redirect('/login');
    }
});

// Delete a student from the roster by ID
app.delete('/resapp/api/stu-del-id/:id', (req, res) => {
    if (req.session && req.session.user) {
        api.deleteStudentByID(req, res, req.params.id);
    } else {
        res.redirect('/login');
    }
});

// Delete Students based on buildingID
app.delete('/resapp/api/stu-del-building/:building', (req, res) => {
    if (req.session && req.session.user) {
        api.deleteStudentByBuilding(req, res, req.params.building);
    } else {
        res.redirect('/login');
    }
});

// Delete all students
app.delete('/resapp/api/stu-del-all/:building', (req, res) => {
    if (req.session && req.session.user) {
        api.deleteAllStudents(req, res);
    } else {
        res.redirect('/login');
    }
});

/**
 * Page HTML get requests, render handlebar/HTML files
 */
app.get('/', function (req, res) {
    req.session.user = null;
    res.sendFile(path.join(__dirname, 'views/homepage.html'));
});

app.get('/login', function (req, res) {
    req.session.user = null;
    res.sendFile(path.join(__dirname, 'views/login.html'));
});

app.get('/login/forgot', function (req, res) {
    req.session.user = null;
    res.sendFile(path.join(__dirname, 'views/forgot-password.html'));
});

app.get('/credits', function (req, res) {
    req.session.user = null;
    res.sendFile(path.join(__dirname, 'views/credits.html'))
})

//render files from the resapp route
app.use('/resapp', resapp);

//post method called after a user enters their email address to change their password
app.post('/login/forgot', function (req, res) {
    req.session.user = null;
    if (req.body && req.body.email) {
        login.forgotPass(req, res, con, log);
        res.status(200);
    } else {
        return res.status(400).send('Must enter email.');
    }
});

app.post('/contact', function (req, res) {
    if (req.body && req.body.comment) {
        if (req.body.email) {
            //send email with the feedback
            sendEmail.emailFeedback(req.body.email, req.body.comment, log);
        } else {
            //send email with the feedback
            sendEmail.emailFeedback("No email entered", req.body.comment, log);
        }
    }
    res.redirect('/resapp');
});

//post method called after the login button is pressed
app.post('/login', function (req, res) {
    //make sure there is no current user logged in, this also takes care of logout
    req.session.user = null;

    //if email and password were entered
    if (req.body && req.body.email && req.body.password) {
        login.login(req, res, con, log);
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
                if (req.body.role == "RA") {
                    //make sure RA has valid dorm building and floor
                    if (req.body.dorm && req.body.floor && (req.body.dorm == "Fischer" || req.body.dorm == "Smaber" || req.body.dorm == "UCH")) {
                        if (createAccount.verifyFloor(req.body.floor, req.body.dorm) == true) {
                            createAccount.addAccount(con, req.body.email, req.body.role, req.body.dorm, req.body.floor, res, log);
                        }
                        else {
                            res.send({
                                "code": "400",
                                "failed": "Error: must select valid floor for an RA."
                            });
                        }
                    } else {
                        res.send({
                            "code": "400",
                            "failed": "Error: must select a dorm and floor for an RA."
                        });
                    }
                }
                else createAccount.addAccount(con, req.body.email, req.body.role, ' ', ' ', res);
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
        deleteAccount.deleteAccount(req, res, con, log);
    } else {
        res.redirect("/login");
    }
});

//post method called after the update button is pressed
app.post('/settings', function (req, res) {
    //authentication
    if (req.session && req.session.user) {
        settings.updatePass(req, res, con, log);
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
        var dorm = req.body["dorm"];

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
            // if reset was selected in the upload form, first delete everything from
            // the selected building.
            if (req.body["add-reset"] === "reset") {
                // if 'all dorms' was selected, that means they are reuploading the
                // csv that will have all students in it, and we should delete everything
                // from the database;
                if (dorm === "all") {
                    con.query("DELETE FROM t_students", function (err, result, fields) {
                        if (err) {
                            log.info(err);
                            return res.status(500).send(error);
                        }
                    });
                }
                else {
                    con.query('DELETE FROM t_students WHERE building=?',
                        dorm, (err, results, fields) => {
                            if (err) {
                                log.info(err);
                                return res.status(500).send(err);
                            }
                        });
                }
            }
            // Parse the uploaded file into the database with the chartParser.js
            chartParser.parseIntoDatabase(con, "./chart", function (errstr) {
                // if ChartParser sends an error, send it back to the page.
                if (errstr) {
                    log.info(errstr);
                    return res.status(400).send("3 " + errstr);
                }
                // After dealing with the file, delete it.
                fs.unlink(path.join(__dirname, 'chart'), function (err) {
                    // otherwise, everything is good! Send a success message.
                    res.status(200).send("File successfully uploaded and parsed!");
                });
            });

            //con.end;
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

// 404 catch-all handler (middleware)
app.use(function (req, res, next) {
    res.status(404);
    res.sendFile(path.join(__dirname, 'views/404.html'));
});

//the server is listening on port 3000. access in browser with localhost:3000
app.listen(3000, function (req, res) {
    console.log('Listening on port 3000...');
});
