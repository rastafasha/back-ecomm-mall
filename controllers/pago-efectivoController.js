const { response } = require('express');
const PagoEfectivo = require('../models/pago.efectivo');

const getPagosEfectivo = async(req, res) => {

    const pagoefectivos = await PagoEfectivo.find().sort({ createdAt: -1 });

    res.json({
        ok: true,
        pagoefectivos
    });
};

const crearPagoEfectivo = async(req, res) => {
    
    const uid = req.uid;
    const pago_efectivo = new PagoEfectivo({
        usuario: uid,
        ...req.body
    });

    try {

        const pagoEfectivoDB = await pago_efectivo.save();

        res.json({
            ok: true,
            pago_efectivo: pagoEfectivoDB
        });

    } catch (error) {
        // console.log(error);
        res.status(500).json({
            ok: false,
            msg: 'Hable con el admin'
        });
    }


};

module.exports = {
    getPagosEfectivo,
    crearPagoEfectivo
}