import { User } from "../models/user.models.js";

const registerUser = async (req, res) => {
  try {
    const { username, email, password, fullName } = req.body;
    if (!username || !email || !password || !fullName) {
      return res.status(400).json("allfield are required");
    }
    const existedUse = await User.findOne({ $or: [{ email }, { username }] });
    if (existedUse) {
      return res.status(409).json("User allReady existes");
    }
    const user = await User.create({ username, fullName, email, password });
    console.log(user)
    res.status(201).json({
      username: user.username,
      email: user.email,
      fullName: user.fullName,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};


const loginUser = async (req, res) => {
  try {
    const { username, email, password } = req.body;

    if ((!username && !email) || !password) {
      return res.status(400).json("username or email and password required");
    }

    const user = await User.findOne({ $or: [{ email }, { username }] });
    if (!user) {
      return res.status(404).json("User not found");
    }

    const isPasswordValid = await user.isPasswordCorrect(password);
    if (!isPasswordValid) {
      return res.status(401).json("password is wrong");
    }

    const accessToken = user.generateAccessToken();
    const refreshToken = user.generateRefreshToken();

    user.refreshToken = refreshToken;
    await user.save();

    const loggedInUser = await User.findById(user._id).select(
      "-password -refreshToken"
    );

    res
      .status(200)
      .cookie("accessToken", accessToken, {
        httpOnly: true,
        secure: false, // dev me false, production me true
        maxAge: 15 * 60 * 1000, // 15 minutes
      })
      .cookie("refreshToken", refreshToken, {
        httpOnly: true,
        secure: false,
        maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
      })
      .json({
        user: loggedInUser,
        message: "User logged in successfully",
      });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};




export { registerUser, loginUser  };