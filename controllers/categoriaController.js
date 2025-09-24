const { response } = require('express');
const Categoria = require('../models/categoria');
const Producto = require('../models/producto');

const getCategorias = async(req, res) => {

    const categorias = await Categoria.find()
    .sort({ createdAt: -1 })
    .populate('nombre img subcategorias');

    res.json({
        ok: true,
        categorias
    });
};

const getCategoria = async(req, res) => {

    const id = req.params.id;
    const uid = req.uid;

    Categoria.findById(id)
        .exec((err, categoria) => {
            if (err) {
                return res.status(500).json({
                    ok: false,
                    mensaje: 'Error al buscar categoria',
                    errors: err
                });
            }
            if (!categoria) {
                return res.status(400).json({
                    ok: false,
                    mensaje: 'El categoria con el id ' + id + 'no existe',
                    errors: { message: 'No existe un categoria con ese ID' }
                });

            }
            res.status(200).json({
                ok: true,
                categoria: categoria,
                productos: Producto,
            });
        });


    // res.json({
    //     ok: true,
    //     categoria
    //     //uid: req.uid
    // });
};

// function find_by_slug(req, res) {
//     var slug = req.params['slug'];

//     Blog.findOne({ slug: slug })
//     .populate('usuario')
//     .populate('categoria')
//     .populate('binancepay')
//     .populate('pago')
//     .exec((err, blog_data) => {
//         if (err) {
//             res.status(500).send({ message: 'Ocurrió un error en el servidor.' });
//         } else {
//             if (blog_data) {
//                 res.status(200).send({ blog: blog_data });
//             } else {
//                 res.status(500).send({ message: 'No se encontró ningun dato en esta sección.' });
//             }
//         }
//     });
// }

const crearCategoria = async(req, res) => {

    const uid = req.uid;
     // Convertir el nombre en slug
        const nombre = req.body.nombre || '';
        const slug = nombre.toLowerCase()
            .trim()
            .replace(/[\s]+/g, '-') // reemplaza espacios por guiones
            .replace(/[^\w\-]+/g, '') // elimina caracteres no alfanuméricos excepto guiones
            .replace(/\-\-+/g, '-') // reemplaza guiones múltiples por uno solo
            // reemplaza acentos y caracteres especiales
                .replace(/á/g, 'a')
                .replace(/é/g, 'e')
                .replace(/í/g, 'i')
                .replace(/ó/g, 'o')
                .replace(/ú/g, 'u')
                .replace(/ñ/g, 'n')
                .replace(/ü/g, 'u');

    const categoria = new Categoria({
        usuario: uid,
        ...req.body,
        slug: slug
    });

    try {

        const categoriaDB = await categoria.save();

        res.json({
            ok: true,
            categoria: categoriaDB
        });

    } catch (error) {
        // console.log(error);
        res.status(500).json({
            ok: false,
            msg: 'Hable con el admin'
        });
    }


};

const actualizarCategoria = async(req, res) => {

    const id = req.params.id;
    const uid = req.uid;


    try {

        const categoria = await Categoria.findById(id);
        if (!categoria) {
            return res.status(500).json({
                ok: false,
                msg: 'Categoria no encontrado por el id'
            });
        }

        const cambiosCategoria = {
            ...req.body,
            usuario: uid
        }

        // Si viene el nombre actualizado, actualizar el slug
        if (req.body.nombre) {
            const nombre = req.body.nombre;
            const slug = nombre.toLowerCase()
                .trim()
                .replace(/[\s]+/g, '-') // reemplaza espacios por guiones
                .replace(/[^\w\-]+/g, '') // elimina caracteres no alfanuméricos excepto guiones
                .replace(/\-\-+/g, '-') // reemplaza guiones múltiples por uno solo
                // reemplaza acentos y caracteres especiales
                .replace(/á/g, 'a')
                .replace(/é/g, 'e')
                .replace(/í/g, 'i')
                .replace(/ó/g, 'o')
                .replace(/ú/g, 'u')
                .replace(/ñ/g, 'n')
                .replace(/ü/g, 'u');
            cambiosCategoria.slug = slug;
        }

        const categoriaActualizado = await Categoria.findByIdAndUpdate(id, cambiosCategoria, { new: true });

        res.json({
            ok: true,
            categoriaActualizado
        });

    } catch (error) {
        res.status(500).json({
            ok: false,
            msg: 'Error hable con el admin'
        });
    }


};

const borrarCategoria = async(req, res) => {

    const id = req.params.id;

    try {

        const categoria = await Categoria.findById(id);
        if (!categoria) {
            return res.status(500).json({
                ok: false,
                msg: 'categoria no encontrado por el id'
            });
        }

        await Categoria.findByIdAndDelete(id);

        res.json({
            ok: true,
            msg: 'Categoria eliminado'
        });

    } catch (error) {
        res.status(500).json({
            ok: false,
            msg: 'Error hable con el admin'
        });
    }
};


function get_car_slide(req, res) {
    Categoria.find({ state_banner: true }).limit(3).exec((err, categoria_data) => {
        if (err) {
            res.status(500).send({ message: 'Ocurrió un error en el servidor.' });
        } else {
            if (categoria_data) {
                res.status(200).send({ categorias: categoria_data });
            } else {
                res.status(500).send({ message: 'No se encontró ningun dato en esta sección.' });
            }
        }
    });
}


function list_one(req, res) {
    var id = req.params['id'];

    Categoria.findOne({ _id: id }, (err, categoria_data) => {
        if (err) {
            res.status(500).send({ message: 'Ocurrió un error en el servidor.' });
        } else {
            if (categoria_data) {
                res.status(200).send({ categoria: categoria_data });
            } else {
                res.status(500).send({ message: 'No se encontró ninguna categoria con este ID.' });
            }
        }
    })

}


function find_by_name(req, res) {
    var nombre = req.params['nombre'];

    Categoria.findOne({ nombre: nombre }, (err, categoria_data) => {
        if (err) {
            return res.status(500).send({ message: 'Ocurrió un error en el servidor.' });
        }
        if (!categoria_data) {
            return res.status(404).send({ message: 'Categoría no encontrada.' });
        }

        Producto.find({ categoria: categoria_data._id, status: ['Activo'] })
            .populate('categoria')
            .exec((err, productos) => {
                if (err) {
                    return res.status(500).send({ message: 'Error al buscar productos.' });
                }
                res.json({
                    ok: true,
                    categoria: categoria_data,
                    productos: productos
                });
            });
    });
}
function find_by_subcategory(req, res) {
    const id = req.params.id;

    Categoria.findById(id)
        .exec((err, categoria) => {
            if (err) {
                return res.status(500).json({
                    ok: false,
                    mensaje: 'Error al buscar categoria',
                    errors: err
                });
            }
            if (!categoria) {
                return res.status(400).json({
                    ok: false,
                    mensaje: 'El categoria con el id ' + id + 'no existe',
                    errors: { message: 'No existe un categoria con ese ID' }
                });

            }
            Producto.find({ 
                $or: [
                    { categoria: categoria._id },
                    { subcategoria: id }
                ],
                status: ['Activo'] 
            })
            .populate('categoria')
            .exec((err, productos) => {
                if (err) {
                    return res.status(500).send({ message: 'Error al buscar productos.' });
                }
                res.json({
                    ok: true,
                    categoria: categoria,
                    productos: productos
                });
            });
    });

    
}


const getCategoriasActivos = async(req, res) => {

    Categoria.find({  status: ['Activo'] }).exec((err, categoria_data) => {
        if (err) {
            res.status(500).send({ message: 'Ocurrió un error en el servidor.' });
        } else {
            if (categoria_data) {
                res.status(200).send({ categorias: categoria_data });
            } else {
                res.status(500).send({ message: 'No se encontró ningun dato en esta sección.' });
            }
        }
    });

};



function desactivar(req, res) {
    var id = req.params['id'];

    Categoria.findByIdAndUpdate({ _id: id }, { status: 'Desactivado' }, (err, categoria_data) => {
        if (err) {
            res.status(500).send({ message: err });
        } else {
            if (categoria_data) {
                res.status(200).send({ categoria: categoria_data });
            } else {
                res.status(403).send({ message: 'No se actualizó el categoria, vuelva a intentar nuevamente.' });
            }
        }
    })
}

function activar(req, res) {
    var id = req.params['id'];
    // console.log(id);
    Categoria.findByIdAndUpdate({ _id: id }, { status: 'Activo' }, (err, categoria_data) => {
        if (err) {
            res.status(500).send({ message: err });
        } else {
            if (categoria_data) {
                res.status(200).send({ categoria: categoria_data });
            } else {
                res.status(403).send({ message: 'No se actualizó el categoria, vuelva a intentar nuevamente.' });
            }
        }
    })
}

module.exports = {
    getCategorias,
    crearCategoria,
    actualizarCategoria,
    borrarCategoria,
    getCategoria,
    get_car_slide,
    list_one,
    find_by_name,
    find_by_subcategory,
    getCategoriasActivos,
    desactivar,
    activar
};