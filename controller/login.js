//modules
var api = require("../model/api.js");
var sendEmail = require('./sendEmail.js');
var bcrypt = require('bcrypt');
const saltRounds = 11; //number of salt rounds for encryption
var generator = require('generate-password');

exports.login = function (req, res, log) {
    var email = req.body.email;
    var password = req.body.password;
    //find the user in the database
    api.getUser(res, email, function (results, error) {
        if (error) {
            log.info("Error getting user: " + error);
            return res.status(400).send('Error occured.');
        } else {
            //check if the user email exists
            if (results.length > 0) {
                //verify the password entered
                bcrypt.compare(password, results[0].password, function (err, check) {
                    if (check == false) {
                        return res.status(400).send('Email and password do not match.');
                    } else {
                        req.user = results[0];
                        delete req.user.password; // delete the password from the session
                        req.session.user = req.user;  //refresh the session value

                        res.send({ redirect: '/resapp' }); //send redirect to AJAX
                    }
                });
            } //error handling
            else {
                return res.status(400).send('Email does not exist.');
            }
        }
    });
}

exports.forgotPass = function (req, res, log) {
    var email = req.body.email;
    var password = generator.generate();

    //verify that the email is for a valid account
    api.getUser(res, email, function (users, error) {
        if (users && users.length > 0) {
            //send email with the temporary password
            sendEmail.emailPassword(email, password, log);

            //encrypt the password
            bcrypt.hash(password, saltRounds, function (err, hash) {
                if (err) {
                    log.info(err);
                    console.log("Error hashing password: " + err);
                } else {
                    //update user password
                    api.updatePass(res, hash, email);
                }
            });
        } else {
            console.log("No user found: ", error);
            return res.status(400).send('No user found with that email.');
        }
    });
}