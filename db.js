const mongoose = require('mongoose');
const dotenv = require("dotenv")
dotenv.config()
const mongoURI=`mongodb+srv://${process.env.DB_USERNAME}:${process.env.DB_PASSWORD}@cluster0.mvf57zm.mongodb.net/smita?retryWrites=true&w=majority`;
const connectToMongoose=()=>{
  mongoose.set("strictQuery", false);
  mongoose.connect(mongoURI);
}

module.exports =  connectToMongoose;


