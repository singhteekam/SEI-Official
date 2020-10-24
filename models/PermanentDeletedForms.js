const mongoose=require('mongoose');
const Schema=mongoose.Schema;

const PermanentDeletedForms=new Schema({
    _id: {
        type: mongoose.Types.ObjectId,
        required: true
    },
    firstName:{
        type:String,
        required:true
    },
    lastName:{
        type:String,
        required:true
    },
    fathersName:{
        type:String,
        required:true
    },
    mothersName:{
        type:String,
        required:true
    },
    courseType:{
        type:String,
        required:true
    },
    dateOfBirth:{
        type: String,
        required:true
    },
    gender:{
        type:String,
        required:true
    },
    emailAddress:{
        type:String,
        required:true
    },
    phoneNumber:{
        type:String,
        required:true
    },
    address:{
        type:String,
        required:true
    },
    pinCode:{
        type:String,
        required:true
    },
    district:{
        type:String,
        required:true
    },
    state:{
        type:String,
        required:true
    },
    tenthMarksheet:{
        type:String,
        required:true
    },
    finalGrade:{
        type:String,
        required:false
    },
    courseStarts:{
        type:String,
        required:false
    },
    courseEnds:{
        type:String,
        required:false
    },
});

module.exports=PermanentDeletedForms=mongoose.model('permanent deleted forms',PermanentDeletedForms);