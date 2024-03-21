const { response } = require('express');
const Medico = require('../models/medico');

const crearMedico = async(req, res) => {

    const uid = req.uid;
    const medico = new Medico({
        usuario: uid,
        ...req.body
    });

    try {

        const medicoDB = await medico.save();

        res.json({
            ok: true,
            medico: medicoDB
        });

    } catch (error) {

        console.log(error);
        res.status(500).json({
            ok: false,
            msg: 'Hable con el admin'
        });
    }
};

const actualizarMedico = async(req, res) => {

    const id = req.params.id;
    const uid = req.uid;


    try {
        const medico = await Medico.findById(id);
        if (!medico) {
            return res.status(500).json({
                ok: false,
                msg: 'Medico no encontrado por el id'
            });
        }

        const cambiosMedico = {
            ...req.body,
            usuario: uid
        }
        const medicoActualizado = await Medico.findByIdAndUpdate(id, cambiosMedico, { new: true });

        res.json({
            ok: true,
            msg: 'actualizarMedico',
            medicoActualizado
        });

    } catch (error) {
        res.status(500).json({
            ok: false,
            msg: 'Error hable con el admin'
        });
    }


};

const borrarMedico = async(req, res) => {
    const id = req.params.id;


    try {
        const medico = await Medico.findById(id);
        if (!medico) {
            return res.status(500).json({
                ok: false,
                msg: 'Medico no encontrado por el id'
            });
        }

        await Medico.findByIdAndDelete(id);
        res.json({
            ok: true,
            msg: 'Medico eliminado'
        });

    } catch (error) {
        res.status(500).json({
            ok: false,
            msg: 'Error hable con el admin'
        });
    }

};

const getMedicos = async(req, res) => {

    const medicos = await Medico.find()
        .populate('usuario', 'nombre img')
        .populate('hospital', 'nombre img');

    res.json({
        ok: true,
        medicos
    });

};

const getMedicoById = async(req, res = response) => {

    const id = req.params.id;

    try {

        const medico = await Medico.findById(id)
            .populate('usuario', 'nombre img')
            .populate('hospital', 'nombre img');

        res.json({
            ok: true,
            medico
        });

    } catch (error) {
        console.log(error);
        res.status(500).json({
            ok: false,
            msg: 'Error hable con el admin'
        });

    }



};

module.exports = {
    getMedicos,
    crearMedico,
    actualizarMedico,
    borrarMedico,
    getMedicoById
};