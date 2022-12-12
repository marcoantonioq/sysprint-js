import express from 'express';
import fileUpload from 'express-fileupload';
import '../prisma/db';
import { emitter } from './components/emitter';
import Job from './controllers/Job';
import lp from './services/lp';
import Printer from './controllers/Printer';

emitter.on('print', async (resp) => {
  await lp.updatePrinters();
  await lp.updateJobs();
  await lp.execJobs();
});

// eslint-disable-next-line no-console
// const CreateUserController = users.CreateUserController;

// const createUser = new CreateUserController();

const auth = function (req, res, next) {
  next(); // disable auth
  // return users.verify(req, res, next);
};

const app = express();
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(fileUpload());
// app.post('/login', users.login);
// app.get('/users/user', auth, users.logged);
// app.post('/users/add', auth, createUser.handle);
// app.get('/users/print', auth, users.prints);
// app.get('/users/users', auth, users.users);
// app.post('/logout', auth, users.logout);
app.get('/printers', auth, Printer.index);
app.post('/print', auth, async (req, res) => {
  const resp = await Job.add(req, res);
  emitter.emit('print', resp);
  res.json(resp);
});

app.get('/date', auth, (req, res) => {
  res.json({ date: new Date() });
});

// Error handler
app.use((err, _req, res) => {
  res.status(401).send(err + '');
});

// -- export app --
export default app;
