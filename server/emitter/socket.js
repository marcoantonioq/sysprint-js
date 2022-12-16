const { createServer } = require('http');
const express = require('express');
const { Server } = require('socket.io');
// const { initializeRoutes } = require('./routes');

const app = express();
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

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
  console.log('We are live and connected');
  console.log(socket.id);
});

app.all('/init', (req, res) => {
  try {
    io.emit('msg', `Time: ${new Date().toLocaleTimeString()}`);
  } catch (error) {
    console.log('Erro ws::: ', error);
  }
  res.json({ msg: 'Msg enviada: ' });
});

// app = initializeRoutes(app);
app.get('/', (req, res) => {
  res.status(200).send({
    success: true,
    message: 'welcome to the beginning of greatness',
  });
});

const port = 3010;
httpServer.listen(port, () => {
  console.log(`Example app listening on port ${port}`);
});
