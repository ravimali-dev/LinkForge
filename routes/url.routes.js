import { Router } from "express";
import rateLimit from 'express-rate-limit';
import { getUrl, getAnalytics } from '../controllers/url.controllers.js';

const router = Router();

const limiter = rateLimit({
    windowMs: 15 * 60 * 1000,
    max: 100,
    message: "Too many requests, please try again later"
}); 

router.post('/', limiter, getUrl);
router.get('/analytics/:shortCode', getAnalytics);

export default router;