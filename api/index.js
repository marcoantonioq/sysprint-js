import express from 'express';
import fileUpload from 'express-fileupload';
import * as form from '../src/Controllers/Components/formdata';
import * as auth from '../src/Controllers/Components/auth';
import * as printers from '../src/Controllers/printers';

const app = express();
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(fileUpload());
app.post('/login', auth.createUser);
app.get('/users/user', auth.verifyJWT, auth.getUser);
app.get('/users/users', auth.verifyJWT, (req, res) => {
  res.json(auth.users);
});
app.post('/logout', auth.verifyJWT, auth.deleteToke);
app.get('/printers', auth.verifyJWT, printers.getPrinters);
app.post('/print', printers.sendPrint);
app.get('/jobs/:print/:id', printers.getJob);
app.post('/upload', auth.verifyJWT, form.upLoadFiles);

app.get('/date', auth.verifyJWT, (req, res) => {
  res.json({ date: new Date() });
});

// Error handler
app.use((err, _req, res) => {
  res.status(401).send(err + '');
});

// -- export app --
export default app;
