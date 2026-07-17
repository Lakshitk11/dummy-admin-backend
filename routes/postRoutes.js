import express from "express";
import authMiddleware from "../middleware/authMiddleware.js";
import {
  getAllPosts,
  createPost,
  likePost,
  commentPost,
  deletePost
} from "../controller/postController.js";

const router = express.Router();

router.get("/", authMiddleware, getAllPosts);
router.post("/", authMiddleware, createPost);
router.post("/:id/like", authMiddleware, likePost);
router.post("/:id/comment", authMiddleware, commentPost);
router.delete("/:id", authMiddleware, deletePost);

export default router;
