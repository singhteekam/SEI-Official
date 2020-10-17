const mongoose= require('mongoose');

const connectDB = async ()=>{
    try{
        const conn = await mongoose.connect(process.env.MONGO_URI,{
            // const conn = await mongoose.connect("mongodb+srv://admin:Admin123@sei.cence.mongodb.net/SomnathEducationInstitute?retryWrites=true&w=majority",{
            useNewUrlParser:true,
            useUnifiedTopology:true,
            useFindAndModify:false
        })
        console.log('MongoDB connected : '+ conn.connection.host);
    }
    catch(err){
        console.log(err);
        process.exit(1);
    }
}

module.exports= connectDB;