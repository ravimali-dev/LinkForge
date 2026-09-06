import { Router } from "express";
import {getUrl} from '../controllers/url.controllers.js'
const router = Router();

router.get('/path', getUrl );
export default router