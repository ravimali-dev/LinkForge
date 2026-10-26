import mongoose from "mongoose";
import { MONGO_URL } from "./env.js";

export const connectDB = async () => {
  if (!MONGO_URL) {
    console.error(" MONGO_URL missing in .env");
    process.exit(1);
  }
  try {
    await mongoose.connect(MONGO_URL);
    console.log("MongoDB connected successfully");
  } catch (error) {
    console.error("MongoDB connection error:", error.message);
    process.exit(1);
  }
};
