const nodemailer = require('nodemailer');
const RegistrationForm = require('../models/RegistrationForm');

const registrationForm= function (req, res) {

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

            let txt= "Hi, \n\nRegistration form details: " +
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
            "\ntenthMarksheet: " + req.body.tenthMarksheet;
 
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

             let receivers= [process.env.USER_MAIL,req.body.emailAddress]; // multiple receivers
             receivers.forEach((receiver)=>{
             let mailOptions = {
                 from: req.body.emailAddress,
                 to: receiver, // list of receivers
                 subject: 'Registration form submitted successfully', // Subject line
                 text: txt ,
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
             }); // end of transporter.sendmail
             
            }); // End of forEach loop

             console.log("Registration form submitted");
             res.render('register-successfully')
         }).catch(err => {
             res.send("Error" + err);
         });
 
     })
 }

 module.exports= registrationForm;