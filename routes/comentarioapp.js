/*
 Ruta: /api/comentarioapp
 */

const { Router } = require('express');
const router = Router();
const {
    getComentarios,
    crearComentario,
    actualizarComentario,
    borrarComentario,
    getComentario,
    listarLast,
    listarLikes,
    addDislike,
    addLike,
    getData,
    listarDislikes
} = require('../controllers/comentarioappController');
const { validarJWT } = require('../middlewares/validar-jwt');
const { check } = require('express-validator');
const { validarCampos } = require('../middlewares/validar-campos');

router.get('/', getComentarios);

router.post('/store', [
    // validarJWT,
    validarCampos
], crearComentario);

router.put('/update/:id', [
    validarJWT,
    validarCampos
], actualizarComentario);

router.delete('/remove/:id', validarJWT, borrarComentario);

router.get('/:id', validarJWT, getComentario);

router.get('/client/obtener/:id/:orden', getData);

router.post('/likes/add', addLike);
router.get('/likes/get/:id', listarLikes);

router.post('/dislikes/add', addDislike);
router.get('/dislikes/get/:id', listarDislikes);


module.exports = router;