//delete an account from the database
exports.deleteAccount = function (req, res, con) {
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
}