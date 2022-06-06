/* eslint-disable object-shorthand */
import { Object } from 'core-js';
import express from 'express';
import axios from 'axios';
const jwt = require('jsonwebtoken');
const fileUpload = require('express-fileupload');
const { v4: uuidv4 } = require('uuid');

const users = {};

const app = express();
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(fileUpload());

// eslint-disable-next-line require-await
async function verifyJWT(req, res, next) {
  const token = req.headers.authorization;
  if (!token)
    return res.status(401).json({ auth: false, message: 'No token provided.' });
  jwt.verify(token, process.env.API_SECRETE, function (err, decoded) {
    if (err)
      return res
        .status(500)
        .json({ auth: false, message: 'Failed to authenticate token.' });
    req.userId = decoded.id;
    next();
  });
}

app.get('/date', verifyJWT, (req, res) => {
  res.json({ date: new Date() });
});

app.post('/login', (req, res, next) => {
  const { email } = req.body;
  const token = jwt.sign({ userId: 1, email: email }, process.env.API_SECRETE, {
    expiresIn: '2h',
  });

  const user = {
    success: true,
    data: {
      token: {
        token: token,
        type: 'Bearer',
      },
      user: {
        username: email,
        firstName: 'firstName',
        lastName: 'latName',
      },
    },
  };

  users[email] = user;

  res.status(200).json(user);
});

// [GET] /user
app.get('/users/user', (req, res) => {
  const email = Object.keys(users).find((email) => {
    return users[email].data.token.token === req.headers.authorization;
  });
  res.json(users[email]);
});

// [GET] /users/users
app.get('/users/users', verifyJWT, (req, res) => {
  res.json(users);
});

// [GET] /user
app.post('/users/token', verifyJWT, (req, res) => {
  const { token } = req.body;
  const email = Object.keys(users).find((email) => {
    return users[email].data.token.token === token;
  });
  res.json(users[email]);
});

// [POST] /logout
app.post('/logout', (_req, res) => {
  res.json({ status: 'OK' });
});

// APP
app.get('/printers', (_req, res) => {
  // eslint-disable-next-line no-console
  axios.get(`${process.env.CUPS_URL}/printers`).then((response) => {
    const printers = response.data
      .match(/<TR><TD><A HREF="\/printers\/([a-zA-Z0-9-^"]+)">/gm)
      .map((printer) => {
        return /"\/printers\/([a-zA-Z0-9-^"]+)"/.exec(printer);
      })
      .map((printer) => {
        return {
          icon: '/img/print.png',
          name: printer[1],
          path: printer[0],
          selected: false,
        };
      });
    res.json({ printers: printers });
  });
});

try {
  app.post('/print', (req, res) => {
    // const { token } = req.body;
    // eslint-disable-next-line no-console
    console.log('Body::', JSON.stringify(req.body));
    // eslint-disable-next-line no-console
    console.log('Files::', JSON.stringify(req.files));
    const { nome, site } = req.body;
    res.json({ nome, site });
  });
} catch (e) {
  console.log('Erro: ', e);
}

app.post('/upload', (req, res) => {
  if (!req.files) {
    res.status(400).send('Sem arquivos!');
  }
  // eslint-disable-next-line no-console
  console.log(req.files);

  const img = req.files.file;
  const filename = uuidv4(req.files?.file.name);
  const ext = req.files?.file.mimetype.split('/')[1];

  img.mv(`upload/${filename}.${ext}`);
  return res.json({ msg: 'Ok' });
});

// Error handler
app.use((err, _req, res) => {
  res.status(401).send(err + '');
});

// -- export app --
export default app;
