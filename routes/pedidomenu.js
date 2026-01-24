/*
 Ruta: /api/pedidomenu
 */

 const { Router } = require('express');
 const router = Router();
 const {
 
    crearPedidoMenu,
    actualizarPedidoMenu,
    getPedidoMenus,
    getPedidoMenusTienda,
    getPedidoMenu,
    borrarPedidoMenu,
    listarPedidoPorUser,
 } = require('../controllers/pedidoMenuController');
 const { validarJWT } = require('../middlewares/validar-jwt');
 const { validarCampos } = require('../middlewares/validar-campos');
 
 
 router.get('/', getPedidoMenus);
 router.get('/:id', getPedidoMenu);
 router.get('/user/:id', listarPedidoPorUser);
 router.get('/tienda/:tiendaid', getPedidoMenusTienda);
 
 router.post('/store', [
    //  validarJWT,
     validarCampos
 ], crearPedidoMenu);
 
 router.put('/update/:id', [
     validarJWT,
     validarCampos
 ], actualizarPedidoMenu);
 
 router.delete('/remove/:id', 
    
    borrarPedidoMenu);
 
 
 
 
 
 module.exports = router;