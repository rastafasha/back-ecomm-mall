const { response } = require('express');
const Payment = require('../models/tipopago');

const getPayments = async(req, res) => {

    const payments = await Payment.find();

    res.json({
        ok: true,
        payments
    });
};

const getPayment = async(req, res) => {

    const id = req.params.id;
    const uid = req.uid;

    Payment.findById(id)
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
                    mensaje: 'El payment con el id ' + id + 'no existe',
                    errors: { message: 'No existe un payment con ese ID' }
                });

            }
            res.status(200).json({
                ok: true,
                payment: payment
            });
        });

};

const crearPayment = async(req, res) => {

    const uid = req.uid;
    const payment = new Payment({
        usuario: uid,
        ...req.body
    });

    try {

        const paymentDB = await payment.save();

        res.json({
            ok: true,
            payment: paymentDB
        });

    } catch (error) {
        console.log(error);
        res.status(500).json({
            ok: false,
            msg: 'Hable con el admin'
        });
    }


};

const actualizarPayment = async(req, res) => {

    const id = req.params.id;
    const uid = req.uid;

    try {

        const payment = await Payment.findById(id);
        if (!payment) {
            return res.status(500).json({
                ok: false,
                msg: 'payment no encontrado por el id'
            });
        }

        const cambiosPayment = {
            ...req.body,
            usuario: uid
        }

        const paymentActualizado = await Payment.findByIdAndUpdate(id, cambiosPayment, { new: true });

        res.json({
            ok: true,
            paymentActualizado
        });

    } catch (error) {
        res.status(500).json({
            ok: false,
            msg: 'Error hable con el admin'
        });
    }


};

const borrarPayment = async(req, res) => {

    const id = req.params.id;

    try {

        const payment = await Payment.findById(id);
        if (!payment) {
            return res.status(500).json({
                ok: false,
                msg: 'payment no encontrado por el id'
            });
        }

        await Payment.findByIdAndDelete(id);

        res.json({
            ok: true,
            msg: 'payment eliminado'
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
    Payment.find({ user: id }, (err, data_payment) => {
        if (!err) {
            if (data_payment) {
                res.status(200).send({ payments: data_payment });
            } else {
                res.status(500).send({ error: err });
            }
        } else {
            res.status(500).send({ error: err });
        }
    });
}



module.exports = {
    getPayments,
    crearPayment,
    actualizarPayment,
    borrarPayment,
    getPayment,
    listarPorUsuario
};