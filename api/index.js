import express from 'express';
import fileUpload from 'express-fileupload';
import * as form from '../src/lib/formdata';
import * as printers from '../src/controllers/printers.controller';
// eslint-disable-next-line import/namespace
import * as users from '../src/controllers/users.controller';

import '../prisma/db';

// eslint-disable-next-line no-console
const CreateUserController = users.CreateUserController;

const createUser = new CreateUserController();

const app = express();
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(fileUpload());
app.post('/login', users.login);
app.get('/users/user', users.verify, users.logged);
app.post('/users/add', users.verify, createUser.handle);
app.get('/users/print', users.verify, users.prints);
app.get('/users/users', users.verify, users.users);
app.post('/logout', users.verify, users.logout);
app.get('/printers', users.verify, printers.getPrinters);
app.post('/print', printers.print);
app.get('/jobs/:print/:id', printers.job);
app.post('/upload', users.verify, form.upLoadFiles);

app.get('/date', users.verify, (req, res) => {
  res.json({ date: new Date() });
});

// Error handler
app.use((err, _req, res) => {
  res.status(401).send(err + '');
});

// -- export app --
export default app;
