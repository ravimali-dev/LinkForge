import { Url } from "../models/url.model.js";
import { generateRandomMix, isValidUrl } from "../utils/helpers.js";
import { BASE_URL } from "../config/env.js";

const createShortUrl = async (req, res) => {
  try {
    const originalUrl = req.body?.url;
    if (!originalUrl) {
      return res.status(400).json({ error: "url is required" });
    }

    if (!isValidUrl(originalUrl)) {
      return res.status(400).json({ error: "url is not valid" });
    }

    for (let attempts = 0; attempts < 5; attempts++) {
      let shortcode = generateRandomMix(6);
      try {
        await Url.create({ url: originalUrl, shortcode });
        return res.status(201).json({
          shortUrl: `${BASE_URL}/${shortcode}`,
        });
      } catch (error) {
        if (error.code === 11000) {
          continue;
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
    const shortcode = req.params?.shortcode;
    let urlData = await Url.findOneAndUpdate(
      { shortcode: shortcode },
      { $inc: { count: 1 } },
      { returnDocument: "after" },
    );
    if (!urlData) {
      return res.status(404).json({ error: "short URL not found" });
    }

    console.log(urlData.count);

    res.redirect(`${urlData.url}`);
  } catch (error) {
    console.error(error);
  return res.status(500).json({ error: "Internal server error" });
  }
};

export { createShortUrl, showShortCode };
