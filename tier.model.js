const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const Tier1Schema = new Schema({
    parent: { type: Schema.Types.ObjectId, ref: 'User' },
    children: [{ type: Schema.Types.ObjectId, ref: 'User' }],
    status: { type: String, default: 'active' }
});

module.exports = mongoose.model('Tier1', Tier1Schema);