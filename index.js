import express from "express";
import connectDB from './config/db.js'
import dotenv from "dotenv";
import urlRouter from "./routes/url.routes.js";
import {showUrl} from './controllers/url.controllers.js'

dotenv.config();

const app = express();
const port = 8001;
app.use(express.json());

app.use('/api/url', urlRouter); 
app.get('/:shortCode', showUrl);

// index.js
connectDB().then(() => {
  app.listen(port, () => {
    console.log(`Server running on port ${port}`);
  });
});
