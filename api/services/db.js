const mongoose = require('mongoose');
const { schema } = require('./model/users');

console.log(schema);

// mongoose
//   .connect('mongodb://localhost/sysprint')
//   .then(() => {
//     console.log('Conectado com sucesso!');
//   })
//   .catch((err) => {
//     console.log('Erro ao conectar no mongo: ', err);
//     return err;
//   });

// // Schema
// mongoose.model('users', mongoose.Schema(UserSchema));

// // Collection
// export const users = mongoose.model('users');

// // eslint-disable-next-line new-cap
// new users({
//   name: 'Marco Antônio',
//   username: '1934155',
//   email: 'marco.queiroz@ifg.edu.br',
// })
//   .save()
//   .then(() => {
//     console.log('Usuário criado com sucesso!');
//   })
//   .catch((err) => {
//     console.log('Erro ao salvar: ', err);
//   });
