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
    res.status(201).json({ shortCode: shortCode });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const showUrl = async (req, res) => {
  try {
    const { shortCode } = req.params;
    const url = await Url.findOneAndUpdate(
      { shortCode },
      { $inc: { clickCount: 1 } },
      { returnDocument: "after" },
    );
    if (!url) {
      return res.status(404).json({ error: "Short URL not found" });
    }

    res.redirect(url.originalUrl);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const getAnalytics = async (req, res) => {
  try {
    const shortCode = req.params.shortCode;
    const url = await Url.findOne({ shortCode });
    if (!url) {
      return res.status(404).json({ error: "Short URL not found" });
    }
    console.log(url);
    res.status(200).json({
      originalUrl: url.originalUrl,
      shortCode: url.shortCode,
      clickCount: url.clickCount,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
export { getUrl, showUrl, getAnalytics };
