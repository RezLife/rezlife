//modules
var generator = require('generate-password');
var sendEmail = require('./sendEmail.js');
var bcrypt = require('bcrypt');
const saltRounds = 11; //number of salt rounds for encryption

//create new user
exports.addAccount = function (con, email, role, dorm, floor, res) {
    var password = generator.generate();

    //send email with the temporary password
    sendEmail.emailPassword(email, password);

    //encrypt the password
    bcrypt.hash(password, saltRounds, function (err, hash) {
        if (err) {
            res.send ({
                "code": "400",
                "error": err
            });
            console.log("Error hashing password: " + err);
        } else {
            //insert new user into the database
            var sql = `INSERT INTO t_users (email, password, role, floor, building) VALUES ('${email}', '${hash}', '${role}', '${floor}', '${dorm}')`;
            con.query(sql, function (err, result) {
                if (err) {
                    res.send({
                        "code": "400",
                        "failed": err
                    });
                } else {
                    res.send("Account added!");
                    console.log("1 record inserted:", result);
                }
            });
        }
    });
};