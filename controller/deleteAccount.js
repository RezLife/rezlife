var api = require("../model/api.js");

//delete an account from the database
exports.deleteAccount = function (req, res, log) {
    //if email was entered
    if (req.body && req.body.email) {
        var email = req.body.email;
        //delete the user from the database
        api.deleteUserByEmail(res, email);
    } //error handling
    else {
        res.send({
            "code": "400",
            "failed": "Error: must enter email to delete account."
        });
    }
}