/*
 Ruta: /api/tipopago
 */

const { Router } = require('express');
const router = Router();
const {
    getPaymentMethods,
    crearPaymentMethod,
    actualizarPaymentMethod,
    borrarPaymentMethod,
    getPaymentMethod,
    listarPorUsuario,
    updateStatus
} = require('../controllers/tipopagoController');
const { validarJWT } = require('../middlewares/validar-jwt');
const { validarCampos } = require('../middlewares/validar-campos');

router.get('/', getPaymentMethods);
router.get('/:id', getPaymentMethod);

router.post('/store', [
    validarJWT,
    validarCampos
], crearPaymentMethod);

router.put('/update/:id', [
    validarJWT,
    validarCampos
], actualizarPaymentMethod);

router.delete('/remove/:id', borrarPaymentMethod);

router.get('/user/:id', listarPorUsuario);

router.put('/statusupdate/:id', updateStatus);
 

module.exports = router;