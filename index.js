import express from "express";
import { connectDB } from "./config/db.js";
import { PORT } from "./config/env.js";
import urlRouter from "./routes/url.routes.js";

const app = express();
app.use(express.json());

app.use("/", urlRouter);

connectDB()
  .then(() =>
    app.listen(PORT, () => {
      console.log(`server is starting on port ${PORT}`);
    }),
  )