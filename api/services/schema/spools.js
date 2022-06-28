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
};

export default schema;
