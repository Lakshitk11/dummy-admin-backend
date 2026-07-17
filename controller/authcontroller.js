import jwt from "jsonwebtoken";
import bcrypt from "bcrypt";
import User from "../models/User.js";
//import User from "../models/user.js";

// Controller to refresh the JWT Access Token
export const refreshAccessToken = async (req, res) => {
  try {
    const { refreshToken } = req.body;

    if (!refreshToken) {
      return res.status(401).json({
        message: "Refresh token is required",
      });
    }

    const decoded = jwt.verify(
      refreshToken,
      process.env.JWT_REFRESH_SECRET
    );

    const user = await User.findById(decoded.id);

    if (!user) {
      return res.status(404).json({
        message: "User not found",
      });
    }

    const accessToken = jwt.sign(
      {
        id: user._id,
        email: user.email,
        role: user.role,
      },
      process.env.JWT_SECRET,
      {
        expiresIn: "15m",
      }
    );

    res.status(200).json({
      accessToken,
    });

  } catch (error) {
    res.status(401).json({
      message: "Access token expired",
    });
  }
};

// Login user using MongoDB database
export const login = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ message: "Email and password are required" });
    }

    // Find the user in the database
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(400).json({ message: "Invalid email or password" });
    }

    // Compare the hashed password
    const isPasswordCorrect = await bcrypt.compare(password, user.password);
    if (!isPasswordCorrect) {
      return res.status(400).json({ message: "Invalid email or password" });
    }

    // Generate JWT access token (15 mins)
    const accessToken = jwt.sign(
      { id: user._id, email: user.email ,role: user.role},
      process.env.JWT_SECRET,
      { expiresIn: "15m" }
    );

    // Generate JWT refresh token (7 days)
    const refreshToken = jwt.sign(
      { id: user._id },
      process.env.JWT_REFRESH_SECRET,
      { expiresIn: "7d" }
    );

    // Respond with user credentials and tokens
    res.status(200).json({
      accessToken,
      refreshToken,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        bio: user.bio || "",
        profilePic: user.profilePic || "",
      },
    });
  } catch (error) {
    console.error("Login error:", error);
    res.status(500).json({ message: "An error occurred during login" });
  }
};

// Register user in MongoDB database
export const register = async (req, res) => {
  try {
    const { name, email, password, profilePic } = req.body;

    if (!name || !email || !password) {
      return res.status(400).json({ message: "All fields are required" });
    }

    // Check if the user already exists in the database
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ message: "User with this email already exists" });
    }

    // Hash the password for security
    const hashedPassword = await bcrypt.hash(password, 10);

    // Create and save the new user
    const newUser = await User.create({
      name,
      email,
      password: hashedPassword,
      profilePic: profilePic || "",
    });

    // Generate JWT access token
    const accessToken = jwt.sign(
  { id: newUser._id, email: newUser.email, role: newUser.role },
  process.env.JWT_SECRET,
  { expiresIn: "15m" }
);


    // Generate JWT refresh token
    const refreshToken = jwt.sign(
      { id: newUser._id },
      process.env.JWT_REFRESH_SECRET,
      { expiresIn: "7d" }
    );

    // Respond with success structure matching the frontend login handler
    res.status(201).json({
      accessToken,
      refreshToken,
      user: {
        id: newUser._id,
        name: newUser.name,
        email: newUser.email,
        role: newUser.role,
        bio: newUser.bio || "",
        profilePic: newUser.profilePic || "",
      },
    });
  } catch (error) {
    console.error("Registration error:", error);
    res.status(500).json({ message: "An error occurred during registration" });
  }
};
