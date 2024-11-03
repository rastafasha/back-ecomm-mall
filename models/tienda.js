var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var TiendaSchema = Schema({
    nombre: { type: String, required: true },
    local: { type: String, required: true },
    telefono: { type: String, required: false },
    redssociales: { type: Array, required: false },

    direccion: { type: String, required: true },
    pais: { type: String, required: true },
    ciudad: { type: String, required: true },
    zip: { type: String, required: true },
    
    img: { type: String },
    state_banner: { type: Boolean },
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