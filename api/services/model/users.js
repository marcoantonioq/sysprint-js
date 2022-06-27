export const schema = {
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
};

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

module.exports = {
  schema,
};
