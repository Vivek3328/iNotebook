const mongoose = require('mongoose');
const mongoURI = process.env.MONGO_URL;

mongoose.set("strictQuery", false);

const connectToMongo = () => {
    mongoose.connect(mongoURI, {
        useNewUrlParser: true,
        useUnifiedTopology: true
    }, () => {
        console.log('connected to database myDb')
    })
}

module.exports = connectToMongo;