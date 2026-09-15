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
    const accessToken = user.generateAccessToken();
    const refreshToken = user.generateRefreshToken();
    user.refreshToken = refreshToken;
    await user.save();

    res
      .status(201)
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
        username: user.username,
        email: user.email,
        fullName: user.fullName,
        message: "User registered successfully",
      });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const loginUser = async (req, res) => {
  try {
    const { username, email, password } = req.body;

    if ((!username && !email) || !password) {
      return res.status(400).json({ message: "All fields are required" });
    }

    const user = await User.findOne({ $or: [{ email }, { username }] });
    if (!user) {
      return res.status(401).json({ message: "Invalid credentials" });
    }

    const isPasswordValid = await user.isPasswordCorrect(password);
    if (!isPasswordValid) {
      return res.status(401).json({ message: "Invalid credentials" });
    }

    const accessToken = user.generateAccessToken();
    const refreshToken = user.generateRefreshToken();

    user.refreshToken = refreshToken;
    await user.save();

    const loggedInUser = await User.findById(user._id).select(
      "-password -refreshToken",
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

const logoutUser = async (req, res) => {
  try {
    let user = req.user;
    user.refreshToken = null;
    await user.save();
    res
      .status(200)
      .clearCookie("accessToken", {
        httpOnly: true,
        secure: false, // dev me false, production me true
      })
      .clearCookie("refreshToken", {
        httpOnly: true,
        secure: false,
      })
      .json({
        message: "User logged out successfully",
      });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const refreshAccessToken = async (req, res) => {
  try {
    // 1. cookie se refreshToken nikalo
    const incomingRefreshToken = req.cookie.refreshAccessToken;
    // 2. na mile to 401
    if (!refreshAccessToken) {
      return res.status(401).json({ message: "Invalid credentials" });
    }

    // 3. jwt.verify() se decode karo
    const decodedToken = jwt.verify(
      incomingRefreshToken,
      process.env.REFRESH_TOKEN_SECRET,
    );
    // 4. decoded._id se user dhoondo
    const user = User.findById(decodedToken._id);
    // 5. user na mile to 401
    if (!user) {
      return res.status(401).json({ message: "Invalid credentials" });
    }
    // 6. DB wala refreshToken aur cookie wala match karo
    // 7. match na ho to 401
    if (incomingRefreshToken !== user.refreshToken) {
      res.status(401).json({ message: "Invalid credentials" });
    }

    // 8. naye tokens generate karo, save karo, cookies set karo, response bhejo
    const accessToken = user.generateAccessToken();
    const refreshToken = user.generateRefreshToken();
    const options = {
      httpOnly: true,
      secure: false,
    };
    const loggedInUser = await User.findById(user._id).select(
      "-password -refreshToken",
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

export { registerUser, loginUser, logoutUser };
