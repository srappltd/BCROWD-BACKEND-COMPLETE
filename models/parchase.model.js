const mongoose = require('mongoose');

const purchaseSchema = new mongoose.Schema({
    amount: { type: Number, required: true },
    packageName: { type: String, required: true },
    clientId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true }
}, { timestamps: true, versionKey: false });

exports.PurchaseModel = mongoose.model('Purchase', purchaseSchema);
