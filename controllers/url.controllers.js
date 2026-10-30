import { Url } from "../models/url.model.js";
import { generateRandomMix, isValidUrl } from "../utils/helpers.js";
import { BASE_URL } from "../config/env.js";

const createShortUrl = async (req, res) => {
  try {
    const originalUrl = req.body?.url;
    if (!originalUrl) {
      return res.status(400).json({ error: "url is required" });
    }
    if (typeof originalUrl !== "string") {
  return res.status(400).json({ error: "url must be a string" });
}

    if (!isValidUrl(originalUrl)) {
      return res.status(400).json({ error: "url is not valid" });
    }

    const findUrl = await Url.findOne({ originalUrl });
    if (findUrl) {
      return res.status(200).json({
        shortUrl: `${BASE_URL}/${findUrl.shortcode}`,
      });
    }

    for (let attempts = 0; attempts < 5; attempts++) {
      const shortcode = generateRandomMix(6);
      try {
        await Url.create({ originalUrl, shortcode });
        return res.status(201).json({
          shortUrl: `${BASE_URL}/${shortcode}`,
        });
      } catch (error) {
        if (error.code === 11000 && error.keyPattern?.shortcode) {
          continue;
        }

        if (error.code === 11000 && error.keyPattern?.originalUrl) {
          const existing = await Url.findOne({ originalUrl });
          return res.status(200).json({
            shortUrl: `${BASE_URL}/${existing.shortcode}`,
          });
        }

        throw error;
      }
    }

    return res.status(500).json({
      error: "Could not generate a unique shortcode",
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Internal server error" });
  }
};
const showShortCode = async (req, res) => {
  try {
    const { shortcode } = req.params;
    const urlData = await Url.findOneAndUpdate(
      { shortcode },
      { $inc: { count: 1 } },
      { returnDocument: "after" },
    );
    if (!urlData) {
      return res.status(404).json({ error: "short URL not found" });
    }

    res.redirect(`${urlData.originalUrl}`);
  } catch (error) {
    console.error("Error redirecting short URL:", error);
    return res.status(500).json({ error: "Internal server error" });
  }
};

export { createShortUrl, showShortCode };
