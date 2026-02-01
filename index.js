// Load environment variables FIRST - before any other requires
require('dotenv').config();
const express = require('express');
const { dbConnection } = require('./database/config');
const cors = require('cors');
const path = require('path');
const socketIO = require('socket.io');

//notifications
const webpush = require('web-push');
const bodyParser = require('body-parser');

//crear server de express
const app = express();
const server = require('http').Server(app);

// Initialize socket.io with the server
const io = socketIO(server);

// Export io for use in other modules
module.exports.io = io;

//cors
app.use(cors());
app.use((req, res, next) => {
    res.header('Access-Control-Allow-Credentials', true); 
    res.header('Access-Control-Allow-Origin', '*'); // Temporarily allow all origins for testing
    res.header('Access-Control-Allow-Headers', 'Authorization, X-API-KEY, Origin, X-Requested-With, Content-Type, Accept, Access-Control-Allow-Request-Method');
    res.header('Access-Control-Allow-Methods', 'GET,OPTIONS,PATCH,DELETE,POST,PUT');
    res.header('Allow', 'GET,OPTIONS,PATCH,DELETE,POST,PUT');
    next();
});

const options = {
    cors: {
        origin: '*', // Temporarily allow all origins for testing
    },
};

//lectura y parseo del body
app.use(express.json());

// Wrap everything in async function to properly await dbConnection
const startServer = async () => {
    //db
    await dbConnection();

    //directiorio publico de pruebas de google
    app.use(express.static('public'));

    //rutas
    app.use('/api/usuarios', require('./routes/usuarios'));
    app.use('/api/login', require('./routes/auth'));
    app.use('/api/todo', require('./routes/busquedas'));
    app.use('/api/uploads', require('./routes/uploads'));
    app.use('/api/blogs', require('./routes/blog'));
    app.use('/api/pages', require('./routes/page'));
    app.use('/api/sliders', require('./routes/slider'));

    //tienda
    app.use('/api/marcas', require('./routes/marcas'));
    app.use('/api/categorias', require('./routes/categoria'));
    app.use('/api/cursos', require('./routes/curso'));
    app.use('/api/productos', require('./routes/producto'));
    app.use('/api/colors', require('./routes/color'));
    app.use('/api/selectors', require('./routes/selector'));
    app.use('/api/carritos', require('./routes/carrito'));
    app.use('/api/comentarios', require('./routes/comentario'));
    app.use('/api/congenerals', require('./routes/congeneral'));
    app.use('/api/contactos', require('./routes/contacto'));
    app.use('/api/cupons', require('./routes/cupon'));
    app.use('/api/direccions', require('./routes/direccion'));
    app.use('/api/galerias', require('./routes/galeria'));
    app.use('/api/galeriavideos', require('./routes/galeriavideo'));
    app.use('/api/ingresos', require('./routes/ingreso'));
    app.use('/api/postals', require('./routes/postal'));
    app.use('/api/tickets', require('./routes/ticket'));
    app.use('/api/ventas', require('./routes/venta'));
    app.use('/api/promocions', require('./routes/promocion'));
    app.use('/api/shippings', require('./routes/shipping'));
    app.use('/api/pickups', require('./routes/pickup'));
    app.use('/api/notifications', require('./routes/notifications'));
    app.use('/api/videocursos', require('./routes/videocurso'));
    app.use('/api/favoritos', require('./routes/favorito'));
    app.use('/api/tipopago', require('./routes/tipopago'));
    app.use('/api/tiendas', require('./routes/tienda'));
    app.use('/api/transferencias', require('./routes/transferencia'));
    app.use('/api/pagoefectivo', require('./routes/pago.efectivo'));
    app.use('/api/pagocheque', require('./routes/pagocheque'));
    app.use('/api/paises', require('./routes/pais'));
    app.use('/api/asignardelivery', require('./routes/asignardelivery'));
    app.use('/api/driver', require('./routes/driver'));
    app.use('/api/pedidomenu', require('./routes/pedidomenu'));

    //notification
    const vapidKeys = {
        "publicKey": "BOD_CraUESbh9BhUEccgqin8vbZSKHAziTtpqvUFl8B8LO9zrMnfbectiViqWIsTLglTqEx3c0XsmqQQ5A-KALg",
        "privateKey": "34CA-EpxLdIf8fmJBj2zoDg5OIQIvveBcu7zWkTkPnw"
    };

    webpush.setVapidDetails(
        'mailto:example@youremail.com',
        vapidKeys.publicKey,
        vapidKeys.privateKey,
    );

    app.use(bodyParser.json());

    //test
    app.get("/", (req, res) => {
      res.json({ message: "Welcome to nodejs." });
    });

    //lo ultimo
    app.get('*', (req, res) => {
        res.sendFile(path.resolve(__dirname, 'public')); //ruta para produccion, evita perder la ruta
    });

    // Global error handling middleware
    app.use((err, req, res, next) => {
        console.error('Global error handler caught an error:', err);
        res.status(500).json({
            ok: false,
            msg: 'Internal Server Error',
            error: err.message || err.toString()
        });
    });

    // Solo iniciar servidor local si no estamos en Vercel
    if (process.env.VERCEL !== '1') {
        server.listen(process.env.PORT, () => {
            console.log('Servidor en puerto: ' + process.env.PORT);
        });
    }
};

// Start the server
startServer().catch(err => {
    console.error('Error starting server:', err);
    process.exit(1);
});

// Exportar app para Vercel (serverless)
module.exports = app;

