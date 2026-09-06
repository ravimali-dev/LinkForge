import Url from "../models/url.models.js";
import { nanoid } from "nanoid";

const getUrl = async (req, res) => {
  try {
    const { originalUrl } = req.body;
    if (!originalUrl) {
      return res.status(400).json({ error: "originalUrl is required" });
    }
    const shortCode = nanoid(6);
    const url = await Url.create({ originalUrl, shortCode });
    res.status(201).json(shortCode);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export { getUrl };
