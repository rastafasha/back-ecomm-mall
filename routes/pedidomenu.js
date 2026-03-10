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
    getPedidosByStatus,
    activar,
    pedidosbyTiendaId,
    pedidosbyTiendaIdUser,
 } = require('../controllers/pedidoMenuController');
 const { validarJWT } = require('../middlewares/validar-jwt');
 const { validarCampos } = require('../middlewares/validar-campos');
 
 
 router.get('/', getPedidoMenus);
 router.get('/:id', getPedidoMenu);
 router.get('/user/:id', listarPedidoPorUser);
 router.get('/tienda/:tiendaid', getPedidoMenusTienda);
 router.get('/status/:status', getPedidosByStatus);
 router.get('/by_tiendaId/:id', pedidosbyTiendaId);
 router.get('/by_tiendaIduser/:id/:user',pedidosbyTiendaIdUser);
 
 router.post('/store', [
    //  validarJWT,
     validarCampos
 ], crearPedidoMenu);
 
 router.put('/update/:id', [
     validarCampos
 ], actualizarPedidoMenu);
 

 router.get('/activar/:id', validarJWT, activar);
 
 router.delete('/remove/:id', 
    
    borrarPedidoMenu);
 
 
 
 
 
 module.exports = router;