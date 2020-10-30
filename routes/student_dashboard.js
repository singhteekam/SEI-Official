const express= require('express');
const app = express.Router();

const Students = require('../models/Students');

const multer = require('multer');
const path = require('path');


var storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, './public/studentdp/')
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
    const filetypes = /jpeg|jpg|png/;
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


app.get('/viewProfile', (req, res)=>{
    res.render('./Student/viewProfile', {
        "user": req.user
    });
});

app.post('/uploadProfilePhoto',upload.single('profilephoto'), (req, res)=>{
    var fileName= req.file.filename;
    console.log(fileName);
    const updateData= {
        profilephoto: fileName
    };

    Students.findOneAndUpdate({
        email: req.user.email
    }, {
        $set: updateData
    }).then(()=>{
        res.render('./Student/viewProfile', {
            "user": req.user
        });
        // res.redirect('/');
        
    })
});

module.exports= app;