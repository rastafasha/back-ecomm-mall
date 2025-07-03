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
const fs = require('fs');
const pathModule = require('path');
var multipart = require('connect-multiparty');

const uploadDir = './uploads/galerias';

// In serverless environments like Vercel, local filesystem is ephemeral and not writable.
// Commenting out directory creation and multipart uploadDir to avoid runtime errors.

// if (!fs.existsSync(uploadDir)) {
//     fs.mkdirSync(uploadDir, { recursive: true });
// }

// var path = multipart({ uploadDir: uploadDir });

// Temporary middleware to reject uploads in serverless environment
const path = (req, res, next) => {
    return res.status(503).json({
        ok: false,
        msg: 'File uploads are not supported in the serverless environment. Please use cloud storage.'
    });
};

router.get('/', getGalerias);



router.post('/registro', path, registro);

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