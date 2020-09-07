const mongoose=require('mongoose');
const Schema=mongoose.Schema;

const ContactSchema=new Schema({
    username:{
        type:String,
        required:true
    },
    email:{
        type:String,
        required:true
    },
    phone:{
        type:String,
        required:true
    },
    otherMessage:{
        type:String,
        required:false
    },
});

module.exports=ContactForm=mongoose.model('contact forms', ContactSchema);