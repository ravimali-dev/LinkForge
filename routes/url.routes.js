import { Router } from "express";
import {verifyToken} from "../middlewares/auth.middleware.js";
import {
  createShortUrl,
  showShortCode,
} from "../controllers/url.controllers.js";

const router = Router();
router.route("/url").post(verifyToken, createShortUrl);
router.route("/:shortcode").get(showShortCode);

export default router;
