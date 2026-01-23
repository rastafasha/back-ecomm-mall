/*
 Ruta: /api/asignardelivery
 */

 const { Router } = require('express');
 const router = Router();
 const {
 
    crearAsignacion,
    actualizarAsignacion,
    getAsignacions,
    getAsignacionsTienda,
    getAsignacion,
    borrarAsignacion,
    listarAsignacionPorUsuario
 } = require('../controllers/asignacionController');
 const { validarJWT } = require('../middlewares/validar-jwt');
 const { validarCampos } = require('../middlewares/validar-campos');
 
 
 router.get('/', getAsignacions);
 router.get('/:id', getAsignacion);
 router.get('/user/:id', listarAsignacionPorUsuario);
 router.get('/tienda/:tiendaid', getAsignacionsTienda);
 
 router.post('/store', [
     validarJWT,
     validarCampos
 ], crearAsignacion);
 
 router.put('/update/:id', [
     validarJWT,
     validarCampos
 ], actualizarAsignacion);
 
 router.delete('/remove/:id', validarJWT, borrarAsignacion);
 
 
 
 
 
 module.exports = router;