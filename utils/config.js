const mongoose = require('mongoose')

exports.DbConnection = async ()=>{
    await mongoose.connect('mongodb://localhost:27017/2BY2');
}