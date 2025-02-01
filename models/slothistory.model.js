const mongoose = require('mongoose');

const slotHistoryTwoByTwoSchema = new mongoose.Schema({
    childs:{
        type:Object,
        default:null
    },
    parentId:{
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

exports.SlotHistoryTwoByTwoModel = mongoose.model('SlothistoryTwoByTwo',slotHistoryTwoByTwoSchema)



const slotHistoryTwoByEightSchema = new mongoose.Schema({
    childs:{
        type:Object,
        default:null
    },
    parentId:{
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

exports.SlotHistoryTwoByEightModel = mongoose.model('SlothistoryTwoByEight',slotHistoryTwoByEightSchema);


