const { response } = require('express');
const Marca = require('../models/marca');
const Usuario = require('../models/usuario');
const Blog = require('../models/blog');
const Page = require('../models/page');
const Slider = require('../models/slider');
const Producto = require('../models/producto');
const Curso = require('../models/curso');
const Transferencia = require('../models/transferencia');

const getTodo = async(req, res = response) => {

    const busqueda = req.params.busqueda;
    const regex = new RegExp(busqueda, 'i');

    /*const usuarios = await Usuario.find({ nombre: regex });
    const medicos = await Medico.find({ nombre: regex });
    const hospitales = await Hospital.find({ nombre: regex });*/

    const [usuarios, marcas, blogs, pages, productos, sliders, cursos, transferencias] = await Promise.all([
        Usuario.find({ nombre: regex }),
        Marca.find({ nombre: regex }),
        Blog.find({ nombre: regex }),
        Page.find({ nombre: regex }),
        Producto.find({ titulo: regex }),
        Slider.find({ nombre: regex }),
        Curso.find({ nombre: regex }),
        Transferencia.find({ nombre: regex }),
    ]);

    res.json({
        ok: true,
        usuarios,
        marcas,
        blogs,
        pages,
        productos,
        sliders,
        cursos,
        transferencias

    });
}

const getDocumentosColeccion = async(req, res = response) => {

    const tabla = req.params.tabla;
    const busqueda = req.params.busqueda;
    const regex = new RegExp(busqueda, 'i');

    let data = [];

    switch (tabla) {
        case 'marcas':
            data = await Marca.find({ nombre: regex })
                .populate('nombre img descripcion');
            break;


        case 'usuarios':
            data = await Usuario.find({ nombre: regex });
            break;

        case 'blogs':
            data = await Blog.find({ titulo: regex });
            break;

        case 'pages':
            data = await Page.find({ nombre: regex });
            break;

        case 'sliders':
            data = await Slider.find({ nombre: regex });
            break;

        case 'productos':
            data = await Producto.find({ titulo: regex });
            break;

        case 'cursos':
            data = await Curso.find({ nombre: regex });
            break;
        case 'trasnferencias':
            data = await Transferencia.find({ referencia: regex, monto: regex, fecha: regex });
            break;



        default:
            return res.status(400).json({
                ok: false,
                msg: 'la tabla debe ser usuarios'
            });
    }

    res.json({
        ok: true,
        resultados: data
    });
}

module.exports = {
    getTodo,
    getDocumentosColeccion
}