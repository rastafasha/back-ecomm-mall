'use strict'
const { Schema, model } = require('mongoose');

const notificacionSchema = Schema({
    usuario: { type: Schema.Types.ObjectId, ref: 'Usuario', required: true },
    titulo: { type: String, required: true }, 
    mensaje: { type: String, required: true }, 
    tipo: { 
        type: String, 
        enum: [
            'PAGO_APROBADO', 
            'PAGO_RECHAZADO', 
            'NUEVO_PEDIDO',  
            'NUEVO_MENSAJE', 
            'NUEVO_PAGO', 
            'PEDIDO_APROBADO', 
            'PEDIDO_RECHAZADO',
            'AVISO_GENERAL',
        ],
        required: true 
    },
    leido: { type: Boolean, default: false },
    // ID del Pago, Factura o del nuevo modelo Comunicado
    referenciaId: { type: Schema.Types.ObjectId }, 
}, { timestamps: true });

module.exports = model('Notificacion', notificacionSchema);
