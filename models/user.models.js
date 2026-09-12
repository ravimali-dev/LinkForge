import mongoose from "mongoose";
import bcrypt from 'bcrypt';

const UserSchema = new mongoose.Schema({
  fullname: {
    type: String,
    maxLength: 100,
    required: true,
    trim: true,
  },
  email: {
    type: String,
    required: true,
    unique: true,
    trim: true,
    lowercase: true,
  },
  username: {
    type: String,
    required: true,
    unique: true,
    trim: true,
    lowercase: true,
    index: true,
  },
  password: {
    type: String,
    required: [true, "password is require"],
  },
   refreshToken:{
      type: String,
    },
},
{
    timestamps: true
});


UserSchema.pre("save", async function (next) {
  if (!this.isModified("password")) return next();
 
  try {
    this.password = await bcrypt.hash(this.password, 10);
    next();
  } catch (error) {
    next(error);
  }
});

export const User = mongoose.model("User", UserSchema);
