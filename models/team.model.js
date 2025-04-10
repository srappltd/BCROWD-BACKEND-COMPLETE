const mongoose = require('mongoose');

const teamSchema = new mongoose.Schema({
    ratio: { type: String, enum: ['2:1', '1:2', '1:1'], default: '1:1' },
    leftTeam: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Users' }],
    rightTeam: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Users' }],
    clientId: { type: mongoose.Schema.Types.ObjectId, ref: 'Users' },
    checked: { type: Boolean, default: false },
}, { timestamps: true, versionKey: false });

exports.TeamModel = mongoose.model('Team', teamSchema);


const teamIncomeSchema = new mongoose.Schema({
    amount: { type: Number, required: true },
    status: { type: String, default:"Team Set Match Reward" },
    totalTeam: { type: Number, default:0 },
    client: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
}, { timestamps: true, versionKey: false });

exports.TeamIncomeModel = mongoose.model('TeamIncome', teamIncomeSchema);
