import express from 'express';
import fileUpload from 'express-fileupload';
import { upLoadFiles } from '../plugins/services/formdata';
import {
  verifyJWT,
  users,
  createUser,
  getUser,
} from '../plugins/services/auth';
import { getPrinters, sendPrint, getJob } from '../plugins/services/print';

const app = express();
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(fileUpload());

app.get('/date', verifyJWT, (req, res) => {
  res.json({ date: new Date() });
});

app.post('/login', (req, res, next) => {
  const user = createUser(req.body);
  res.status(200).json(user);
});

// [GET] /user
app.get('/users/user', (req, res) => {
  res.json(getUser(req.headers.authorization));
});

// [GET] /users/users
app.get('/users/users', verifyJWT, (req, res) => {
  res.json(users);
});

// [POST] /logout
app.post('/logout', (_req, res) => {
  res.json({ status: 'OK' });
});

// APP
app.get('/printers', (_req, res) => {
  getPrinters().then((result) => {
    res.json(result);
  });
});

app.post('/print', (req, res) => {
  sendPrint(req.files, req.body).then((result) => {
    res.json(result);
  });
});

app.get('/jobs/:print/:id', (req, res) => {
  const { print, id } = req.params;
  getJob(print, id).then((result) => {
    res.json(result);
  });
});

app.post('/upload', (req, res) => {
  const result = { msg: 'Ok' };
  try {
    upLoadFiles(req.files);
  } catch (error) {
    result.msg = 'fail';
  }
  return res.json(result);
});

// Error handler
app.use((err, _req, res) => {
  res.status(401).send(err + '');
});

// -- export app --
export default app;
