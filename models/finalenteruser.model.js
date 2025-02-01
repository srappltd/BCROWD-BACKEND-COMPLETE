const mongoose = require('mongoose');
const { Schema } = mongoose;




const finalEnterTwoByTwoSchema = new Schema({
    userId: { type: String, required: true },
    username: { type: String, required: true },
    investment: { type: Number, default: 0 },
    activationFees: { type: Number, default: 0 },
    upgrationFees: { type: Number, default: 0 },
    rebirthFees: { type: Number, default: 0 },
    restrebirthFees: { type: Number, default: 0 },
    netRewardFees: { type: Number, default: 0 },
    currentTierCount: { type: Number, default: 0 },
    parentId: { type: mongoose.Schema.Types.ObjectId, ref: 'FinalEnterTwoByTwoUser', default: null },
    leftChild: { type: mongoose.Schema.Types.ObjectId, ref: 'FinalEnterTwoByTwoUser', default: null },
    rightChild: { type: mongoose.Schema.Types.ObjectId, ref: 'FinalEnterTwoByTwoUser', default: null },
}, { timestamps: true, versionKey: false })
exports.FinalEnterTwoByTwoModel = mongoose.model('FinalEnterTwoByTwoUser', finalEnterTwoByTwoSchema)




const finalEnterTwoByEightSchema = new Schema({
    userId: { type: String, required: true },
    username: { type: String, required: true },
    investment: { type: Number, default: 0 },
    activationFees: { type: Number, default: 0 },
    upgrationFees: { type: Number, default: 0 },
    rebirthFees: { type: Number, default: 0 },
    restrebirthFees: { type: Number, default: 0 },
    netRewardFees: { type: Number, default: 0 },
    currentTierCount: { type: Number, default: 0 },
    parentId: { type: mongoose.Schema.Types.ObjectId, ref: 'FinalEnterTwoByEightUser', default: null },
    leftChild: { type: mongoose.Schema.Types.ObjectId, ref: 'FinalEnterTwoByEightUser', default: null },
    rightChild: { type: mongoose.Schema.Types.ObjectId, ref: 'FinalEnterTwoByEightUser', default: null },
}, { timestamps: true, versionKey: false })
exports.FinalEnterTwoByEightModel = mongoose.model('FinalEnterTwoByEightUser', finalEnterTwoByEightSchema)

