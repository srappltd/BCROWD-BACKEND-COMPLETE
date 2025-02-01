const mongoose = require('mongoose')

const rebirthTwoByTwoSchema = new mongoose.Schema({
    clientId:{
        type:mongoose.Schema.Types.ObjectId,
        ref:'UserTwoByTwo'
    },
    investment: { type: Number, default: 0 },
    activationFees:{ type: Number, default: 0 },
    upgrationFees:{ type: Number, default: 0 },
    rebirthFees:{ type: Number, default: 0 },
    netRewardFees:{ type: Number, default: 0 },
    currentTierCount: { type: Number, default: 0 },
    rebirthAuto: { type: String, default:null },
    currentTierType: { type: String, enum: ['PARENT', 'CHILD'], default: 'CHILD' },
},{timestamps:true,versionKey:false})

exports.RebirthTwoByTwoModel = mongoose.model('RebirthTwoByTwo',rebirthTwoByTwoSchema)



const rebirthTwoByEightSchema = new mongoose.Schema({
    clientId:{
        type:mongoose.Schema.Types.ObjectId,
        ref:'UserTwoByEight'
    },
    investment: { type: Number, default: 0 },
    activationFees:{ type: Number, default: 0 },
    upgrationFees:{ type: Number, default: 0 },
    rebirthFees:{ type: Number, default: 0 },
    netRewardFees:{ type: Number, default: 0 },
    currentTierCount: { type: Number, default: 0 },
    rebirthAuto: { type: String, default:null },
    currentTierType: { type: String, enum: ['PARENT', 'CHILD'], default: 'CHILD' },
},{timestamps:true,versionKey:false})

exports.RebirthTwoByEightModel = mongoose.model('RebirthTwoByEight',rebirthTwoByEightSchema);


