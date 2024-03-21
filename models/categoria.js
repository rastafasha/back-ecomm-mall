var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var CategoriaSchema = Schema({
    nombre: { type: String, required: true },
    icono: { type: String, required: true },
    subcategorias: { type: String, required: false },
    img: { type: String },
    state_banner: { type: Boolean },
    status: { type: String, required: false, default: 'Desactivado' },
    productos: { type: Schema.ObjectId, ref: 'productos' },
    createdAt: { type: Date, default: Date.now, required: true },
    updatedAt: { type: Date }
});

module.exports = mongoose.model('categoria', CategoriaSchema);