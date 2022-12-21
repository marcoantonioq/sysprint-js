import express from 'express';

const { createServer } = require('http');
const { Server } = require('socket.io');

const app = express();
app.use(express.json());

const portWS = '3010';
const httpServer = createServer(app);

const io = new Server(httpServer, {
  cors: {
    origin: '*',
    methods: ['GET', 'POST'],
  },
});
io.on('connection', (socket) => {
  socket.emit('msg', 'Client conectado!');
});

io.sockets.on('connection', function (socket) {
  console.log('Cliente: ', socket.id);
});
app.all('/init', (req, res) => {
  try {
    io.emit('msg', `Servidor iniciado: ${new Date().toLocaleTimeString()}`);
  } catch (error) {
    console.log('Erro ws::: ', error);
  }
  res.json({ msg: 'Servidor ligado!' });
});

httpServer
  .listen(portWS, () => {
    console.log(`Servidor socketIO iniciado na porta ${portWS}`);
  })
  .on('error', (_) => {});

export default {
  app,
  io,
};
