import mongoose from 'mongoose';
import UserSchema from './model/users';

mongoose
  .connect('mongodb://localhost/sysprint')
  .then(() => {
    console.log('Conectado com sucesso!');
  })
  .catch((err) => {
    console.log('Erro ao conectar no mongo: ', err);
    return err;
  });

// Schema
mongoose.model('users', mongoose.Schema(UserSchema));

// // Collection
export const Users = mongoose.model('users');
