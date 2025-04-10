const mongoose = require('mongoose')

exports.DbConnection = async ()=>{
    await mongoose.connect('mongodb+srv://wecrowd:srappltd@wecrowd.8f0thi3.mongodb.net/WECROWD');
} 
