var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var TiendaSchema = Schema({
    nombre: { type: String, required: true },
    slug: { type: String, required: true, unique: true },
    local: { type: String, required: true },
    pais: { type: String, required: false },
    ciudad: { type: String, required: false },
    zip: { type: String, required: false },
    direccion: { type: String, required: false },
    telefono: { type: String, required: false },
    redssociales: { type: Array, required: false },
    img: { type: String, required: false },
    status: { type: String, required: false, default: 'Desactivado' },
    categoria: { type: Schema.ObjectId, ref: 'categoria' },
    subcategoria: { type: String, required: false },
    productos: { type: Schema.ObjectId, ref: 'productos' },
    user: { type: Schema.ObjectId, ref: 'user' },
    isFeatured: { type: Boolean, required: false },
    createdAt: { type: Date, default: Date.now, required: true },
    updatedAt: { type: Date }
});

module.exports = mongoose.model('tienda', TiendaSchema);