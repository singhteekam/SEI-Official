const mongoose=require('mongoose');
const Schema=mongoose.Schema;

const AdminSchema=new Schema({
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
    type:{
        type:String,
        required:true
    },
});

module.exports=Admin=mongoose.model('users',AdminSchema);