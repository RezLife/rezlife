//update the password for a user
exports.updatePass = function (req, res, con) {
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
}