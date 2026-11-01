import { Router } from "express";
import {
 registerUser,
 loginUser
} from "../controllers/auth.controllers.js";
import {verifyToken} from '../middlewares/auth.middleware.js'

const router = Router();
router.route("/register").post(registerUser);
router.route("/login").post(loginUser);
router.route("/me").get(verifyToken, (req, res) => res.json({ user: req.user }));

export default router;