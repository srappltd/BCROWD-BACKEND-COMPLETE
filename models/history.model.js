const mongoose = require('mongoose');

const historyTwoBtyTwoSchema = new mongoose.Schema({
    finalId: {
        type: String,
        required: true
    },
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'UserTwoByTwo',
        required: true
    },
    tierCount:{
        type: Number,
        default: 0
    },
    usersCount:{
        type: Number,
        default: 0
    },
    usersTargetCount:{
        type: Number,
        default: 0
    },
    activationFees:{
        type: Number,
        default: 0
    },
    upgrationFees:{
        type: Number,
        default: 0
    },
    rebirthFees:{
        type: Number,
        default: 0
    },
    netRewardFees:{
        type: Number,
        default: 0
    },
    status:{
        type: String,
        default: null
    },
    statusType:{
        type: String,
        default: null
    },
    rebirthAuto:{
        type: String,
        default: null
    },
    users:[{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'UserTwoByEight',
        default:[]
    }],
    
},{ timestamps: true, versionKey: false });
const HistoryTwoModel = mongoose.model('HistoryTwoByTwo', historyTwoBtyTwoSchema);

const historyTwoBtyEightSchema = new mongoose.Schema({
    finalId: {
        type: String,
        required: true
    },
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'UserTwoByEight',
        required: true
    },
    tierCount:{
        type: Number,
        default: 0
    },
    usersCount:{
        type: Number,
        default: 0
    },
    usersTargetCount:{
        type: Number,
        default: 0
    },
    activationFees:{
        type: Number,
        default: 0
    },
    upgrationFees:{
        type: Number,
        default: 0
    },
    rebirthFees:{
        type: Number,
        default: 0
    },
    netRewardFees:{
        type: Number,
        default: 0
    },
    status:{
        type: String,
        default: null
    },
    statusType:{
        type: String,
        default: null
    },
    rebirthAuto:{
        type: String,
        default: null
    },
    users:[{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'UserTwoByEight',
        default:[]
    }],
    
},{ timestamps: true, versionKey: false });
const HistoryEightModel = mongoose.model('HistoryTwoByEight', historyTwoBtyEightSchema);


module.exports = { HistoryEightModel,HistoryTwoModel };