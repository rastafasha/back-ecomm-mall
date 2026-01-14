const { response } = require('express');
const Driverp = require('../models/driverprofile');

const crearDriver = async(req, res) => {

    const uid = req.uid;
    const driver = new Driverp({
        usuario: uid,
        ...req.body
    });

    try {
        const driverDB = await driver.save();

        res.json({
            ok: true,
            driver: driverDB
        });

    } catch (error) {
        console.log(error);
        res.status(500).json({
            ok: false,
            msg: 'Hable con el admin'
        });
    }


};

const actualizarDriver = async(req, res) => {

    const id = req.params.id;
    const uid = req.uid;

    try {

        const driver = await Driverp.findById(id);
        if (!driver) {
            return res.status(500).json({
                ok: false,
                msg: 'driver no encontrado por el id'
            });
        }

        const cambiosDriver = {
            ...req.body,
            usuario: uid
        }

        const driverActualizado = await Driverp.findByIdAndUpdate(id, cambiosDriver, { new: true });

        res.json({
            ok: true,
            driverActualizado
        });

    } catch (error) {
        console.log(error);
        res.status(500).json({
            ok: false,
            msg: 'Error hable con el admin'
        });
    }


};

const getDrivers = async(req, res) => {

    const drivers = await Driverp.find()
        .populate('user')

    res.json({
        ok: true,
        drivers
    });
};

const getDriver = async(req, res) => {

    const id = req.params.id;

    Driverp.findById(id)
        .populate('user')
        .populate('asignaciones')
        .exec((err, driver) => {
            if (err) {
                return res.status(500).json({
                    ok: false,
                    mensaje: 'Error al buscar driver',
                    errors: err
                });
            }
            if (!driver) {
                return res.status(400).json({
                    ok: false,
                    mensaje: 'El driver con el id ' + id + 'no existe',
                    errors: { message: 'No existe un driver con ese ID' }
                });

            }
            res.status(200).json({
                ok: true,
                driver: driver
            });
        });

};


const borrarDriver = async(req, res) => {

    const id = req.params.id;

    try {

        const driver = await Driverp.findById(id);
        if (!driver) {
            return res.status(500).json({
                ok: false,
                msg: 'driver no encontrado por el id'
            });
        }

        await driver.findByIdAndDelete(id);

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

const listarDriverPorUsuario = (req, res) => {
    var id = req.params['id'];
    Driverp.find({ usuario: id }, (err, data_driver) => {
        if (!err) {
            if (data_driver) {
                res.status(200).send({ drivers: data_driver });
            } else {
                res.status(500).send({ error: err });
            }
        } else {
            res.status(500).send({ error: err });
        }
    }).populate('user')
    .sort({createdAt: - 1});
}



module.exports = {
    crearDriver,
    actualizarDriver,
    getDrivers,
    getDriver,
    borrarDriver,
    listarDriverPorUsuario

};