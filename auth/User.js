const mongoose=require('mongoose');
const Schema=mongoose.Schema;

const UserSchema=new Schema({
    username:{
        type:String,
        required:false
    },
    email:{
        type:String,
        required:true
    },
    phone:{
        type:String,
        required:false
    },
    password:{
        type:String,
        required:true
    },
});

module.exports=User=mongoose.model('users',UserSchema);