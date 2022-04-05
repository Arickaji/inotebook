const mongoose = require('mongoose');
const mongooseUrl = "mongodb://localhost:27017/inotebook?readPreference=primary&appname=MongoDB%20Compass&ssl=false"

const connectToMongo = () =>{
    mongoose.connect(mongooseUrl,()=>{
        console.log("connected to Mongo successfully");
    })
}

module.exports = connectToMongo;