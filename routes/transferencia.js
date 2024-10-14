/*
 Ruta: /api/payments
 */

 const { Router } = require('express');
 const router = Router();
 const {
    getTransferencias,
    crearTransferencia,
    actualizarTransferencia,
    borrarTransferencia,
    getTransferencia,
    listarPorUsuario
 } = require('../controllers/transferenciaController');
 const { validarJWT } = require('../middlewares/validar-jwt');
 const { check } = require('express-validator');
 const { validarCampos } = require('../middlewares/validar-campos');
 
 router.get('/', getTransferencias);
 router.get('/transferencia/:id', listarPorUsuario);
 
 router.post('/transferencia/registro', [
     validarJWT,
     check('type', 'El type es necesario').not().isEmpty(),
     validarCampos
 ], crearTransferencia);
 
 router.put('/transferencia/update/:id', [
     validarJWT,
     check('type', 'El type es necesario').not().isEmpty(),
     validarCampos
 ], actualizarTransferencia);
 
 router.delete('/transferencia/remove/:id', validarJWT, borrarTransferencia);
 
 router.get('/transferencia/data/:id', getTransferencia);
 
 
 
 module.exports = router;