import express from 'express';
import fileUpload from 'express-fileupload';
import Printer from './Printers';

const { createServer } = require('http');
const { Server } = require('socket.io');

const auth = function (req, res, next) {
  next(); // disable auth
  // return users.verify(req, res, next);
};

const app = express();
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(fileUpload());
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
    io.emit('msg', `Time: ${new Date().toLocaleTimeString()}`);
  } catch (error) {
    console.log('Erro ws::: ', error);
  }
  res.json({ msg: 'server is set' });
});

// app.post('/login', users.login);
// app.get('/users/user', auth, users.logged);
// app.post('/users/add', auth, createUser.handle);
// app.get('/users/print', auth, users.prints);
// app.get('/users/users', auth, users.users);
// app.post('/logout', auth, users.logout);
app.get('/printers', auth, Printer.index);
app.post('/printers/print', auth, Printer.print);
app.post('/printers/spools', auth, Printer.spools);
app.get('/printers/updateList', auth, Printer.updateListPrinters);
app.get('/date', auth, (req, res) => {
  res.json({ date: new Date() });
});

// Error handler
app.use((err, _req, res) => {
  res.status(401).send(err + '');
});

const port = '3010';
httpServer.listen(port, () => {
  console.log(`Example app listening on port ${port}`);
});
// -- export app --
export default app;
