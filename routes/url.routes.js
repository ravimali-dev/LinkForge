import { Router } from "express";
import rateLimit from "express-rate-limit";

import { getUrl, getAnalytics } from "../controllers/url.controller.js";
import { verifyJWT } from "../middlewares/auth.middleware.js";

const router = Router();

const limiter = rateLimit({
    windowMs: 15 * 60 * 1000,
    max: 100,
    message: {
        success: false,
        message: "Too many requests, please try again later.",
    },
    standardHeaders: true,
    legacyHeaders: false,
});

// Create short URL
router.post("/", verifyJWT, limiter, getUrl);

// Get URL analytics
router.get("/analytics/:shortCode", verifyJWT, limiter, getAnalytics);

export default router;