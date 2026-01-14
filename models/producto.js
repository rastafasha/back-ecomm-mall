'use strict'

var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var ProductoSchema = Schema({
    titulo: { type: String, required: true, unique: true },
    slug: { type: String, required: true, unique: true },
    img: { type: String, required: false },
    precio_ahora: { type: Number, required: true },
    precio_antes: { type: Number, required: true },
    video_review: { type: String, required: false },
    sku: { type: String, required: true },
    info_short: { type: String, required: true },
    detalle: { type: String, required: true },
    stock: { type: Number, required: true },
    categoria: { type: Schema.ObjectId, ref: 'categoria' },
    subcategoria: { type: String, required: false },
    nombre_selector: { type: String, required: false },
    marca: { type: Schema.ObjectId, ref: 'marca' },
    color: { type: Schema.ObjectId, ref: 'color', default: '#333333'},
    selector: { type: Schema.ObjectId, ref: 'selector', default: 'unico' },
    local: { type: Schema.ObjectId, ref: 'tienda' },
    stars: { type: Number },
    ventas: { type: Number },
    isFeatured: { type: Boolean, required: false },
    status: { type: String, required: false, default: 'Desactivado' },
    createdAt: { type: Date, default: Date.now, required: true },
    updatedAt: { type: Date }
});

module.exports = mongoose.model('producto', ProductoSchema);