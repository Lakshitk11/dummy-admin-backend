import User from "../models/User.js";

export const getProfile = async (req, res) => {
  try {

    const user = await User.findById(req.user.id).select("-password");

    if (!user) {
      return res.status(404).json({
        message: "User not found",
      });
    }

    return res.status(200).json(user);

  } catch (error) {

    console.error(error);

    return res.status(500).json({
      message: "Internal Server Error",
    });

  }
};