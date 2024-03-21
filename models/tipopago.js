var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var PaymentSchema = Schema({
    nombreCompleto: { type: String, required: true },
    username: { type: String, required: true },
    type: { type: String, required: true },
    bankName: { type: String, required: false },
    accountNumber: { type: String, required: false },
    phone: { type: String, required: true },
    email: { type: String, required: true },
    user: { type: Schema.ObjectId, ref: 'user' },
    createdAt: { type: Date, default: Date.now, required: true },
    updatedAt: { type: Date }
});

module.exports = mongoose.model('payment', PaymentSchema);