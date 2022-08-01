import mongoose from 'mongoose';
import { info, warn } from '../Controllers/Components/logging';
import User from './User';
import Spool from './Spool';

mongoose
  .connect('mongodb://localhost/sysprint', {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => {
    info(`Conectado no mongo ${new Date().toLocaleString()}!`);
  })
  .catch((err) => {
    warn(`Erro ao conectar no mongo ${new Date().toLocaleString()}: `, err);
    return err;
  });

export default {
  User,
  Spool,
};
