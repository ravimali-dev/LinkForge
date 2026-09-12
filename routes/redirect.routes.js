import { Router } from "express";
import { showUrl } from '../controllers/url.controllers.js';

const router = Router();

router.get('/:shortCode', showUrl);

export default router;