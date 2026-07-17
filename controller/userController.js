//import User from "../models/user";
import bcrypt from "bcrypt";
import User from "../models/User.js";

export const updateProfile = async (req, res) => {
  try {
    const allowedFields = ["name", "bio", "profilePic"];

    const updateData = {};

    allowedFields.forEach((field) => {
      if (req.body[field] !== undefined) {
        updateData[field] = req.body[field];
      }
    });

    const updatedUser = await User.findByIdAndUpdate(
      req.user.id,
      updateData,
      {
        new: true,
        runValidators: true,
      }
    ).select("-password");

    return res.status(200).json({
      message: "Profile updated successfully",
      user: updatedUser,
    });

  } catch (error) {
    console.error("Update Profile Error:", error);

    return res.status(500).json({
      message: "Internal Server Error",
    });
  }
};

export const changePassword = async (req, res) => {
  try {
    const { currentPassword, newPassword } = req.body;

    if (!currentPassword || !newPassword) {
      return res.status(400).json({
        message: "Current password and new password are required",
      });
    }

    const user = await User.findById(req.user.id);
    if (!user) {
      return res.status(404).json({
        message: "User not found",
      });
    }

    // Compare original password
    const isPasswordCorrect = await bcrypt.compare(currentPassword, user.password);
    if (!isPasswordCorrect) {
      return res.status(400).json({
        message: "Incorrect current password",
      });
    }
    let lenght = newPassword.length;
    if (lenght<6) {
        return res.status(400).json({
            message: "password must be of atleast 6 character",
        });
    }
    if ( newPassword === currentPassword) {
        return res.status(400).json({
            message: "new password must be different from old password",
        });
    }

    // Hash and save new password
    const hashedPassword = await bcrypt.hash(newPassword, 10);
    user.password = hashedPassword;
    await user.save();

    return res.status(200).json({
      message: "Password updated successfully",
    });

  } catch (error) {
    console.error("Change Password Error:", error);
    return res.status(500).json({
      message: "Internal Server Error",
    });
  }
};
