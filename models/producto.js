'use strict'

var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var ProductoSchema = Schema({
    titulo: { type: String, required: true, unique: true },
    img: { type: String, required: false },
    precio_ahora: { type: Number, required: true },
    precio_antes: { type: Number, required: true },
    video_review: { type: String, required: false },
    info_short: { type: String, required: true },
    detalle: { type: String, required: true },
    stock: { type: Number, required: true },
    categoria: { type: Schema.ObjectId, ref: 'categoria' },
    subcategoria: { type: String, required: false },
    marca: { type: Schema.ObjectId, ref: 'marca' },
    nombre_selector: { type: String, required: false },
    color: { type: Schema.ObjectId, ref: 'color'},
    selector: { type: Schema.ObjectId, ref: 'selector' },
    stars: { type: Number },
    ventas: { type: Number },
    status: { type: String, required: false, default: 'Desactivado' },
    isFeatured: { type: Boolean, required: false },
    createdAt: { type: Date, default: Date.now, required: true },
    updatedAt: { type: Date }
});

module.exports = mongoose.model('producto', ProductoSchema);