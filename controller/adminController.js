//import User from "../models/user.js";

import User from "../models/User.js";

export const getAllUsers = async (req, res) => {
  try {  
    const users = await User.find({}).select("-password");
    return res.status(200).json({
      message: "Users fetched successfully",
      users, 
    });
  } catch (error) {
    return res.status(500).json({
      message: "Internal Server Error",
    });
  }
};

export const updateUserRole = async (req, res) => {
  try {
    const { id } = req.params;

    const user = await User.findById(req.params.id);

    if (!user) {
      return res.status(404).json({
        message: "User not found",
      });
    }

    // Prevent removing your own admin role
    if (req.user.id === id) {
      return res.status(400).json({
        message: "You cannot change your own role.",
      });
    }

    // Toggle role
    user.role = user.role === "user" ? "admin" : "user";

await user.save();

    return res.status(200).json({
      message: "Role updated successfully",
      user,
    });

  } catch (error) {
    return res.status(500).json({
      message: "Internal Server Error",
    });
  }
};