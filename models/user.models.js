import mongoose, {Schema} from "mongoose";
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import { JWT_SECRET } from "../config/env.js";

const UserSchema = new Schema(
  {
    username: {
      type: String,
      required: true,
      unique: true,
      trim: true,
      lowercase: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
      trim: true,
      lowercase: true,
    },
    password: {
      type: String,
      required: [true, "Password is required"],
    },
},
    {
    timestamps: true,
    }
);

UserSchema.pre("save", async function () {
  if (!this.isModified("password")) return;
   this.password = await bcrypt.hash(this.password, 10);
});

UserSchema.methods.comparePassword = async function (plainPassword) {
  return await bcrypt.compare(plainPassword, this.password);
};

UserSchema.methods.generateToken = function () {
  return jwt.sign({ id: this._id}, JWT_SECRET, { expiresIn: "1h" });
};


export const User = mongoose.model("User", UserSchema);