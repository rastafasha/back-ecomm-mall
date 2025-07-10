const { response } = require('express');
const PagoCheque = require('../models/pagocheque');

const getPagosCheque = async(req, res) => {

    const pagos_cheques = await PagoCheque.find().sort({ createdAt: -1 });

    res.json({
        ok: true,
        pagos_cheques
    });
};

const crearPagoCheque = async(req, res) => {
    
    const uid = req.uid;
    const pago_cheque = new PagoCheque({
        usuario: uid,
        ...req.body
    });

    try {

        const pagoChequeDB = await pago_cheque.save();

        res.json({
            ok: true,
            pago_cheque: pagoChequeDB
        });

    } catch (error) {
        console.log(error);
        res.status(500).json({
            ok: false,
            msg: 'Hable con el admin'
        });
    }


};

module.exports = {
    getPagosCheque,
    crearPagoCheque
}