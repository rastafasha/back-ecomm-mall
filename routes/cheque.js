/*
 Ruta: /api/cheques
 */

 const { Router } = require('express');
 const router = Router();
 const {
    getCheques,
    crearCheque,
    actualizarCheque,
    borrarCheque,
    getCheque,
    listarPorUsuario,
    updateStatus
 } = require('../controllers/chequeController');
 const { validarJWT } = require('../middlewares/validar-jwt');
 const { check } = require('express-validator');
 const { validarCampos } = require('../middlewares/validar-campos');
 
 router.get('/', getCheques);
 router.get('/cheque/:id', listarPorUsuario);
 
 router.post('/store', crearCheque);
 
 router.put('/update/:id', [
     validarJWT,
     check('type', 'El type es necesario').not().isEmpty(),
     validarCampos
 ], actualizarCheque);

 router.put('/statusupdate/:id', updateStatus);
 
 router.delete('/remove/:id', validarJWT, borrarCheque);
 
 
 
 
 module.exports = router;