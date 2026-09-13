import { Router } from "express";
import { showUrl } from '../controllers/url.controller.js';

const router = Router();

router.get('/:shortCode', showUrl);

export default router;