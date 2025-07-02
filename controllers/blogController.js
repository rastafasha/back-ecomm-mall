const { response } = require('express');
const Blog = require('../models/blog');
const Categoria = require('../models/categoria');
const fs = require('fs');


const getBlogs = async(req, res) => {

    const blogs = await Blog.find()
    .sort({ createdAt: -1 })
    .populate('titulo img categoria');

    res.json({
        ok: true,
        blogs
    });
};

const getBlog = async(req, res) => {

    const id = req.params.id;
    const uid = req.uid;

    Blog.findById(id).populate('titulo img categoria')
        .exec((err, blog) => {
            if (err) {
                return res.status(500).json({
                    ok: false,
                    mensaje: 'Error al buscar blog',
                    errors: err
                });
            }
            if (!blog) {
                return res.status(400).json({
                    ok: false,
                    mensaje: 'El blog con el id ' + id + 'no existe',
                    errors: { message: 'No existe un blog con ese ID' }
                });

            }
            res.status(200).json({
                ok: true,
                blog: blog
            });
        });

};
function find_by_slug(req, res) {
    var slug = req.params['slug'];

    Blog.findOne({ slug: slug }).exec((err, blog_data) => {
        if (err) {
            res.status(500).send({ message: 'Ocurrió un error en el servidor.' });
        } else {
            if (blog_data) {
                res.status(200).send({ blog: blog_data });
            } else {
                res.status(500).send({ message: 'No se encontró ningun dato en esta sección.' });
            }
        }
    });
}

const crearBlog = async(req, res) => {

    const uid = req.uid;

    // Convertir el título en slug
    const titulo = req.body.titulo || '';
    const slug = titulo.toLowerCase()
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
    const short_descripcion = req.body.descripcion || '';
    //extraemos short_descripcion desde description con un liminte de caracteres de 100
    const short_descripcion_limit = short_descripcion.substring(0, 100);

    const blog = new Blog({
        usuario: uid,
        ...req.body,
        slug: slug,
        short_descripcion: short_descripcion_limit
    });

    try {

        const blogDB = await blog.save();

        res.json({
            ok: true,
            blog: blogDB
        });

    } catch (error) {
        // console.log(error);
        res.status(500).json({
            ok: false,
            msg: 'Hable con el admin'
        });
    }


};

const actualizarBlog = async(req, res) => {

    const id = req.params.id;
    const uid = req.uid;

    try {

        const blog = await Blog.findById(id);
        if (!blog) {
            return res.status(500).json({
                ok: false,
                msg: 'blog no encontrado por el id'
            });
        }

        const cambiosBlog = {
            ...req.body,
            usuario: uid
        }

        // Si viene el título actualizado, actualizar el slug
        if (req.body.titulo) {
            const titulo = req.body.titulo;
            const slug = titulo.toLowerCase()
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
            cambiosBlog.slug = slug;
        }

        if(req.body.descripcion){
            const short_descripcion = req.body.descripcion || '';
            const short_descripcion_limit = short_descripcion.substring(0, 100);
            cambiosBlog.short_descripcion = short_descripcion_limit;
        }

        const blogActualizado = await Blog.findByIdAndUpdate(id, cambiosBlog, { new: true });

        res.json({
            ok: true,
            blogActualizado
        });

    } catch (error) {

        res.status(500).json({
            ok: false,
            msg: 'Error hable con el admin'
        });
    }


};

const borrarBlog = async(req, res) => {

    const id = req.params.id;

    try {

        const blog = await Blog.findById(id);
        if (!blog) {
            return res.status(500).json({
                ok: false,
                msg: 'blog no encontrado por el id'
            });
        }

        await Blog.findByIdAndDelete(id);

        res.json({
            ok: true,
            msg: 'blog eliminado'
        });

    } catch (error) {
        res.status(500).json({
            ok: false,
            msg: 'Error hable con el admin'
        });
    }
};


function desactivar(req, res) {
    var id = req.params['id'];

    Blog.findByIdAndUpdate({ _id: id }, { status: 'Desactivado' }, (err, blog_data) => {
        if (err) {
            res.status(500).send({ message: err });
        } else {
            if (blog_data) {
                res.status(200).send({ blog: blog_data });
            } else {
                res.status(403).send({ message: 'No se actualizó el blog, vuelva a intentar nuevamente.' });
            }
        }
    })
}

function activar(req, res) {
    var id = req.params['id'];
    // console.log(id);
    Blog.findByIdAndUpdate({ _id: id }, { status: 'Activo' }, (err, blog_data) => {
        if (err) {
            res.status(500).send({ message: err });
        } else {
            if (blog_data) {
                res.status(200).send({ blog: blog_data });
            } else {
                res.status(403).send({ message: 'No se actualizó el blog, vuelva a intentar nuevamente.' });
            }
        }
    })
}






module.exports = {
    getBlogs,
    crearBlog,
    getBlog,
    actualizarBlog,
    borrarBlog,
    desactivar,
    activar,
    find_by_slug


};