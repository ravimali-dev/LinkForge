import express from "express";
import { connectDB } from "./config/db.js";
import { PORT, BASE_URL } from "./config/env.js";
import urlRouter from "./routes/url.routes.js";

const app = express();
app.use(express.json());

app.use("/", urlRouter);


app.use((err, req, res, next) => {
  console.error(err);

  if (err.type === "entity.parse.failed") {
    return res.status(400).json({ error: "Invalid JSON" });
  }

  return res.status(500).json({ error: "Internal server error" });
});


if(!BASE_URL){
    console.error(" BASE_URL missing in .env");
    process.exit(1);
}
connectDB()
  .then(() =>
    app.listen(PORT, () => {
      console.log(`server is starting on port ${PORT}`);
    }),
  )