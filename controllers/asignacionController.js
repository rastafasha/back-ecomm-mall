const { response } = require('express');
const Tienda = require('../models/tienda');
const Venta = require('../models/venta');
const Driver = require('../models/driver');
const Asignacion = require('../models/asignardelivery');



const crearAsignacion = async(req, res) => {

    const { driver, status, tienda, venta } = req.body;

    const body = req.body;
    try {

        const existeDriver = await Driver.findById(body.driver);
       
        const existeTienda = await Tienda.findById(body.tienda);
        const existeVenta = await Venta.findById(body.venta);

        if (!existeDriver) {
            return res.status(400).json({
                ok: false,
                 msg: 'El Conductor no existe'
            })
        }
        if (!existeTienda) {
            return res.status(400).json({
                ok: false,
                msg: 'La tienda no existe'
            });
        }
        if (!existeVenta) {
            return res.status(400).json({
                ok: false,
                msg: 'La venta no existe'
            });
        }

        
        const asignacion = new Asignacion({
            driver: body.driver,
            tienda: body.tienda,
            venta: body.venta,
            status: body.status,
        });

        //guardar asignacion
        await asignacion.save();

        res.json({
            ok: true,
            asignacion
        });

    } catch (error) {
        console.log(error);
        res.status(500).json({
            ok: false,
            msg: 'Error inesperado... revisar logs'
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
        const driver = await Driver.findById(id);
        if (!driver) {
            return res.status(500).json({
                ok: false,
                msg: 'driver no encontrado por el id'
            });
        }

        const cambiosAsignacion = {
            ...req.body,
            usuario: uid
        }

        const asignacionActualizado = await Asignacion.findByIdAndUpdate(id, cambiosAsignacion, { new: true });

        res.json({
            ok: true,
            asignacionActualizado,
            driver
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
      

    res.json({
        ok: true,
        asignacions
    });
};
const getAsignacionsTienda = async(req, res) => {

    const asignacions = await Asignacion.find().populate('tienda')
    .populate('driver');

      
    const tiendaid = req.params.tiendaid;
    const tienda = await Tienda.findById(tiendaid);

    const asignacionsTienda = asignacions.filter(asignacion => asignacion.tienda.toString() === tiendaid)
    ;  


    res.json({
        ok: true,
        // asignacionsTienda,
        asignacions,
    });
};

const getAsignacion = async(req, res) => {

    const id = req.params.id;

    Asignacion.findById(id)
        .populate('driver')
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
    listarAsignacionPorUsuario,
    getAsignacionsTienda

};