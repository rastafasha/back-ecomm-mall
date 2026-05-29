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
    const uid = req.uid; // ID del administrador que cambia el estado
    const { status } = req.body;

    try {
        // 1. Buscamos la transferencia original ANTES de modificarla
        const transferencia = await Transferencia.findById(id);
        if (!transferencia) {
            return res.status(404).json({
                ok: false,
                msg: 'Transferencia no encontrada por el id'
            });
        }

        // 🚨 CORRECCIÓN 1: Extraer de forma segura el ID del CLIENTE real antes de machacar el campo .usuario
        // (Ajusta 'cliente' o 'usuario' según como se llame el campo del comprador en tu modelo Transferencia)
        const clienteId = transferencia.user ;
        
        const antiguoEstado = transferencia.status;

        // Actualizar campos en la BD
        Object.assign(transferencia, req.body);
        transferencia.usuario = uid; // Aquí 'usuario' pasa a ser el admin validador
        
        if (status !== undefined && status !== antiguoEstado) {
            transferencia.updatedAt = new Date();
        }

        const transferenciaActualizado = await transferencia.save();

        // 🚀 DISPARO CENTRALIZADO DE NOTIFICACIÓN HYBRIDA
        if (status !== undefined && status !== antiguoEstado) {
            
            // CORRECCIÓN 3: Asegurar la coincidencia del string de estado ('APROBADO' o 'APROVED')
            const esAprobado = status === 'ok';
            
            let tipoNotificacion = esAprobado ? 'PAGO_APROBADO' : 'PAGO_RECHAZADO';
            let titulo = esAprobado ? '¡Pago Aprobado! 🎉' : 'Pago Rechazado ❌';
            let mensaje = esAprobado 
                ? 'Tu transferencia ha sido verificada con éxito.' 
                : `Hubo un problema con tu transferencia. Motivo: ${req.body.observaciones || 'Datos incorrectos'}`;

            const urlRedireccion = `/mis-pagos`;

            // Buscamos los dispositivos Push usando el clienteId correcto que guardamos arriba
            const subs = await PushSubscription.find({ usuario: clienteId });

            if (subs.length > 0) {
                // Caso A: El usuario tiene dispositivos registrados para Push.
                subs.forEach(s => {
                    sendNotification(
                        s.subscription, // 🚨 CORRECCIÓN 2: Se envía la propiedad interna 'subscription' como en la flecha
                        titulo, 
                        mensaje, 
                        urlRedireccion, 
                        clienteId, 
                        tipoNotificacion, 
                        transferencia._id
                    ).catch(err => { 
                        // Limpieza si expiró la suscripción
                        if (err.statusCode === 410 || err.statusCode === 404) {
                            s.deleteOne().catch(e => console.log('Error eliminando sub', e)); 
                        }
                    });
                });
            } else {
                // Caso B: Tu iPhone 6s u otros dispositivos sin Push nativo activo.
                // Registra en base de datos e intenta emitir por Socket.io a través del helper
                await sendNotification(
                    null, 
                    titulo, 
                    mensaje, 
                    urlRedireccion, 
                    clienteId, 
                    tipoNotificacion, 
                    transferencia._id
                );
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
             .populate('pedido')
            .sort({ createdAt: -1 });

        res.status(200).send({ transferencias: data_transferencia });
    } catch (err) {
        res.status(500).send({ error: err });
    }

};


const listarPagosPorUsuario = (req, res) => {
    var id = req.params['id'];
    const page = parseInt(req.query.page) || 1;
    const limit = 4; // Tu límite actual
    const skip = (page - 1) * limit; // Cuántos posts saltar

    Transferencia.find({ user: id })
        .populate('pedido')
        .populate('metodo_pago', 'tipo bankName' )
        .sort({ createdAt: -1 })
        .skip(skip)   // <-- Nos saltamos los ya cargados
        .limit(limit) // <-- Traemos los siguientes 4
        .exec((err, data) => {
            if (err) {
                return res.status(500).send({ ok: false, message: 'Error en el servidor' });
            }

            if (data) {
                // Es buena práctica enviar 'ok: true' para que coincida con tu map del frontend
                res.status(200).send({
                    ok: true,
                    transferencias: data
                });
            } else {
                res.status(404).send({ ok: false, transferencias: [] });
            }
        });
}

module.exports = {
    getTransferencias,
    crearTransferencia,
    actualizarTransferencia,
    borrarTransferencia,
    getTransferencia,
    listarPorUsuario,
    updateStatus,
    byTienda,
    listarPagosPorUsuario
};