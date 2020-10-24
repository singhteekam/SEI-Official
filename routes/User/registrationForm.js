const express= require('express');
const app= express.Router();

const multer = require('multer');
const path = require('path');

const registrationForm = require('../../controllers/registrationForm');


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


app.post('/registrationForm',upload.single('tenthMarksheet'), registrationForm);

 module.exports= app;