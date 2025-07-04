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

if (!fs.existsSync(uploadDir)) {
    fs.mkdirSync(uploadDir, { recursive: true });
}

var path = multipart({ uploadDir: uploadDir });

const multer = require('multer');

// Configure multer storage in memory for direct upload to Cloudinary
const storage = multer.memoryStorage();
const upload = multer({ storage: storage });

router.get('/', getGalerias);



router.post('/registro', upload.array('imagenes'), registro);

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