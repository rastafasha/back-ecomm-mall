/*
 Ruta: /api/galerias
 */

const { Router } = require('express');
const router = Router();
const {
    getGalerias,
    actualizarGaleria,
    borrarGaleria,
    getGaleria,
    findByProduct,
    registro
} = require('../controllers/galeriaController');
const { validarJWT } = require('../middlewares/validar-jwt');
const { check } = require('express-validator');
const { validarCampos } = require('../middlewares/validar-campos');
var multipart = require('connect-multiparty');
var path = multipart({ uploadDir: './uploads/galerias' });

router.get('/', getGalerias);



router.post('/galeria/registro', path, registro);

router.post('/', [
    validarJWT,
    check('imagen', 'El tipo del imagen es necesario').not().isEmpty(),
    validarCampos
], registro);

router.put('/:id', [
    validarJWT,
    check('imagen', 'El tipo del imagen es necesario').not().isEmpty(),
    validarCampos
], actualizarGaleria);

router.delete('/:id', validarJWT, borrarGaleria);

router.get('/:id', getGaleria);

router.get('/galeria_producto/find/:id?', findByProduct);



module.exports = router;