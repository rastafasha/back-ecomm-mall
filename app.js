// Load environment variables FIRST
require('dotenv').config();

const express = require('express');
const { dbConnection } = require('./database/config');
const cors = require('cors');
const webpush = require('web-push');
const bodyParser = require('body-parser');

// Create Express app
const app = express();

// CORS configuration for serverless
app.use(cors());
app.use((req, res, next) => {
    res.header('Access-Control-Allow-Credentials', true); 
    res.header('Access-Control-Allow-Origin', '*');
    res.header('Access-Control-Allow-Headers', 'Authorization, X-API-KEY, Origin, X-Requested-With, Content-Type, Accept, Access-Control-Allow-Request-Method');
    res.header('Access-Control-Allow-Methods', 'GET,OPTIONS,PATCH,DELETE,POST,PUT');
    res.header('Allow', 'GET,OPTIONS,PATCH,DELETE,POST,PUT');
    next();
});

// Body parsers
app.use(express.json());
app.use(bodyParser.json());

// Database connection
dbConnection();

// API Routes
app.use('/api/usuarios', require('./routes/usuarios'));
app.use('/api/login', require('./routes/auth'));
app.use('/api/todo', require('./routes/busquedas'));
app.use('/api/uploads', require('./routes/uploads'));
app.use('/api/blogs', require('./routes/blog'));
app.use('/api/pages', require('./routes/page'));
app.use('/api/sliders', require('./routes/slider'));

// Tienda routes
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

// Root endpoint
app.get("/", (req, res) => {
    res.json({ 
        message: "Welcome to MallConnect API",
        status: "online",
        version: "1.0.0"
    });
});

// 404 handler
app.get('*', (req, res) => {
    res.status(404).json({ 
        error: "Route not found",
        path: req.path
    });
});

// VAPID keys for web-push notifications
const vapidKeys = {
    "publicKey": "BOD_CraUESbh9BhUEccgqin8vbZSKHAziTtpqvUFl8B8LO9zrMnfbectiViqWIsTLglTqEx3c0XsmqQQ5A-KALg",
    "privateKey": "34CA-EpxLdIf8fmJBj2zoDg5OIQIvveBcu7zWkTkPnw"
};

webpush.setVapidDetails(
    'mailto:example@youremail.com',
    vapidKeys.publicKey,
    vapidKeys.privateKey,
);

// Export the Express app (handler will be created in index.js)
module.exports = app;

// For local development
if (process.env.NODE_ENV !== 'production') {
    const port = process.env.PORT || 3000;
    app.listen(port, () => {
        console.log(`Servidor MallConnect en puerto: ${port}`);
        console.log(`API disponible en: http://localhost:${port}/api`);
    });
}

