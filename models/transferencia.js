var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var TransferenciaSchema = Schema({
    user: { type: Schema.ObjectId, ref: 'user' },
    metodo_pago: { type: Schema.ObjectId, ref: 'paymentmethod' },
    bankName: { type: String, required: true },
    amount: { type: String, required: true },
    referencia: { type: String, required: true },
    name_person: {type: String, required: true},
    phone: {type: String, required: true},
    status: { type: String, required: true, default: 'pending' },
    paymentday: { type: Date, default: Date.now, required: false },
    createdAt: { type: Date, default: Date.now, required: true },
    updatedAt: { type: Date }
});

module.exports = mongoose.model('transferencia', TransferenciaSchema);