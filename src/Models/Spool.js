import mongoose from 'mongoose';

const schema = {
  job: {
    type: Number,
    require: true,
  },
  username: {
    type: String,
    require: true,
  },
  printer: {
    type: String,
    requere: true,
  },
  copies: Number,
  file: String,
  params: String,
  status: String,
  media: String,
  message: String,
};

export default mongoose.models.spools ||
  mongoose.model('spools', mongoose.Schema(schema, { timestamps: true }));
