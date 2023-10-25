const mongoose = require('mongoose');
const mongoURI = "mongodb+srv://mittal0623:Vivek123@cluster0.ditr35c.mongodb.net/";

mongoose.set("strictQuery", false);

const connectToMongo = ()=>{
    mongoose.connect(mongoURI, { 
        useNewUrlParser: true, 
        useUnifiedTopology: true
    }, () => { 
        console.log('connected to database myDb ;)') 
    })
}

module.exports = connectToMongo;