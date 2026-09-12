import mongoose from "mongoose";

const urlSchema = new mongoose.Schema({
  originalUrl: {
    type: String,
    required: true
  },
  shortCode: {
    type: String,
    required: true,
    unique: true
  },
  clickCount: {
  type: Number,
  default: 0
}
});

const Url = mongoose.model('Url', urlSchema);

export default Url;