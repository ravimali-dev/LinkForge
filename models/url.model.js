import mongoose, { Schema } from "mongoose";

const urlSchema = new Schema(
  {
    originalUrl: {
      type: String,
       required: true,
       unique: true,
    },
    shortcode: {
      type: String,
      required: true,
      unique: true,
      index: true,
    },
    count:{
      type: Number,
      default: 0,
    },
  },
  {
    timestamps: true,
  },
);

export const Url = mongoose.model('Url', urlSchema)
