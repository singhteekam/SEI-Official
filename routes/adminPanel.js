const express= require('express');
const app = express.Router();
const Admin = require('../models/Admins');
const AcceptedRegistrationForm = require('../models/AcceptedRegistrationForm');
const RegistrationForm = require('../models/RegistrationForm');
const mongoose=require('mongoose');
const signUp= require('./User/signUp');
const Students = require('../models/Students');

const checkAuthenticated = function (req, res, next) {
    if (req.isAuthenticated()) {
        res.set('Cache-Control', 'no-cache, private, no-store, must-revalidate, post-check=0, pre-check=0');
        return next();
    } else {
        res.redirect('/login');
    }
}

app.get('/admin-panel1', checkAuthenticated, (req, res) => {
    if(req.user.type === "Admin"){
    RegistrationForm.find({}).exec(function (err, users) {
        if (err) throw err;
        res.render('./Admin/admin-panel1', {
            "datas": users,
            "user": req.user
        });
    })
    }
    else{
        res.redirect('/');
    }
});

app.get('/createStudentID', (req, res)=>{
    if(req.user.type === "Admin"){
    res.render('./Admin/registerStudent',  {
        "user": req.user
    });
    }
});

app.post('/createStudentID', signUp);


app.get('/createAdminAccount', (req, res)=>{
    if(req.user.type === "Admin"){
    res.render('./Admin/registerAdmin',  {
        "user": req.user
    });
  }
});

app.post('/createAdminAccount', signUp);

app.get('/viewAllStudents', (req, res)=>{
    if(req.user.type === "Admin"){
    Students.find({}).exec( (err, students)=>{
        if(err) throw err;
        res.render('./Admin/viewAllStudents', {
            "students": students,
            "user": req.user
        });
    });
  }
});


app.get('/admin-panel2', checkAuthenticated, (req, res) => {
    if(req.user.type === "Admin"){
    AcceptedRegistrationForm.find({}).exec(function (err, users) {
        if (err) throw err;
        res.render('./Admin/admin-panel2', {
            "datas": users,
            "user": req.user
        });
    });
    }
    else{
        res.redirect('/');
    }
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
                res.render('./Admin/admin-panel1', {
                    "datas": users,
                    "user": req.user
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
                res.render('./Admin/admin-panel1', {
                    "datas": users,
                    "user": req.user
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
                res.render('./Admin/admin-panel1', {
                    "datas": users,
                    "user": req.user
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
        res.render('./Admin/user-profile', {
            "info": user,
            "user": req.user
        });
    })
});

app.get('/editRegistrationForm', (req, res) => {
    let id = req.query.id.trim();
    AcceptedRegistrationForm.findById({
        _id: mongoose.Types.ObjectId(id)
    }).then((user) => {
        console.log("user " + user.firstName);
        res.render('./Admin/editRegForm', {
            "info": user,
            "user": req.user
        });
    })
});

app.get('/viewAcceptedRegForm', (req,res)=>{
    let id = req.query.id.trim();
    AcceptedRegistrationForm.findById({
        _id: mongoose.Types.ObjectId(id)
    }).then((user) => {
        res.render('./Admin/viewAcceptedForm', {
            "info": user,
            "user": req.user
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
            res.render('./Admin/admin-panel2', {
                "datas": users,
                "user": req.user
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
    if(req.user.type === "Admin"){
    console.log(req.user);
    res.render('forgetpass',  {
        "user": req.user
    });
  }
});

app.post('/changeAdminPass2', checkAuthenticated, (req, res) => {
    if (req.body.newPass != req.body.confirmNewPass) {
        return res.render('forgetpass',  {
            "user": req.user
        });
    }
    bcrypt.genSalt(10, (err, salt) => {
        if (err) throw err;
        bcrypt.hash(req.body.newPass, salt, (err, hash) => {
            let changePass = {
                password: hash
            }
            if (err) throw err;
            console.log(hash);
            Admin.updateOne({
                "email": req.user.email
            }, {
                $set: changePass
            }).then(() => {
                console.log("Password changed to : " + changePass.password);
                RegistrationForm.find({}).exec(function (err, users) {
                    if (err) throw err;
                    res.render('./Admin/admin-panel1', {
                        "datas": users,
                        "user": req.user
                    });
                });
            })
        });
    });
});



module.exports= app;