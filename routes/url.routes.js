import { Router } from "express";
import {getUrl} from '../controllers/url.controllers.js'
const router = Router();

router.post('/', getUrl );

export default router