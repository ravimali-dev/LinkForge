import jwt from "jsonwebtoken";
import { User } from "../models/user.models.js";
const verifyJWT = async (req, res, next) => {
  try {
    const accessToken = req.cookies.accessToken;
    const decodedToken = jwt.verify(
      accessToken,
      process.env.ACCESS_TOKEN_SECRET,
    );
    const { _id } = decodedToken;
    const user = await User.findById(_id).select("-password -refreshToken");
    req.user = user;
    next();
  } catch (error) {
    res.status(401).json("Invalid or expired token");
  }
};

export { verifyJWT };
