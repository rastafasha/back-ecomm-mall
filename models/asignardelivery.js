const { Schema, model } = require('mongoose');

const AsignarDeliverySchema = Schema({
   
    driver: {
        type: Schema.Types.ObjectId,
        ref: 'User',
        role:'CHOFER',
        require: true
    },
    venta: {
        type: Schema.Types.ObjectId,
        ref: 'venta',
        require: true
    },
    status: { type: String, required: false, default: 'POR-ASIGNAR' },
    createdAt: { type: Date, default: Date.now, required: true },
    updatedAt: { type: Date }
});

AsignarDeliverySchema.method('toJSON', function() {
    const { __v, ...object } = this.toObject();
    return object;
});

module.exports = model('asignardelivery', AsignarDeliverySchema);