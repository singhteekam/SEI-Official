const mongoose=require('mongoose');
const Schema=mongoose.Schema;

const StudentSchema=new Schema({
    username:{
        type:String,
        required:false
    },
    
    email:{
        type:String,
        required:true
    },
    mobile:{
        type:String,
        required:false
    },
    password:{
        type:String,
        required:true
    },
    type:{
        type:String,
        required:true
    },
    profilephoto:{
        type: String,
        default:""
    }
});

module.exports=Student=mongoose.model('students',StudentSchema);