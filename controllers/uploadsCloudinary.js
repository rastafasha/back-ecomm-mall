const path = require('path');
const fs = require('fs');
const { response } = require('express');
const { v4: uuidv4 } = require('uuid');
const { actualizarImagen } = require('../helpers/cloudinary-images');
const multer = require('multer');
const cloudinary = require('cloudinary').v2;
const upload = multer({ storage: multer.memoryStorage(), dest: './uploads/' });

// Handle image upload
const fileUpload = async (req, res = response) => {
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
    if (!req.file) {
        return res.status(400).json({
            ok: false,
            msn: 'No hay ningun archivo'
        });
    }

    // procesar la imagen
    const file = req.file;

    const nombreCortado = file.originalname.split('.');
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

    // subir a Cloudinary
    const result = await cloudinary.uploader.upload_stream({ resource_type: 'auto' }, (error, result) => {
        if (error) {
            return res.status(500).json({
                ok: false,
                msg: 'Error al subir la imagen a Cloudinary'
            });
        }

        //actualizar bd
        actualizarImagen(tipo, id, nombreArchivo);

        res.json({
            ok: true,
            msg: 'Archivo subido',
            nombreArchivo
        });
    }).end(file.buffer);
    console.log(result);
};

const retornaImagen = (req, res) => {
    const tipo = req.params.tipo;
    const foto = req.params.foto;
    const cloudName = process.env.NAME_CLOUDINARY;
    const uploadUrl = `https://api.cloudinary.com/v1_1/${this.cloudName}/upload`;

    const pathImg = path.join(__dirname, `../uploads/${tipo}/${foto}`);

    //imagen por defecto
    if (fs.existsSync(pathImg)) {
        res.sendFile(pathImg);
    } else {
        const pathImg = path.join(__dirname, `../uploads/${tipo}/no-image.jpg`);
        res.sendFile(pathImg);
    }
};

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
    retornaImagen
}
