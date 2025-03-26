const mongoose = require('mongoose');
const levelSchema = new mongoose.Schema({
    amount:{
        type:Number,
        default:0
    },
    percentage:{
        type:Number,
        default:0
    },
    levelName:{
        type:String,
        default:null
    },
    status:{
        type:String,
        default:'Confirm',
    },
    userId:{
        type:mongoose.Schema.Types.ObjectId,
        ref:'User',
        default:null
    },
    teamIncomeId:{
        type:mongoose.Schema.Types.ObjectId,
        ref:'TeamIncome',
        default:null
    },
},{timestamps:true});

exports.LevelModel = mongoose.model('Level',levelSchema);