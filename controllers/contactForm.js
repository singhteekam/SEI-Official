const ContactForm = require('../models/ContactForm');
const nodemailer = require('nodemailer');

const contactForm= function (req, res) {
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

        let receivers= [process.env.USER_MAIL,req.body.email]; // multiple receivers
             receivers.forEach((receiver)=>{
        let mailOptions = {
            from: req.body.email,
            to: receiver, // list of receivers
            subject: 'Contact form submitted successfully', // Subject line
            text: "Hello, \n\nContact Form Details: \n" + "Username: " + req.body.username + "\nEmail: " + req.body.email + "\nPhone: " + req.body.phone + "\nMessage: " + req.body.otherMessage
        };

        transporter.sendMail(mailOptions, (error, info) => {
            if (error) {
                return console.log(error);
            }
            console.log('Message sent: %s', info.messageId);
            console.log('Preview URL: %s', nodemailer.getTestMessageUrl(info));
            //   res.render('index.html');
        });

    }); // End of forEach loop


        res.render('home', {
            "user": req.user
        });
    }).catch(err => {
        res.send("Error" + err);
    })
}

module.exports= contactForm;