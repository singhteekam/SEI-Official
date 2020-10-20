const express = require('express');
const ejs = require('ejs');
const nodemailer = require('nodemailer');
const User = require('../auth/User');
const RegistrationForm = require('../auth/RegistrationForm');
const ContactForm = require('../auth/ContactForm');
const bcrypt = require('bcryptjs');
const session = require('express-session');
const passport = require("passport");
const passportLocalMongoose = require("passport-local-mongoose");
const cookieParser = require('cookie-parser');
const localStrategy = require('passport-local').Strategy;
const flash = require('connect-flash');
const AcceptedRegistrationForm = require('../auth/AcceptedRegistrationForm');
require('./passport')(passport);
const mongoose = require('mongoose');
const multer = require('multer');
const fs = require('fs');
const path = require('path');

const app = express();

app.use(cookieParser('secret'));
app.use(session({
    secret: process.env.SECRET_KEY,
    maxAge: 3600000,
    resave: true,
    saveUninitialized: true,
}));
// using passport for authentications 
app.use(passport.initialize());
app.use(passport.session());
app.use(flash());

app.use(function (req, res, next) {
    res.locals.success_message = req.flash('success_message');
    res.locals.error_message = req.flash('error_message');
    res.locals.error = req.flash('error');
    next();
});

const checkAuthenticated = function (req, res, next) {
    if (req.isAuthenticated()) {
        res.set('Cache-Control', 'no-cache, private, no-store, must-revalidate, post-check=0, pre-check=0');
        return next();
    } else {
        res.redirect('/login');
    }
}

var storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, './public/uploads/')
    },
    filename: (req, file, cb) => {
        cb(null, file.fieldname + '-' + Date.now() + path.extname(file.originalname))
    },
});
var upload = multer({
    storage: storage,
    limits: {
        fileSize: 200000
    },
    fileFilter: function (req, file, cb) {
        checkFileType(file, cb);
    }
});


// Check File Type
function checkFileType(file, cb) {
    //Allowed ext
    const filetypes = /jpeg|jpg|png|pdf/;
    // Check ext
    const extname = filetypes.test(path.extname(file.originalname).toLowerCase());
    //Check mime
    const mimetype = filetypes.test(file.mimetype);

    if (extname && mimetype) {
        return cb(null, true);
    } else {
        cb('Error: Images only');
    }
}

app.post('/registrationForm',upload.single('tenthMarksheet'), function (req, res) {

    // uploadMarksheet(req, res, (err) => {
    //     if (err) {
    //         // res.send(err);
    //     } else {
    //         console.log(req.file);
    //         return req.file.filename;
    //     }
    // });
   var fileinfo= req.file.filename;
   console.log(fileinfo);
   console.log(req.file);

    RegistrationForm.findOne({
        emailAddress: req.body.emailAddress
    }).then(() => {
        const registrationData = {
            firstName: req.body.firstName,
            lastName: req.body.lastName,
            fathersName: req.body.fathersName,
            mothersName: req.body.mothersName,
            courseType: req.body.courseType,
            dateOfBirth: req.body.dateOfBirth,
            gender: req.body.optradio,
            emailAddress: req.body.emailAddress,
            phoneNumber: req.body.phoneNumber,
            address: req.body.address,
            pinCode: req.body.pinCode,
            district: req.body.district,
            state: req.body.state,
            tenthMarksheet: fileinfo,
            // aadharCard: aadharFile,
            // profilePhoto: dpFile
        }
        RegistrationForm.create(registrationData).then(() => {

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
                from: req.body.email,
                to: process.env.USER_MAIL, // list of receivers
                subject: 'Registration form received', // Subject line
                text: "Hi Admin, \n\nRegistration form details: " +
                    "\nfirstName: " + req.body.firstName +
                    "\nlastName: " + req.body.lastName +
                    "\nfathersName: " + req.body.fathersName +
                    "\nmothersName: " + req.body.mothersName +
                    "\ncourseType: " + req.body.courseType +
                    "\ndateOfBirth: " + req.body.dateOfBirth +
                    "\ngender: " + req.body.optradio +
                    "\nemailAddress: " + req.body.emailAddress +
                    "\nphoneNumber: " + req.body.phoneNumber +
                    "\naddress: " + req.body.address +
                    "\npinCode: " + req.body.pinCode +
                    "\ndistrict: " + req.body.district +
                    "\nstate: " + req.body.state +
                    "\ntenthMarksheet: " + req.body.tenthMarksheet ,
                    // "\naadharCard: " + req.body.aadharCard +
                    // "\nprofilePhoto: " + req.body.profilePhoto
                    attachments: [
                        {
                            filename: fileinfo,
                            path: './public/uploads/'+fileinfo
                        }
                    ],
            };

            transporter.sendMail(mailOptions, (error, info) => {
                if (error) {
                    return console.log(error);
                }
                console.log('Message sent: %s', info.messageId);
                console.log('Preview URL: %s', nodemailer.getTestMessageUrl(info));
                //   res.render('index.html');
            });

            console.log("Registration form submitted");
            res.render('register-successfully')
        }).catch(err => {
            res.send("Error" + err);
        });

    })
});

app.get('/payment-mode', (req, res) => {
    res.render('payment-mode');
})

app.post('/contactForm', function (req, res) {
    const contactFormData = {
        username: req.body.username,
        email: req.body.email,
        phone: req.body.phone,
        otherMessage: req.body.otherMessage
    }
    ContactForm.create(contactFormData).then(() => {
        console.log("Contact Form submitted");

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
            from: req.body.email,
            to: process.env.USER_MAIL, // list of receivers
            subject: 'Contact form received', // Subject line
            text: "Hello Admin, \n\nContact Form Details: \n" + "Username: " + req.body.username + "\nEmail: " + req.body.email + "\nPhone: " + req.body.phone + "\nMessage: " + req.body.otherMessage
        };

        transporter.sendMail(mailOptions, (error, info) => {
            if (error) {
                return console.log(error);
            }
            console.log('Message sent: %s', info.messageId);
            console.log('Preview URL: %s', nodemailer.getTestMessageUrl(info));
            //   res.render('index.html');
        });


        res.render('home');
    }).catch(err => {
        res.send("Error" + err);
    })
});


app.get("/", function (req, res) {
    res.render("home");
});

app.get("/forgetpass", function (req, res) {
    res.render("forgetpass");
});

app.get("/ADCA", function (req, res) {
    res.render("ADCA");
});

app.get("/ADCHN", function (req, res) {
    res.render("ADCHN");
});

app.get("/BCC", function (req, res) {
    res.render("BCC");
});

app.get("/DCA", function (req, res) {
    res.render("DCA");
});

app.get("/DOAAP", function (req, res) {
    res.render("DOAAP");
});

app.get("/DTP", function (req, res) {
    res.render("DTP");
});

app.get("/MDCA", function (req, res) {
    res.render("MDCA");
});

app.get("/other-courses", function (req, res) {
    res.render("other-courses");
});

app.get("/free-resources", function (req, res) {
    res.render("free-resources");
});

app.get("/general-awareness", function (req, res) {
    res.render("general-awareness");
});

app.get("/mock-test", function (req, res) {
    res.render("mock-test");
});

app.get("/registration-form", function (req, res) {
    res.render("registration-form");
});


app.get("/login", function (req, res) {
    res.render("login");
});

// app.get("/register", function (req, res) {
//     res.render("register");
// });



// app.post('/register', (req, res) => {
//     var {
//         email,
//         password,
//         confirmpassword
//     } = req.body;
//     var err;
//     if (!email || !password || !confirmpassword) {
//         err = "Please Fill All The Fields...";
//         res.render('register', {
//             'err': err
//         });
//     }
//     if (password != confirmpassword) {
//         err = "Passwords Don't Match";
//         res.render('register', {
//             'err': err,
//             'email': email,
//         });
//     }
//     if (typeof err == 'undefined') {
//         User.findOne({
//             email: email
//         }, function (err, data) {
//             if (err) throw err;
//             if (data) {
//                 console.log("User Exists");
//                 err = "User Already Exists With This Email...";
//                 res.render('home', {
//                     'err': err,
//                     'email': email,
//                 });
//             } else {
//                 bcrypt.genSalt(10, (err, salt) => {
//                     if (err) throw err;
//                     bcrypt.hash(password, salt, (err, hash) => {
//                         if (err) throw err;
//                         password = hash;
//                         User({
//                             email,
//                             password,
//                         }).save((err, data) => {
//                             if (err) throw err;
//                             req.flash('success_message', "Registered Successfully.. Login To Continue..");
//                             res.redirect('/login');
//                         });
//                     });
//                 });
//             }
//         });
//     }
// });

app.post('/login', (req, res, next) => {
    passport.authenticate('local', {
        failureRedirect: '/login',
        successRedirect: '/admin-panel1',
        failureFlash: true,
    })(req, res, next);
});

app.get('/admin-panel1', checkAuthenticated, (req, res) => {
    RegistrationForm.find({}).exec(function (err, users) {
        if (err) throw err;
        res.render('admin-panel1', {
            "datas": users
        });
    })
});

app.get('/admin-panel2', checkAuthenticated, (req, res) => {
    AcceptedRegistrationForm.find({}).exec(function (err, users) {
        if (err) throw err;
        res.render('admin-panel2', {
            "datas": users
        });
    })
});


app.get('/createNewStudent', (req, res) => {
    let id = req.query.id.trim();
    console.log(id);
    RegistrationForm.findById({
        _id: mongoose.Types.ObjectId(id)
    }).then((user) => {
        console.log("Accepted " + user);
        AcceptedRegistrationForm.insertMany(user).then(() => {
            console.log("Accepted " + user.emailAddress);
            RegistrationForm.remove(user).then(() => {
                console.log("Deleted " + user);
            }).catch(err => {
                res.send("Error" + err);
            });
            AcceptedRegistrationForm.find({}).exec(function (err, users) {
                if (err) throw err;
                res.render('admin-panel1', {
                    "datas": users
                });
            });
        }).catch(err => {
            res.send("Error" + err);
            console.log(err);
        });
    });
});

app.get('/deleteRegForm', (req, res) => {
    let id = req.query.id.trim();
    RegistrationForm.findById({
        _id: mongoose.Types.ObjectId(id)
    }).then((deletedForm) => {
        RegistrationForm.remove(deletedForm).then(() => {
            console.log("Deleted " + deletedForm);
            RegistrationForm.find({}).exec(function (err, users) {
                if (err) throw err;
                res.render('admin-panel1', {
                    "datas": users
                });
            });
        }).catch(err => {
            res.send("Error" + err);
        });
    });

});

app.get('/deleteAcceptedRegForm', (req, res) => {
    let id = req.query.id.trim();
    AcceptedRegistrationForm.findById({
        _id: mongoose.Types.ObjectId(id)
    }).then((deletedForm) => {
        AcceptedRegistrationForm.remove(deletedForm).then(() => {
            console.log("Deleted " + deletedForm);
            AcceptedRegistrationForm.find({}).exec(function (err, users) {
                if (err) throw err;
                res.render('admin-panel1', {
                    "datas": users
                });
            });
        }).catch(err => {
            res.send("Error" + err);
        });
    });

});

app.get('/viewPendingRegForm', (req, res) => {
    let id = req.query.id.trim();
    RegistrationForm.findById({
        _id: mongoose.Types.ObjectId(id)
    }).then((user) => {
        res.render('user-profile', {
            "info": user
        });
    })
});

app.get('/editRegistrationForm', (req, res) => {
    let id = req.query.id.trim();
    AcceptedRegistrationForm.findById({
        _id: mongoose.Types.ObjectId(id)
    }).then((user) => {
        console.log("user " + user.firstName);
        res.render('editRegForm', {
            "info": user
        });
    })
});

app.get('/viewAcceptedRegForm', (req,res)=>{
    let id = req.query.id.trim();
    AcceptedRegistrationForm.findById({
        _id: mongoose.Types.ObjectId(id)
    }).then((user) => {
        res.render('viewAcceptedForm', {
            "info": user
        });
    })
})

app.post('/updateStudentProfile', (req, res) => {
    let id = req.query.id.trim();
    const updateData = {
        firstName: req.body.updateFirstName,
        courseType: req.body.updateCourseType,
        phoneNumber: req.body.updatePhoneNumber,
        address: req.body.updateAddress,
        pinCode: req.body.updatePinCode,
        district: req.body.updateDistrict,
        state: req.body.updateState,
        finalGrade: req.body.finalGrade,
        courseStarts: req.body.courseStarts,
        courseEnds: req.body.courseEnds
    }
    AcceptedRegistrationForm.updateOne({
        "_id": mongoose.Types.ObjectId(id)
    }, {
        $set: updateData
    }).then(() => {
        console.log("Updated " + id);
        AcceptedRegistrationForm.find({}).exec(function (err, users) {
            if (err) throw err;
            res.render('admin-panel2', {
                "datas": users
            });
        });
    }).catch(err => {
        res.send("Error" + err);
    });
})

app.get("/logout", function (req, res) {
    req.logout();
    res.redirect("/");
});

app.get('/changeAdminPassword', checkAuthenticated, (req, res) => {
    console.log(req.user);
    res.render('forgetpass');
});

app.post('/changeAdminPass2', checkAuthenticated, (req, res) => {
    if (req.body.newPass != req.body.confirmNewPass) {
        return res.render('forgetpass');
    }
    bcrypt.genSalt(10, (err, salt) => {
        if (err) throw err;
        bcrypt.hash(req.body.newPass, salt, (err, hash) => {
            let changePass = {
                password: hash
            }
            if (err) throw err;
            console.log(hash);
            User.updateOne({
                "email": req.user.email
            }, {
                $set: changePass
            }).then(() => {
                console.log("Password changed to : " + changePass.password);
                RegistrationForm.find({}).exec(function (err, users) {
                    if (err) throw err;
                    res.render('admin-panel1', {
                        "datas": users
                    });
                });
            })
        });
    });
});





module.exports = app;