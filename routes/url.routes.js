import { Router } from "express";
import {
  createShortUrl,
  showShortCode,
} from "../controllers/url.controllers.js";

const router = Router();
router.route("/url").post(createShortUrl);
router.route("/:shortcode").get(showShortCode);

export default router;
