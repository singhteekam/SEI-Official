const express = require('express');

const session = require('express-session');
const passport = require("passport");
const cookieParser = require('cookie-parser');
const flash = require('connect-flash');

require('./passportLogin')(passport);
// const logins= require('./adminPassportLogin');

const AllCourses= require('./AllCourses');
const adminPanel= require('./adminPanel');
const studentDashboard= require('./student_dashboard');
const registrationForm= require('./User/registrationForm');
const signUp= require('./User/signUp');
const app = express.Router();

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



// Student Registration Form 
app.use(registrationForm);

app.get('/payment-mode', (req, res) => {
    res.render('payment-mode');
})


//Contact Form
app.post('/contactForm', require('../controllers/contactForm'));


app.get("/", function (req, res) {
    console.log(req.user);
    res.render("home", {
        "user": req.user
    });
});



app.get("/forgetpass", function (req, res) {
    res.render("forgetpass");
});

//All Courses
app.use(AllCourses)

app.get("/free-resources", function (req, res) {
    res.render("free-resources");
});

app.get("/general-awareness", function (req, res) {
    res.render("general-awareness");
});

app.get("/mock-test", function (req, res) {
    if(req.user){
    res.render("./Student/mock-test");
    }
    else{
        res.render('./Student/mock-test-error', {
            "user": req.user
        });
    }
});

app.get("/registration-form", function (req, res) {
    res.render("registration-form");
});


app.get("/login", function (req, res) {
    res.render("login");
});

app.get("/register", function (req, res) {
    res.render("register");
});



app.post('/register', signUp);

//Login User/Admin
app.post('/login', (req, res, next) => {
    if(req.body.loginType === "Admin"){
    passport.authenticate('Admin', {
        failureRedirect: '/login',
        successRedirect: '/admin-panel1',
        failureFlash: true,
    })(req, res, next);
    }
    else{
        passport.authenticate('Student', {
            failureRedirect: '/login',
            successRedirect: '/',
            failureFlash: true,
        })(req, res, next);
    }
});


// Admin Panel
app.use(adminPanel);

//Student Dashboard
app.use(studentDashboard);


module.exports = app;