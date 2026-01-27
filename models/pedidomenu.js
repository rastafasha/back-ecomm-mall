const { Schema, model } = require('mongoose');

const PedidoMenuSchema = Schema({
   
    user: {
        type: Schema.Types.ObjectId,
        ref: 'user',
        require: true
    },
  
    pedido: { type: Array, require: true },
    tienda: {
        type: Schema.Types.ObjectId,
        ref: 'tienda',
        require: true
    },
    status: { type: String, required: false, default: 'PENDING' },
    createdAt: { type: Date, default: Date.now, required: true },
    updatedAt: { type: Date }
});

PedidoMenuSchema.method('toJSON', function() {
    const { __v, ...object } = this.toObject();
    return object;
});

module.exports = model('pedidomenu', PedidoMenuSchema);