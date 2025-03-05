/*
Ruta: /api/uploads/
*/

const { Router } = require('express');
const expressfileUpload = require('express-fileupload');

const { validarJWT } = require('../middlewares/validar-jwt');
const router = Router();
const cloudinary = require('cloudinary').v2;
cloudinary.config({
    cloud_name: process.env.CLOUD_NAME,
    api_key: process.env.API_KEY_CLOUDINARY,
    api_secret: process.env.API_SECRET_CLOUDINARY
  });
const { fileUpload, retornaImagen, obtenerImagenes } = require('../controllers/uploadsController');


router.use(expressfileUpload());

router.put('/:tipo/:id', validarJWT, fileUpload);
router.get('/:tipo/:foto', retornaImagen);
// router.get('/:tipo/:foto', obtenerImagenes);

module.exports = router;