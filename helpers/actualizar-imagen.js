const fs = require('fs');
const Usuario = require('../models/usuario');
const Marca = require('../models/marca');
const Congeneral = require('../models/congeneral');
const Producto = require('../models/producto');
const Promocion = require('../models/promocion');
const Galeria = require('../models/galeria');
const Ingreso = require('../models/ingreso');
const Blog = require('../models/blog');
const Page = require('../models/page');
const Slider = require('../models/slider');
const Curso = require('../models/curso');
const Categoria = require('../models/categoria');
const Tienda = require('../models/tienda');

const borrarImagen = (path) => {

    if (fs.existsSync(path)) {
        //borrar la imagen anterior
        fs.unlinkSync(path);
    }
}


const actualizarImagen = async(tipo, id, nombreArchivo) => {

    let pathViejo = '';

    switch (tipo) {

        case 'congenerals':
            const congeneral = await Congeneral.findById(id);
            if (!congeneral) {
                console.log('No es un congenerals por id');
                return false;
            }
            pathViejo = `./uploads/congenerals/${congeneral.img}`;

            borrarImagen(pathViejo);

            congeneral.img = nombreArchivo;
            await congeneral.save();
            return true;
            break;


        case 'productos':
            const producto = await Producto.findById(id);
            if (!producto) {
                console.log('No es un producto por id');
                return false;
            }
            pathViejo = `./uploads/productos/${producto.img}`;

            borrarImagen(pathViejo);

            producto.img = nombreArchivo;
            await producto.save();
            return true;
            break;

        case 'tiendas':
                const tienda = await Tienda.findById(id);
                if (!tienda) {
                    console.log('No es un tienda por id');
                    return false;
                }
                pathViejo = `./uploads/tiendas/${tienda.img}`;
    
                borrarImagen(pathViejo);
    
                slider.img = nombreArchivo;
                await slider.save();
                return true;
                break;

        case 'galerias':
            const galeria = await Galeria.findById(id);
            if (!galeria) {
                console.log('No es un galeria por id');
                return false;
            }
            pathViejo = `./uploads/galerias/${galeria.img}`;

            borrarImagen(pathViejo);

            galeria.img = nombreArchivo;
            await galeria.save();
            return true;
            break;

        case 'cursos':
            const curso = await Curso.findById(id);
            if (!curso) {
                console.log('No es un curso por id');
                return false;
            }
            pathViejo = `./uploads/cursos/${curso.img}`;

            borrarImagen(pathViejo);

            curso.img = nombreArchivo;
            await curso.save();
            return true;
            break;

        case 'marcas':
            const marca = await Marca.findById(id);
            if (!marca) {
                console.log('No es un marcas por id');
                return false;
            }
            pathViejo = `./uploads/marcas/${marca.img}`;

            borrarImagen(pathViejo);

            marca.img = nombreArchivo;
            await marca.save();
            return true;
            break;

        
        case 'usuarios':
            const usuario = await Usuario.findById(id);
            if (!usuario) {
                console.log('No es un usuario por id');
                return false;
            }
            pathViejo = `./uploads/usuarios/${usuario.img}`;

            borrarImagen(pathViejo);

            usuario.img = nombreArchivo;
            await usuario.save();
            return true;
            break;



        case 'ingresos':
            const ingreso = await Ingreso.findById(id);
            if (!ingreso) {
                console.log('No es un ingreso por id');
                return false;
            }
            pathViejo = `./uploads/ingresos/${ingreso.img}`;

            borrarImagen(pathViejo);

            ingreso.img = nombreArchivo;
            await ingreso.save();
            return true;
            break;

        case 'blogs':
            const blog = await Blog.findById(id);
            if (!blog) {
                console.log('No es un blog por id');
                return false;
            }
            pathViejo = `./uploads/blogs/${blog.img}`;

            borrarImagen(pathViejo);

            blog.img = nombreArchivo;
            await blog.save();
            return true;
            break;

        case 'pages':
            const page = await Page.findById(id);
            if (!page) {
                console.log('No es un page por id');
                return false;
            }
            pathViejo = `./uploads/pages/${page.img}`;

            borrarImagen(pathViejo);

            page.img = nombreArchivo;
            await page.save();
            return true;
            break;

        case 'promocions':
            const promocion = await Promocion.findById(id);
            if (!promocion) {
                console.log('No es un promocion por id');
                return false;
            }
            pathViejo = `./uploads/promocions/${promocion.img}`;

            borrarImagen(pathViejo);

            promocion.img = nombreArchivo;
            await promocion.save();
            return true;
            break;

        case 'sliders':
            const slider = await Slider.findById(id);
            if (!slider) {
                console.log('No es un slider por id');
                return false;
            }
            pathViejo = `./uploads/sliders/${slider.img}`;

            borrarImagen(pathViejo);

            slider.img = nombreArchivo;
            await slider.save();
            return true;
            break;
        
       


    }

};

module.exports = {
    actualizarImagen,
    borrarImagen
};