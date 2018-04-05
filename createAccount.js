var generator = require('generate-password');
var nodemailer = require('nodemailer');
var bcrypt = require('bcrypt');
const saltRounds = 11; //number of salt rounds for encryption

//email account settings
var transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
        user: 'noreplyrezlife@gmail.com',
        pass: 'eK2BieN83'
    }
});

//create new user
exports.addAccount = function (con, email, role, res) {
    var password = generator.generate();
    //really cheap way to get around needing different floors, need to change eventually
    var num = generator.generate();

    //layout for the email
    var mailOptions = {
        from: 'noreplyrezlife@gmail.com',
        to: email,
        subject: 'Resident Life Account Creation',
        text: 'This is your temporary password: ' + password + 
        '. Go to the Settings tab to update your password after logging in.' + 
        '- Rezlife App Team'
    };

    //send the email with temporary password
    transporter.sendMail(mailOptions, function (error, info) {
        if (error) {
            console.log(error);
        } else {
            console.log('Email sent: ' + info.response);
        }
    });

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
            var sql = `INSERT INTO t_users (email, password, role, floor, building) VALUES ('${email}', '${hash}', '${role}', '${num}', 'Test')`;
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