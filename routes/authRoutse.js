import express from "express";
import {
  login,
  register,
  refreshAccessToken,
} from "../controller/authcontroller.js";
import authMiddleware from "../middleware/authMiddleware.js";
import User from "../models/User.js";
import { updateProfile, changePassword } from "../controller/userController.js";
import { getProfile } from "./userRoute.js";
import adminMiddleware from "../middleware/adminMiddleware.js";
import { getAllUsers, updateUserRole } from "../controller/adminController.js";


const router = express.Router();
router.get(
    "/admin/users",
    authMiddleware,
    adminMiddleware,
    getAllUsers,
);

router.put(
    "/admin/users/:id/role",
    authMiddleware,
    adminMiddleware,
    updateUserRole
);
router.post("/login", login);
router.post("/signup", register);
router.post("/refresh-token", refreshAccessToken);

// Route to fetch authenticated user details
router.get("/user", authMiddleware, getProfile);
router.put("/user", authMiddleware, updateProfile);
router.put("/user/password", authMiddleware, changePassword);
router.get("/users", authMiddleware, getAllUsers);
export default router;