const { Schema, model } = require('mongoose');

const DriverProfileSchema = Schema({
    tipo_vehiculo: { type: String, require: true },
    placa: { type: String, require: true },
    color: { type: String, require: true, unique: true },
    modelo: { type: String, require: true },
    marca: { type: String, require: true },
    año: { type: String, require: true },
    licencianum: { type: String, require: true },
    img: { type: String, },
    status: { type: String, required: false, default: 'PENDING' },
    user: { type: Schema.ObjectId, ref: 'user', require: true  },
    asignaciones: { type: String, require: false, ref: 'asignardelivery' },
    // rutas: { type: String, require: true, default: 'USER' },
});

DriverProfileSchema.method('toJSON', function() { // modificar el _id a uid, esconde el password
    const { __v, _id, password, ...object } = this.toObject();
    object.uid = _id;
    return object;
});

module.exports = model('driver', DriverProfileSchema);