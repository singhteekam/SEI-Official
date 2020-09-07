const express= require('express');
var app= express();
require('dotenv').config();
var bodyParser= require('body-parser');
const connectDB= require('./config/db');
const User = require('./auth/User');
const RegistrationForm = require('./auth/RegistrationForm');
const ContactForm = require('./auth/ContactForm');
const dotenv= require('dotenv');

const session = require('express-session');
const passport = require("passport");
const passportLocalMongoose = require("passport-local-mongoose");

dotenv.config({path: '.env'});
connectDB();



app.use(express.static(__dirname + '/public'));
app.set('view engine', 'ejs');
app.use(bodyParser.urlencoded({
  extended: true
}));


app.use(session({
    secret: "Our little secret.",
    resave: false,
    saveUninitialized: false
  }));
  
  app.use(passport.initialize());
  app.use(passport.session());


app.use('/', require('./routes/server'));

let port = process.env.PORT || 1256;

app.listen(port,()=>{
    console.log("Server is started");
});




