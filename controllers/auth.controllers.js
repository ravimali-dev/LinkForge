import { User } from "../models/user.models.js";

const registerUser = async (req, res) => {
  try {
    // Step 1: body se data lo
    const { username, email, password } = req.body ?? {};

    // Step 2: teeno aaye hain ya nahi
    if (!username || !email || !password) {
      return res
        .status(400)
        .json({ error: "username, email and password are required" });
    }

    // sab text hi hone chahiye (object bhejke koi trick na kar sake)
    if (
      typeof username !== "string" ||
      typeof email !== "string" ||
      typeof password !== "string"
    ) {
      return res.status(400).json({ error: "all fields must be strings" });
    }

    // Step 3: kya ye username ya email pehle se hai
    const existingUser = await User.findOne({ $or: [{ username }, { email }] });
    if (existingUser) {
      return res
        .status(409)
        .json({ error: "username or email already exists" });
    }

    // Step 4: sab theek hai, save karo (password hook khud hash karega)
    const user = await User.create({ username, email, password });

    return res.status(201).json({
      message: "User registered successfully",
      user: { id: user._id, username: user.username, email: user.email },
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: "Internal server error" });
  }
};

export { registerUser };