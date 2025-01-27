const { response } = require('express');
const Cheque = require('../models/cheque');
const nodemailer = require('nodemailer');

const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
        user: process.env.EMAIL_BACKEND,
        pass: process.env.PASSWORD_APP
    }
});
const getCheques = async(req, res) => {

    const cheques = await Cheque.find().sort({ createdAt: -1 });

    res.json({
        ok: true,
        cheques,
    });
};

const getCheque = async(req, res) => {

    const id = req.params.id;
    const uid = req.uid;

    Cheque.findById(id)
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
                    mensaje: 'Cheque con el id ' + id + 'no existe',
                    errors: { message: 'No existe una Cheque con ese ID' }
                });

            }
            res.status(200).json({
                ok: true,
                payment: payment
            });
        });

};

const crearCheque = async(req, res) => {
    
    const uid = req.uid;
    const cheque = new Cheque({
        usuario: uid,
        ...req.body
    });

    try {

        const chequeDB = await cheque.save();
        const id = chequeDB._id;

        sendEmailAdmin(uid,id);

        res.json({
            ok: true,
            cheque: chequeDB
        });

    } catch (error) {
        console.log(error);
        res.status(500).json({
            ok: false,
            msg: 'Hable con el admin'
        });
    }


};

const actualizarCheque = async(req, res) => {

    const id = req.params.id;
    const uid = req.uid;

    try {

        const cheque = await Cheque.findById(id);
        if (!cheque) {
            return res.status(500).json({
                ok: false,
                msg: 'cheque no encontrado por el id'
            });
        }

        const cambiosCheque = {
            ...req.body,
            usuario: uid
        }

        const chequeActualizado = await Cheque.findByIdAndUpdate(id, cambiosCheque, { new: true });

        res.json({
            ok: true,
            chequeActualizado
        });

    } catch (error) {
        res.status(500).json({
            ok: false,
            msg: 'Error hable con el admin'
        });
    }


};

const borrarCheque = async(req, res) => {

    const id = req.params.id;

    try {

        const cheque = await Cheque.findById(id);
        if (!cheque) {
            return res.status(500).json({
                ok: false,
                msg: 'cheque no encontrado por el id'
            });
        }

        await Cheque.findByIdAndDelete(id);

        res.json({
            ok: true,
            msg: 'cheque eliminado'
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
    Cheque.find({ user: id }, (err, data_cheque) => {
        if (!err) {
            if (data_cheque) {
                res.status(200).send({ cheques: data_cheque });
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

        const cheque = await Cheque.findById(id);
        if (!cheque) {
            return res.status(500).json({
                ok: false,
                msg: 'cheque no encontrado por el id'
            });
        }

        const cambiosCheque = {
            ...req.body,
            usuario: uid
        }

        const chequeActualizado = await Cheque.findByIdAndUpdate(id, cambiosCheque, { new: true });

        res.json({
            ok: true,
            chequeActualizado
        });

    } catch (error) {
        res.status(500).json({
            ok: false,
            msg: 'Error hable con el admin'
        });
    }
}

function sendEmailAdmin(user, id){
    const texto = `Hola! El usuario ${user} ha realizado una compra con cheque cuyo id es ${id}`;

    const mailOptions = {
        from: 'tu-email@gmail.com', // Remitente
        to: process.env.EMAIL_DEST,
        subject: 'Nueva Compra con Cheque',
        text:texto,
        html: `
            <p>${texto}</p>
        `
    };

    transporter.sendMail(mailOptions, (error, info) => {
        if(error){
            console.log(error);
        }
        else{
            console.log('Correo enviado: ' + info.response);
        }
    })
}



module.exports = {
    getCheques,
    crearCheque,
    actualizarCheque,
    borrarCheque,
    getCheque,
    listarPorUsuario,
    updateStatus,
};