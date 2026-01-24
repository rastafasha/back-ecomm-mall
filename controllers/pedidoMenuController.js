const { response } = require('express');
const Tienda = require('../models/tienda');
const Usuario = require('../models/usuario');
const Pedido = require('../models/pedidomenu');



const crearPedidoMenu = async(req, res) => {
    const { user, pedido, tienda } = req.body;

    const body = req.body;
    try {

        const existeUsuario = await Usuario.findById(body.user);
       
        const existeTienda = await Tienda.findById(body.tienda);

        if (!existeUsuario) {
            return res.status(400).json({
                ok: false,
                 msg: 'El usuario no existe'
            })
        }
        if (!existeTienda) {
            return res.status(400).json({
                ok: false,
                msg: 'La tienda no existe'
            });
        }

        
        const pedido = new Pedido({
            user: body.user,
            pedido: body.pedido,
            tienda: body.tienda
        });

        //guardar pedido
        await pedido.save();

        res.json({
            ok: true,
            pedido
        });

    } catch (error) {
        console.log(error);
        res.status(500).json({
            ok: false,
            msg: 'Error inesperado... revisar logs'
        });
    }


};
        

const actualizarPedidoMenu = async(req, res) => {

    const id = req.params.id;
    const uid = req.uid;

    try {

        const pedido = await Pedido.findById(id);
        if (!pedido) {
            return res.status(500).json({
                ok: false,
                msg: 'pedido no encontrado por el id'
            });
        }
        const usuario = await Usuario.findById(id);
        if (!usuario) {
            return res.status(500).json({
                ok: false,
                msg: 'usuario no encontrado por el id'
            });
        }

        const cambiosPedido = {
            ...req.body,
            usuario: uid
        }

        const pedidoActualizado = await Pedido.findByIdAndUpdate(id, cambiosPedido, { new: true });

        res.json({
            ok: true,
            pedidoActualizado
        });

    } catch (error) {
        console.log(error);
        res.status(500).json({
            ok: false,
            msg: 'Error hable con el admin'
        });
    }


};

const getPedidoMenus = async(req, res) => {

    const pedidos = await Pedido.find()
        .populate('user', 'nombre email')
        .populate('tienda', 'nombre direccion');
    res.json({
        ok: true,
        pedidos
    });
};
const getPedidoMenusTienda = async(req, res) => {

    const pedidos = await Pedido.find().populate('tienda')
    .populate('driver');

      
    const tiendaid = req.params.tiendaid;
    const tienda = await Tienda.findById(tiendaid);

    const pedidosTienda = pedidos.filter(pedido => pedido.tienda.toString() === tiendaid)
    ;  


    res.json({
        ok: true,
        // pedidosTienda,
        pedidos,
    });
};

const getPedidoMenu = async(req, res) => {

    const id = req.params.id;

    Pedido.findById(id)
        .populate('user', 'nombre email')
        .populate('tienda', 'nombre direccion')
        .exec((err, pedido) => {
            if (err) {
                return res.status(500).json({
                    ok: false,
                    mensaje: 'Error al buscar pedido',
                    errors: err
                });
            }
            if (!pedido) {
                return res.status(400).json({
                    ok: false,
                    mensaje: 'El pedido con el id ' + id + 'no existe',
                    errors: { message: 'No existe un pedido con ese ID' }
                });

            }
            res.status(200).json({
                ok: true,
                pedido: pedido
            });
        });

};


const borrarPedidoMenu = async(req, res) => {

    const id = req.params.id;

    try {

        const pedido = await Pedido.findById(id);
        if (!pedido) {
            return res.status(500).json({
                ok: false,
                msg: 'pedido no encontrado por el id'
            });
        }

        await Pedido.findByIdAndDelete(id);

        res.json({
            ok: true,
            msg: 'pedido eliminado'
        });

    } catch (error) {
        console.log(error)
        res.status(500).json({
            ok: false,
            msg: 'Error hable con el admin'
        });
    }
};

const listarPedidoPorUser = (req, res) => {
    var id = req.params['id'];
    Pedido.find({ user: id }, (err, data_pedido) => {
        if (!err) {
            if (data_pedido) {
                res.status(200).send({ pedidos: data_pedido });
            } else {
                res.status(500).send({ error: err });
            }
        } else {
            res.status(500).send({ error: err });
        }
    })
    .sort({createdAt: - 1});
}



module.exports = {
    crearPedidoMenu,
    actualizarPedidoMenu,
    getPedidoMenus,
    getPedidoMenusTienda,
    getPedidoMenu,
    borrarPedidoMenu,
    listarPedidoPorUser,

};