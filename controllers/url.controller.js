import Url from "../models/url.models.js";
import { nanoid } from "nanoid";

// POST /api/url - Create a new short URL (supports optional custom alias)
const getUrl = async (req, res) => {
  try {
    const { originalUrl, customAlias } = req.body;

    if (!originalUrl) {
      return res.status(400).json({ error: "originalUrl is required" });
    }

    const shortCode = customAlias ? customAlias : nanoid(6);

    const url = await Url.create({ originalUrl, shortCode });

    res.status(201).json({ shortCode: url.shortCode });
  } catch (error) {
    if (error.code === 11000) {
      return res.status(400).json({ error: "This alias is already taken" });
    }
    res.status(500).json({ message: error.message });
  }
};

// GET /:shortCode - Redirect to original URL and increment click count
const showUrl = async (req, res) => {
  try {
    const { shortCode } = req.params;

    const url = await Url.findOneAndUpdate(
      { shortCode },
      { $inc: { clickCount: 1 } },
      { returnDocument: "after" }
    );

    if (!url) {
      return res.status(404).json({ error: "Short URL not found" });
    }

    res.redirect(url.originalUrl);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// GET /api/url/analytics/:shortCode - Get stats for a short URL
const getAnalytics = async (req, res) => {
  try {
    const { shortCode } = req.params;

    const url = await Url.findOne({ shortCode });

    if (!url) {
      return res.status(404).json({ error: "Short URL not found" });
    }

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