import mongoose, {Schema} from "mongoose";
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';

const UserSchema = new Schema(
  {
    username: {
      type: String,
      required: true,
      unique: true,
      trim: true,
      lowercase: true,
      index: true
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


export const User = mongoose.model("User", UserSchema);