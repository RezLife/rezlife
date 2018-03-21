var generator = require('generate-password');
var nodemailer = require('nodemailer');

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
    var num = generator.generate();

    var mailOptions = {
        from: 'noreplyrezlife@gmail.com',
        to: email,
        subject: 'Resident Life Account Creation',
        text: 'This is your temporary password: ' + password
      };
      
      transporter.sendMail(mailOptions, function(error, info){
        if (error) {
          console.log(error);
        } else {
          console.log('Email sent: ' + info.response);
        }
      }); 

    //insert new user into the database
    var sql = `INSERT INTO t_users (email, password, role, floor, building) VALUES ('${email}', '${password}', '${role}', '${num}', 'Test')`;
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
};