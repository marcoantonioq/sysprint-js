import mongoose from 'mongoose';
import User from './User';
import Spool from './Spool';

mongoose
  .connect('mongodb://localhost/sysprint', {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => {
    console.log('Conectado com sucesso!');
  })
  .catch((err) => {
    console.log('Erro ao conectar no mongo: ', err);
    return err;
  });

export default {
  User,
  Spool,
};
