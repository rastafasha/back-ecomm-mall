const { response } = require('express');
const Tienda = require('../models/tienda');
const Producto = require('../models/producto');
const User = require('../models/usuario');
const Categoria = require('../models/categoria');

const getTiendas = async(req, res) => {

    const tiendas = await Tienda.find();

    res.json({
        ok: true,
        tiendas,
        categoria:Categoria
    });
};

const getTienda = async(req, res) => {

    const id = req.params.id;
    const uid = req.uid;

    Tienda.findById(id)
        .exec((err, tienda) => {
            if (err) {
                return res.status(500).json({
                    ok: false,
                    mensaje: 'Error al buscar tienda',
                    errors: err
                });
            }
            if (!tienda) {
                return res.status(400).json({
                    ok: false,
                    mensaje: 'El tienda con el id ' + id + 'no existe',
                    errors: { message: 'No existe un tienda con ese ID' }
                });

            }
            res.status(200).json({
                ok: true,
                tienda: tienda,
                users: User,
                productos: Producto,
            });
        });

};



const crearTienda = async(req, res) => {

    const uid = req.uid;
    const tienda = new Tienda({
        usuario: uid,
        ...req.body
    });

    try {

        const tiendaDB = await tienda.save();

        res.json({
            ok: true,
            tienda: tiendaDB
        });

    } catch (error) {
        console.log(error);
        res.status(500).json({
            ok: false,
            msg: 'Hable con el admin'
        });
    }


};

const actualizarTienda = async(req, res) => {

    const id = req.params.id;
    const uid = req.uid;

    try {

        const tienda = await Tienda.findById(id);
        if (!tienda) {
            return res.status(500).json({
                ok: false,
                msg: 'Tienda no encontrado por el id'
            });
        }

        const cambiosTienda = {
            ...req.body,
            usuario: uid
        }

        const tiendaActualizado = await Tienda.findByIdAndUpdate(id, cambiosTienda, { new: true });

        res.json({
            ok: true,
            tiendaActualizado
        });

    } catch (error) {
        res.status(500).json({
            ok: false,
            msg: 'Error hable con el admin'
        });
    }


};

const borrarTienda = async(req, res) => {

    const id = req.params.id;

    try {

        const tienda = await Tienda.findById(id);
        if (!tienda) {
            return res.status(500).json({
                ok: false,
                msg: 'Tienda no encontrado por el id'
            });
        }

        await Tienda.findByIdAndDelete(id);

        res.json({
            ok: true,
            msg: 'Tienda eliminado'
        });

    } catch (error) {
        res.status(500).json({
            ok: false,
            msg: 'Error hable con el admin'
        });
    }
};



function list_one(req, res) {
    var id = req.params['id'];

    Tienda.findOne({ _id: id }, (err, tienda_data) => {
        if (err) {
            res.status(500).send({ message: 'Ocurrió un error en el servidor.' });
        } else {
            if (tienda_data) {
                res.status(200).send({ tienda: tienda_data });
            } else {
                res.status(500).send({ message: 'No se encontró ninguna tienda con este ID.' });
            }
        }
    })

}


function find_by_name(req, res) {
    var nombre = req.params['nombre'];

    Tienda.findOne({ nombre: nombre }).exec((err, tienda_data) => {
        if (err) {
            res.status(500).send({ message: 'Ocurrió un error en el servidor.' });
        } else {
            if (tienda_data) {
                res.status(200).send({ tienda: tienda_data });
            } else {
                res.status(500).send({ message: 'No se encontró ningun dato en esta sección.' });
            }
        }
    });
}


const getTiendasActivos = async(req, res) => {

    Tienda.find({  status: ['Activo'] }).exec((err, tienda_data) => {
        if (err) {
            res.status(500).send({ message: 'Ocurrió un error en el servidor.' });
        } else {
            if (tienda_data) {
                res.status(200).send({ tiendas: tienda_data });
            } else {
                res.status(500).send({ message: 'No se encontró ningun dato en esta sección.' });
            }
        }
    });

};



function desactivar(req, res) {
    var id = req.params['id'];

    Tienda.findByIdAndUpdate({ _id: id }, { status: 'Desactivado' }, (err, tienda_data) => {
        if (err) {
            res.status(500).send({ message: err });
        } else {
            if (tienda_data) {
                res.status(200).send({ tienda: tienda_data });
            } else {
                res.status(403).send({ message: 'No se actualizó el tienda, vuelva a intentar nuevamente.' });
            }
        }
    })
}

function activar(req, res) {
    var id = req.params['id'];
    // console.log(id);
    Tienda.findByIdAndUpdate({ _id: id }, { status: 'Activo' }, (err, tienda_data) => {
        if (err) {
            res.status(500).send({ message: err });
        } else {
            if (tienda_data) {
                res.status(200).send({ tienda: tienda_data });
            } else {
                res.status(403).send({ message: 'No se actualizó el tienda, vuelva a intentar nuevamente.' });
            }
        }
    })
}

module.exports = {
    getTiendas,
    crearTienda,
    actualizarTienda,
    borrarTienda,
    getTienda,
    list_one,
    find_by_name,
    getTiendasActivos,
    desactivar,
    activar
};