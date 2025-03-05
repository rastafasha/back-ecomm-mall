/*
Ruta: /api/uploads/
*/

const { Router } = require('express');
const expressfileUpload = require('express-fileupload');
const cloudinary = require('cloudinary').v2;

const { validarJWT } = require('../middlewares/validar-jwt');
const router = Router();


cloudinary.config({
    cloud_name: process.env.CLOUD_NAME,
    api_key: process.env.API_KEY_CLOUDINARY,
    api_secret: process.env.API_SECRET_CLOUDINARY
  });
const { fileUpload, retornaImagen} = require('../controllers/uploadsController');


router.use(expressfileUpload());

router.put('/:tipo/:id', validarJWT, fileUpload);
router.get('/:tipo/:foto', retornaImagen);

module.exports = router;