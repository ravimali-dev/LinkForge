import express from "express";
import cors from 'cors';
import connectDB from './config/db.js';
import dotenv from "dotenv";
import urlRouter from "./routes/url.routes.js";
import redirectRouter from "./routes/redirect.routes.js";

dotenv.config();

const app = express();
const port = 8001;
app.use(express.json());


app.use(cors({
  origin: 'http://localhost:5173',
  credentials: true   // baad mein jab JWT cookies add karoge, tab isse zaroorat padegi
}));

app.use('/api/url', urlRouter);
app.use('/', redirectRouter);

connectDB().then(() => {
  app.listen(port, () => {
    console.log(`Server running on port ${port}`);
  });
});