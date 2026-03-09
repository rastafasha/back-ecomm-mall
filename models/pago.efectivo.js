var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var PagoEfectivoSchema = Schema({
    user: { type: Schema.ObjectId, ref: 'user' },
    amount: { type: String, required: true },
    name_person: {type: String, required: true},
    phone: {type: String, required: true},
    // status: { type: String, required: true, default: 'pending' },
    paymentday: { type: Date, default: Date.now, required: false },
    createdAt: { type: Date, default: Date.now, required: true },
    local: { type: Schema.ObjectId, ref: 'tienda' , default: null},
    updatedAt: { type: Date }
});

module.exports = mongoose.model('pagoefectivo', PagoEfectivoSchema);