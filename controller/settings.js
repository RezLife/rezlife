var bcrypt = require('bcrypt');
const saltRounds = 11; //number of salt rounds for encryption
var api = require("../model/api.js");

//update the password for a user
exports.updatePass = function (req, res, log) {
    //if new password was entered twice
    if (req.body && req.body.password && req.body.passcheck) {
        //verify that passwords match
        if (req.body.password == req.body.passcheck) {
            var email = req.session.user.email;
            //encrypt the password
            bcrypt.hash(req.body.password, saltRounds, function (err, hash) {
                if (err) {
                    log.info("Error hashing password: " + err);
                    res.send({
                        "code": "400",
                        "error": err
                    });
                    console.log("Error hashing password: " + err);
                } else {
                    //update the user's password
                    api.updatePass(res, hash, email);
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
}