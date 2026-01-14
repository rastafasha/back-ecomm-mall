const { response } = require('express');
const Asignacion = require('../models/asignardelivery');

const crearAsignacion = async(req, res) => {

    const uid = req.uid;
    const asignacion = new Asignacion({
        usuario: uid,
        ...req.body
    });

    try {

        const asignacionDB = await Asignacion.save();

        res.json({
            ok: true,
            asignacion: asignacionDB
        });

    } catch (error) {
        console.log(error);
        res.status(500).json({
            ok: false,
            msg: 'Hable con el admin'
        });
    }


};

const actualizarAsignacion = async(req, res) => {

    const id = req.params.id;
    const uid = req.uid;

    try {

        const asignacion = await Asignacion.findById(id);
        if (!asignacion) {
            return res.status(500).json({
                ok: false,
                msg: 'asignacion no encontrado por el id'
            });
        }

        const cambiosAsignacion = {
            ...req.body,
            usuario: uid
        }

        const asignacionActualizado = await Asignacion.findByIdAndUpdate(id, cambiosAsignacion, { new: true });

        res.json({
            ok: true,
            asignacionActualizado
        });

    } catch (error) {
        console.log(error);
        res.status(500).json({
            ok: false,
            msg: 'Error hable con el admin'
        });
    }


};

const getAsignacions = async(req, res) => {

    const asignacions = await Asignacion.find()
        .populate('asignacion')
        .populate('usuario')

    res.json({
        ok: true,
        asignacions
    });
};

const getAsignacion = async(req, res) => {

    const id = req.params.id;

    Asignacion.findById(id)
        .populate('usuario')
        .exec((err, asignacion) => {
            if (err) {
                return res.status(500).json({
                    ok: false,
                    mensaje: 'Error al buscar asignacion',
                    errors: err
                });
            }
            if (!asignacion) {
                return res.status(400).json({
                    ok: false,
                    mensaje: 'El asignacion con el id ' + id + 'no existe',
                    errors: { message: 'No existe un asignacion con ese ID' }
                });

            }
            res.status(200).json({
                ok: true,
                asignacion: asignacion
            });
        });

};


const borrarAsignacion = async(req, res) => {

    const id = req.params.id;

    try {

        const asignacion = await Asignacion.findById(id);
        if (!asignacion) {
            return res.status(500).json({
                ok: false,
                msg: 'asignacion no encontrado por el id'
            });
        }

        await asignacion.findByIdAndDelete(id);

        res.json({
            ok: true,
            msg: 'asignacion eliminado'
        });

    } catch (error) {
        res.status(500).json({
            ok: false,
            msg: 'Error hable con el admin'
        });
    }
};

const listarAsignacionPorUsuario = (req, res) => {
    var id = req.params['id'];
    Asignacion.find({ usuario: id }, (err, data_asignacion) => {
        if (!err) {
            if (data_asignacion) {
                res.status(200).send({ asignacions: data_asignacion });
            } else {
                res.status(500).send({ error: err });
            }
        } else {
            res.status(500).send({ error: err });
        }
    }).populate('producto')
    .sort({createdAt: - 1});
}



module.exports = {
    crearAsignacion,
    actualizarAsignacion,
    getAsignacions,
    getAsignacion,
    borrarAsignacion,
    listarAsignacionPorUsuario

};