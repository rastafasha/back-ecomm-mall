const express = require('express');
const http = require('http');
const socketIO = require('socket.io');

const app = express();
const server = http.createServer(app);
const io = socketIO(server);

var authenticate = false;

io.on('connection', function(socket) {
    const idHandShake = socket.id; //genera un id unico por conexion
    let { nameRoom } = socket.handshake.query;

    console.log(`Hola dispositivo: ${idHandShake} se union a ${nameRoom}`);
    socket.join(nameRoom);

    socket.on('evento', (res) => {
        socket.to(nameRoom).emit('evento', res);
    });

    socket.on('message', (msg) => {
        console.log('a user connected');
        console.log('message : ' + msg);
        socket.broadcast.emit('message', msg);
    });

    socket.on('save-carrito', function(data) {
        io.emit('new-carrito', data);
        console.log(data);
    });
    socket.on('save-carrito_dos', function(data) {
        io.emit('new-carrito_dos', data);
        console.log(data);
    });
    socket.on('save-mensaje', function(data) {
        io.emit('new-mensaje', data);
    });
    socket.on('save-formmsm', function(data) {
        io.emit('new-formmsm', data);
    });
    socket.on('save-stock', function(data) {
        io.emit('new-stock', data);
    });

    socket.on('disconnect', function() {
        console.log('user disconnected');
    });
});

module.exports = {
    io
}
