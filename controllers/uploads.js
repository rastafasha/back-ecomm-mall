const path = require('path');
const fs = require('fs');
const { response } = require('express');
const { v4: uuidv4 } = require('uuid');
const { actualizarImagen } = require('../helpers/actualizar-imagen');
const multer = require('multer');
const upload = multer({ storage: multer.memoryStorage() });

const fileUpload = (req, res = response) => {

    const tipo = req.params.tipo;
    const id = req.params.id;

    const tiposValidos = [
        'productos', 'marcas', 'categorias', 'galerias', 'promocions',
        'congenerals', 'usuarios', 'ingresos', 'blogs', 'pages', 'cursos', 'sliders'
    ];
    if (!tiposValidos.includes(tipo)) {
        return res.status(400).json({
            ok: false,
            msg: 'No es un tipo permitido (tipo)'
        });
    }
    // validar que exista un archivo
    if (!req.files || Object.keys(req.files).length === 0) {
        return res.status(400).json({
            ok: false,
            msn: 'No hay ningun archivo'
        });
    }

    // procesar la imagen
    const file = req.files.imagen;

    const nombreCortado = file.name.split('.');
    const extensionArchivo = nombreCortado[nombreCortado.length - 1];

    //validar extension
    const extensionesValidas = ['png', 'jpg', 'jpeg', 'gif'];
    if (!extensionesValidas.includes(extensionArchivo)) {
        return res.status(400).json({
            ok: false,
            msn: 'No es una extension permitida'
        });
    }

    //generar el nombre del archivo
    const nombreArchivo = `${uuidv4()}.${extensionArchivo}`;

    //path para guardar la imagen
    const path = `./uploads/${tipo}/${nombreArchivo}`;

    //mover la imagen
    file.mv(path, (err) => {
        if (err) {
            // console.log(err)
            return res.status(500).json({
                ok: false,
                msg: 'Error al mover la imagen'
            });
        }

        //actualizar bd
        actualizarImagen(tipo, id, nombreArchivo);

        res.json({
            ok: true,
            msg: 'Archivo subido',
            nombreArchivo
        });

    });

};

const retornaImagen = (req, res) => {
    const tipo = req.params.tipo;
    const foto = req.params.foto;

    const pathImg = path.join(__dirname, `../uploads/${tipo}/${foto}`);

    //imagen por defecto
    if (fs.existsSync(pathImg)) {
        res.sendFile(pathImg);

    } else {
        const pathImg = path.join(__dirname, `../uploads/${tipo}/no-image.jpg`);
        res.sendFile(pathImg);
    }


};

//optenemos las imagenes desde github
const obtenerImagenes = async () => {
    const url = 'https://github.com/rastafasha/back-ecomm-mall/tree/main/uploads/';
    const respuesta = await axios.get(url);
    const imagenes = respuesta.data;
    return imagenes;
    };

    //obtenemos las imagenes
    const imagenes = await obtenerImagenes();
    console.log(imagenes);
    //guardamos las imagenes en la base de datos
    imagenes.forEach(async (imagen) => {
        const url = imagen.url;
        const nombreArchivo = imagen.nombre;
        const tipo = imagen.tipo;
        const path = `./uploads/${tipo}/${nombreArchivo}`;
        const pathViejo = `./uploads/${tipo}/${nombreArchivo}`;
        const pathNuevo = `./uploads/${tipo}/${nombreArchivo}`;
        const fs = require('fs');
        const path = require('path');
        const borrarImagen = require('./helpers/borrarImagen');
        const subirImagen = require('./helpers/subirImagen');
        const Slider = require('./models/slider');
        const Tienda = require('./models/tienda');
        const Producto = require('./models/producto');
        const Categoria = require('./models/categoria');
        const Carrito = require('./models/carrito');
        const Usuario = require('./models/usuario');
        const slider = new Slider();
        
        const tienda = new Tienda();
        const producto = new Producto();
        const categoria = new Categoria();
        const carrito = new Carrito();
        const usuario = new Usuario();
        const existeImagen = await existeImagenEnDB(nombreArchivo, tipo);
        if (existeImagen) {
            const pathViejo = `./uploads/${tipo}/${nombreArchivo}`;
            const pathNuevo = `./uploads/${tipo}/${nombreArchivo}`;
            const borrarImagen = require('./helpers/borrarImagen');
            await borrarImagen(pathViejo);
            await subirImagen(pathNuevo);
            } else {
                const path = `./uploads/${tipo}/${nombreArchivo}`;
                const subirImagen = require('./helpers/subirImagen');
                await subirImagen(path);
                }
                }
            );



function imageByfotoName(req, res) {

    const nombre = req.params.nombre;

    Producto.find({ categoria: nombre })
    .exec((err, uploads) => {
        if (err) {
            res.status(500).send({ message: 'Ocurrió un error en el servidor.' });
        } else {
            if (uploads) {
                res.status(200).send({ uploads: uploads });
            } else {
                res.status(500).send({ message: 'No se encontró ningun dato en esta sección.' });
            }
        }
    });

}


module.exports = {
    fileUpload,
    retornaImagen,
    obtenerImagenes
}