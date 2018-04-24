//modules
var generator = require('generate-password');
var sendEmail = require('./sendEmail.js');
var bcrypt = require('bcrypt');
const saltRounds = 11; //number of salt rounds for encryption

//check if a valid floor and building were selected
exports.verifyFloor = function (floor, building) {
    //floors in Fischer
    if (building == "Fischer") {
        //West floors
        if (floor == "1 West" || floor == "2 West" || floor == "3 West" || floor == "4 West" || floor == "5 West") {
            return true;
        } //South floors
        else if (floor == "3 South" || floor == "4 South" || floor == "5 South") {
            return true;
        } //East floors
        else if (floor == "2 East" || floor == "3 East" || floor == "4 East" || floor == "5 East") {
            return true;
        } else return false;
    } //floors in Smith-Traber
    else if (building == "Smaber") {
        //South floors
        if (floor == "1 South" || floor == "2 South" || floor == "3 South") {
            return true;
        } //East floors
        else if (floor == "2 East" || floor == "3 East") {
            return true;
        } //Traber floors
        else if (floor == "Traber 2" || floor == "Traber 3" || floor == "Traber 4" || floor == "Traber 5" || floor == "Traber 6" || floor == "Traber 7") {
            return true;
        } else return false;
    }
    else if (building == "UCH")  {
        //McManis floors
        if(floor == "McManis 1" || floor == "McManis 2" || floor == "McManis 3" || floor == "McManis 4" || floor == "McManis 5"){
            return true;
        }
        //Evans
        else if(floor == "Evans 1" || floor == "Evans 2" || floor == "Evans 3"|| floor == "Evans 4" || floor == "Evans 5" ){
            return true;
        }
        //Williston
        else if(floor == "Willie 1" || floor == "Willie 2" || floor == "Willie 3"){
            return true;
        }
        else{
            return false;
        }
    }
    return false;
};

//create new user
exports.addAccount = function (con, email, role, dorm, floor, res, log) {
    var password = generator.generate();
    var unencrypted = password;
    //encrypt the password
    bcrypt.hash(password, saltRounds, function (err, hash) {
        if (err) {
            log.info("Error hashing password: " + err);
            res.send({
                "code": "400",
                "error": err
            });
        } else {
            //send email with the temporary password
            sendEmail.emailPassword(email, unencrypted, log);
            //insert new user into the database
            var sql = `REPLACE INTO t_users (email, password, role, floor, building) VALUES ('${email}', '${hash}', '${role}', '${floor}', '${dorm}')`;
            con.query(sql, function (err, result) {
                if (err) {
                    log.info("Error replacing user: " + err);
                    res.send({
                        "code": "400",
                        "failed": err
                    });
                } else {
                    res.send("Account added!");
                }
            });
        }
    });
};