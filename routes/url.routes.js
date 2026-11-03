import { Router } from "express";
import {verifyToken} from "../middlewares/auth.middleware.js";
import {
  createShortUrl,
  showShortCode,
  getMyUrls,
} from "../controllers/url.controllers.js";

const router = Router();
router.route("/url").post(verifyToken, createShortUrl);
router.route("/short/:shortcode").get(showShortCode);
router.route('/getMyUrls').get(verifyToken, getMyUrls)
export default router;
