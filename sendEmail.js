//modules
var nodemailer = require('nodemailer');

//email account settings
var transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
        user: 'noreplyrezlife@gmail.com',
        pass: 'eK2BieN83'
    }
});

exports.emailPassword = function (email, password) {
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
};