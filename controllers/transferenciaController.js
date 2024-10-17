const { response } = require('express');
const Transferencia = require('../models/transferencia');

const getTransferencias = async(req, res) => {

    const transferencias = await Transferencia.find();

    res.json({
        ok: true,
        transferencias
    });
};

const getTransferencia = async(req, res) => {

    const id = req.params.id;
    const uid = req.uid;

    Transferencia.findById(id)
        .exec((err, payment) => {
            if (err) {
                return res.status(500).json({
                    ok: false,
                    mensaje: 'Error al buscar payment',
                    errors: err
                });
            }
            if (!payment) {
                return res.status(400).json({
                    ok: false,
                    mensaje: 'Transferencia con el id ' + id + 'no existe',
                    errors: { message: 'No existe una Transferencia con ese ID' }
                });

            }
            res.status(200).json({
                ok: true,
                payment: payment
            });
        });

};

const crearTransferencia = async(req, res) => {

    const uid = req.uid;
    const transferencia = new Transferencia({
        usuario: uid,
        ...req.body
    });

    try {

        const transferenciaDB = await transferencia.save();

        res.json({
            ok: true,
            transferencia: transferenciaDB
        });

    } catch (error) {
        console.log(error);
        res.status(500).json({
            ok: false,
            msg: 'Hable con el admin'
        });
    }


};

const actualizarTransferencia = async(req, res) => {

    const id = req.params.id;
    const uid = req.uid;

    try {

        const transferencia = await Transferencia.findById(id);
        if (!transferencia) {
            return res.status(500).json({
                ok: false,
                msg: 'transferencia no encontrado por el id'
            });
        }

        const cambiosTransferencia = {
            ...req.body,
            usuario: uid
        }

        const transferenciaActualizado = await Transferencia.findByIdAndUpdate(id, cambiosTransferencia, { new: true });

        res.json({
            ok: true,
            transferenciaActualizado
        });

    } catch (error) {
        res.status(500).json({
            ok: false,
            msg: 'Error hable con el admin'
        });
    }


};

const borrarTransferencia = async(req, res) => {

    const id = req.params.id;

    try {

        const transferencia = await Transferencia.findById(id);
        if (!transferencia) {
            return res.status(500).json({
                ok: false,
                msg: 'transferencia no encontrado por el id'
            });
        }

        await Transferencia.findByIdAndDelete(id);

        res.json({
            ok: true,
            msg: 'transferencia eliminado'
        });

    } catch (error) {
        res.status(500).json({
            ok: false,
            msg: 'Error hable con el admin'
        });
    }
};

const listarPorUsuario = (req, res) => {
    var id = req.params['id'];
    Transferencia.find({ user: id }, (err, data_transferencia) => {
        if (!err) {
            if (data_transferencia) {
                res.status(200).send({ transferencias: data_transferencia });
            } else {
                res.status(500).send({ error: err });
            }
        } else {
            res.status(500).send({ error: err });
        }
    });
}


const updateStatus = async(req, res) =>{
    const id = req.params.id;
    const uid = req.uid;

    try {

        const transferencia = await Transferencia.findById(id);
        if (!transferencia) {
            return res.status(500).json({
                ok: false,
                msg: 'transferencia no encontrado por el id'
            });
        }

        const cambiosTransferencia = {
            ...req.body,
            usuario: uid
        }

        const transferenciaActualizado = await Transferencia.findByIdAndUpdate(id, cambiosTransferencia, { new: true });

        res.json({
            ok: true,
            transferenciaActualizado
        });

    } catch (error) {
        res.status(500).json({
            ok: false,
            msg: 'Error hable con el admin'
        });
    }
}



module.exports = {
    getTransferencias,
    crearTransferencia,
    actualizarTransferencia,
    borrarTransferencia,
    getTransferencia,
    listarPorUsuario,
    updateStatus,
};