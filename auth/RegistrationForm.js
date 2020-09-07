const mongoose=require('mongoose');
const Schema=mongoose.Schema;

const RegistrationSchema=new Schema({
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
    // tenthMarksheet:{
    //     data: Buffer, 
    //     contentType: String ,
    // },
    // aadharCard:{
    //     type: Buffer,
    //     contentType: String ,
    // },
    // profilePhoto:{
    //     type: Buffer,
    //     contentType: String ,
    // },
});

module.exports=RegistrationForm=mongoose.model('registration forms',RegistrationSchema);