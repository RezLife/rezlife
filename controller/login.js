var sendEmail = require('./sendEmail.js');
var bcrypt = require('bcrypt');
const saltRounds = 11; //number of salt rounds for encryption
var generator = require('generate-password');

exports.forgotPass = function (req, res, con) {
    var email = req.body.email;
    var password = generator.generate();

    //verify that the email is for a valid account
    var sql = `SELECT * FROM t_users WHERE email = '${email}'`;
    con.query(sql, function (err, result) {
        if (err) {
            console.log(err);
            return res.status(400).send(err);
        } else if (result.length > 0) {
            //send email with the temporary password
            sendEmail.emailPassword(email, password);

            //encrypt the password
            bcrypt.hash(password, saltRounds, function (err, hash) {
                if (err) {
                    console.log("Error hashing password: " + err);
                } else {
                    //update user password
                    var sql = `UPDATE t_users SET password = '${hash}' WHERE email = '${email}'`;
                    con.query(sql, function (err, result) {
                        if (err) {
                            console.log(err);
                        } else {
                            console.log("1 record updated");
                        }
                    });
                }
            });
            res.redirect("/login");
        }
        else {
            console.log("No user found: ", result);
            return res.status(400).send('No user found with that email.');
        }
    });
}