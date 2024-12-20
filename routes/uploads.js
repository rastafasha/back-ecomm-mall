/*
Ruta: /api/uploads/
*/

const { Router } = require('express');
const expressfileUpload = require('express-fileupload');

const { validarJWT } = require('../middlewares/validar-jwt');
const router = Router();
const { fileUpload, retornaImagen, obtenerImagenes } = require('../controllers/uploads');


router.use(expressfileUpload());

router.put('/:tipo/:id', validarJWT, fileUpload);
// router.get('/:tipo/:foto', retornaImagen);
router.get('/:tipo/:foto', obtenerImagenes);

module.exports = router;