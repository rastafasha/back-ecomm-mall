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
        // usuario: uid,
        ...req.body
    });

    try {

        const pagoEfectivoDB = await pago_efectivo.save();

        res.json({
            ok: true,
            pago_efectivo: pagoEfectivoDB
        });

    } catch (error) {
        console.log(error);
        res.status(500).json({
            ok: false,
            msg: 'Hable con el admin'
        });
    }


};

const byTienda = async(req, res) => {

    var id = req.params['id'];
    try {
        const data_efectivo = await PagoEfectivo.find({ tienda: id })
            .populate('metodo_pago')
            .populate('local')
            .sort({ createdAt: -1 });

        res.status(200).send({ pagoefectivos: data_efectivo });
    } catch (err) {
        res.status(500).send({ error: err });
    }

};

module.exports = {
    getPagosEfectivo,
    crearPagoEfectivo,
    byTienda
}