const mongoose = require("mongoose")

function connectDB(url){
    mongoose.connect(url).then(console.log("database connected"))
}

module.exports = {connectDB}