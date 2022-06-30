import mongoose from 'mongoose';

const schema = {
  name: {
    type: String,
    require: true,
  },
  username: {
    type: String,
    require: true,
  },
  email: {
    type: String,
    require: true,
  },
  thumbnail: {
    type: String,
  },
  status: {
    type: Boolean,
  },
  rules: {
    type: String,
  },
  quota: {
    type: Number,
  },
  pages: {
    type: Number,
  },
};

export default mongoose.models.users ||
  mongoose.model('users', mongoose.Schema(schema, { timestamps: true }));

// eslint-disable-next-line new-cap
// new db.User({
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
