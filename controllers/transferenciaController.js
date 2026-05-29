const { response } = require('express');
const Transferencia = require('../models/transferencia');
const nodemailer = require('nodemailer');
const Congeneral = require('../models/congeneral');
const PushSubscription = require('../models/push-subscription');
const { sendNotification } = require('../helpers/notificaciones');

const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
        user: process.env.EMAIL_BACKEND,
        pass: process.env.PASSWORD_APP
    }
});

const getTransferencias = async(req, res) => {

    const transferencias = await Transferencia.find()
    .sort({ createdAt: -1 })
    .populate('metodo_pago')
    ;

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
        user: uid,
        ...req.body
    });

    try {

        const transferenciaDB = await transferencia.save();
        const id = transferenciaDB._id;
        //nnotificamos a la tienda
        // sendEmailAdmin(uid,id);

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

        // Update fields
        Object.assign(transferencia, req.body);
        transferencia.usuario = uid;
        
        // Update updatedAt if status changed
        if (req.body.status !== undefined && req.body.status !== transferencia.status) {
            transferencia.updatedAt = new Date();
        }

        const transferenciaActualizado = await transferencia.save();

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

const updateStatus = async (req, res) => {
    const id = req.params.id;
    const uid = req.uid; // ID del admin/usuario que opera
    const { status } = req.body;

    try {
        const transferencia = await Transferencia.findById(id);
        if (!transferencia) {
            return res.status(404).json({
                ok: false,
                msg: 'Transferencia no encontrada por el id'
            });
        }

        const antiguoEstado = transferencia.status;

        // Actualizar campos
        Object.assign(transferencia, req.body);
        transferencia.usuario = uid; 
        
        if (status !== undefined && status !== antiguoEstado) {
            transferencia.updatedAt = new Date();
        }

        const transferenciaActualizado = await transferencia.save();

        // 🚀 DISPARO CENTRALIZADO DE NOTIFICACIÓN HYBRIDA
        if (status !== undefined && status !== antiguoEstado) {
            
            let tipoNotificacion = 'NUEVO_PAGO';
            let titulo = 'Actualización de Pago';
            let mensaje = `Tu pago de transferencia ha cambiado a estado: ${status}`;

            if (status === 'ok') {
                tipoNotificacion = 'PAGO_APROBADO';
                titulo = '¡Pago Aprobado! 🎉';
                mensaje = 'Tu transferencia ha sido verificada con éxito.';
            } else if (status === 'no') {
                tipoNotificacion = 'PAGO_RECHAZADO';
                titulo = 'Pago Rechazado ❌';
                mensaje = 'Hubo un problema con tu transferencia. Por favor verifica los datos.';
            }

            const clienteId = transferencia.usuarioOriginal || transferencia.clienteId || transferencia.usuario;
            const urlRedireccion = `/mis-pagos/${transferencia._id}`;

            // 1. Buscamos los dispositivos Push del cliente
            const subs = await PushSubscription.find({ usuario: clienteId });

            if (subs.length > 0) {
                // Caso A: El usuario tiene dispositivos registrados para Push.
                // Ejecutamos el helper por cada dispositivo.
                // Nota: La BD y el Socket se ejecutarán de forma segura en la primera iteración.
                for (const sub of subs) {
                    try {
                        await sendNotification(sub, titulo, mensaje, urlRedireccion, clienteId, tipoNotificacion, transferencia._id);
                    } catch (pushErr) {
                        // Si el helper arrojó un error 410/404, limpiamos la suscripción inservible de la BD
                        if (pushErr.statusCode === 410 || pushErr.statusCode === 404) {
                            await PushSubscription.findByIdAndDelete(sub._id);
                            console.log(`[Limpieza] Suscripción eliminada de la BD por estar expirada.`);
                        }
                    }
                }
            } else {
                // Caso B: El usuario no tiene Web Push activado (Ej: Tu iPhone 6s o navegación incógnito).
                // Pasamos 'null' en la suscripción, pero el helper igual guardará en BD y enviará por WebSockets.
                await sendNotification(null, titulo, mensaje, urlRedireccion, clienteId, tipoNotificacion, transferencia._id);
            }
        }

        res.json({
            ok: true,
            transferenciaActualizado
        });

    } catch (error) {
        console.error(error);
        res.status(500).json({
            ok: false,
            msg: 'Error hable con el admin'
        });
    }
}

function sendEmailAdmin(user, id){
    const texto = `Hola! El usuario ${user} ha realizado una compra con transferencia bancaria cuyo id es ${id}`;
    // traemos el email de congeneralController para enviar el correo
    //buscamos en el modelo
    // Congeneral.findById(id)

    const mailOptions = {
        from: 'tu-email@gmail.com', // Remitente
        to: process.env.EMAIL_DEST,
        subject: 'Nueva Compra con Transferencia Bancaria',
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
    // enviarWhatsappSencillo();
}


const byTienda = async(req, res) => {

    var tiendaid = req.params['tiendaid'];
    try {
        const data_transferencia = await Transferencia.find({ tienda: tiendaid })
            .populate('metodo_pago')
             .populate('local')
            .sort({ createdAt: -1 });

        res.status(200).send({ transferencias: data_transferencia });
    } catch (err) {
        res.status(500).send({ error: err });
    }

};




module.exports = {
    getTransferencias,
    crearTransferencia,
    actualizarTransferencia,
    borrarTransferencia,
    getTransferencia,
    listarPorUsuario,
    updateStatus,
    byTienda
};