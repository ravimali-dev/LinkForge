import express from "express";
import connectDB from './config/db.js'
import dotenv from "dotenv";
import urlRouter from "./routes/url.routes.js"

dotenv.config();

const app = express();
const port = 8000;
app.use(express.json());

app.use('/url',urlRouter)

// index.js
connectDB().then(() => {
  app.listen(port, () => {
    console.log(`Server running on port ${port}`);
  });
});
