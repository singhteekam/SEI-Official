const Student= require('../../models/Students');
const User= require('../../models/Admins');
const bcrypt= require('bcrypt');
const nodemailer= require('nodemailer');


 const signUp= (req, res) => {
    var {
        username,
        email,
        mobile,
        password,
        confirmpassword,
        type,
    } = req.body;
    var err;
    if (!email || !password || !confirmpassword) {
        err = "Please Fill All The Fields...";
        res.render('register', {
            'err': err
        });
    }
    if (password != confirmpassword) {
        err = "Passwords Don't Match";
        res.render('register', {
            'err': err,
            'email': email,
        });
    }
    if (typeof err == 'undefined') {
        if(type=== "Student"){
            Student.findOne({
                email: email
            }, function (err, data) {
                if (err) throw err;
                if (data) {
                    console.log("User Exists");
                    err = "User Already Exists With This Email...";
                    res.render('home', {
                        'err': err,
                        'email': email,
                        'user': req.user
                    });
                } else {
                    bcrypt.genSalt(10, (err, salt) => {
                        if (err) throw err;
                        bcrypt.hash(password, salt, (err, hash) => {
                            if (err) throw err;
                            password = hash;
                            Student({
                                username,
                                email,
                                mobile,
                                password,
                                type
                            }).save((err, data) => {
                                if (err) throw err;
                                req.flash('success_message', "Student ID created successfully..");

                                let transporter = nodemailer.createTransport({
                                    service: 'Gmail',
                                    auth: {
                                        user: process.env.USER_MAIL, // generated ethereal user
                                        pass: process.env.USER_PASS // generated ethereal password
                                    },
                                    tls: {
                                        rejectUnauthorized: false
                                    }
                                });
                   
                                let mailOptions = {
                                    from: req.body.emailAddress,
                                    to: email, // list of receivers
                                    subject: 'Account Created', // Subject line
                                    text: "Congratulations...Your account has been created successfully..\nAccount Info:\nUsername: "+ username+"\nEmail: "+ email+ 
                                    "\nMobile:"+ mobile+ "\nPassword: "+ req.body.password ,
                                };
                    
                                transporter.sendMail(mailOptions, (error, info) => {
                                    if (error) {
                                        return console.log(error);
                                    }
                                    console.log('Message sent: %s', info.messageId);
                                    console.log('Preview URL: %s', nodemailer.getTestMessageUrl(info));
                                    //   res.render('index.html');
                                }); // end of transporter.sendmail

                                res.redirect('/admin-panel1');
                            });
                        });
                    });
                }
            });
        }
        else {
            User.findOne({
                email: email
            }, function (err, data) {
                if (err) throw err;
                if (data) {
                    console.log("User Exists");
                    err = "User Already Exists With This Email...";
                    res.render('home', {
                        'err': err,
                        'email': email,
                    });
                } else {
                    bcrypt.genSalt(10, (err, salt) => {
                        if (err) throw err;
                        bcrypt.hash(password, salt, (err, hash) => {
                            if (err) throw err;
                            password = hash;
                            User({
                                username,
                                email,
                                mobile,
                                password,
                                type
                            }).save((err, data) => {
                                if (err) throw err;
                                req.flash('success_message', "New Admin account created successfully..");
                                res.redirect('/admin-panel1');
                            });
                        });
                    });
                }
            });
        }
    }
}

module.exports= signUp;