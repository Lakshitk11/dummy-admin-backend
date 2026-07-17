import Post from "../models/Post.js";
import User from "../models/User.js";

// Fetch all posts (newest first)
export const getAllPosts = async (req, res) => {
  try {
    const posts = await Post.find()
      .populate("user", "name email profilePic")
      .sort({ createdAt: -1 });
    res.status(200).json(posts);
  } catch (error) {
    console.error("Get posts error:", error);
    res.status(500).json({ message: "Server error fetching posts" });
  }
};

// Create a new post
export const createPost = async (req, res) => {
  try {
    const { text, image } = req.body;
    if (!text) {
      return res.status(400).json({ message: "Post content is required" });
    }
    const newPost = new Post({
      user: req.user.id,
      text,
      image: image || "",
    });
    await newPost.save();

    const populatedPost = await newPost.populate("user", "name email profilePic");
    res.status(201).json(populatedPost);
  } catch (error) {
    console.error("Create post error:", error);
    res.status(500).json({ message: "Server error creating post" });
  }
};

// Toggle like on a post
export const likePost = async (req, res) => {
  try {
    const post = await Post.findById(req.params.id);
    if (!post) {
      return res.status(404).json({ message: "Post not found" });
    }
    const userId = req.user.id;
    const likedIndex = post.likes.indexOf(userId);

    if (likedIndex === -1) {
      post.likes.push(userId);
    } else {
      post.likes.splice(likedIndex, 1);
    }

    await post.save();
    const populatedPost = await post.populate("user", "name email profilePic");
    res.status(200).json(populatedPost);
  } catch (error) {
    console.error("Like post error:", error);
    res.status(500).json({ message: "Server error liking post" });
  }
};

// Add comment to a post
export const commentPost = async (req, res) => {
  try {
    const { text } = req.body;
    if (!text) {
      return res.status(400).json({ message: "Comment text is required" });
    }
    const post = await Post.findById(req.params.id);
    if (!post) {
      return res.status(404).json({ message: "Post not found" });
    }

    const user = await User.findById(req.user.id);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    const newComment = {
      user: req.user.id,
      text,
      userName: user.name,
    };

    post.comments.push(newComment);
    await post.save();

    const populatedPost = await post.populate("user", "name email profilePic");
    res.status(200).json(populatedPost);
  } catch (error) {
    console.error("Comment post error:", error);
    res.status(500).json({ message: "Server error adding comment" });
  }
};

// Delete a post
export const deletePost = async (req, res) => {
  try {
    const post = await Post.findById(req.params.id);
    if (!post) {
      return res.status(404).json({ message: "Post not found" });
    }

    // Check ownership or admin role
    if (post.user.toString() !== req.user.id && req.user.role !== "admin") {
      return res.status(403).json({ message: "Unauthorized to delete this post" });
    }

    await post.deleteOne();
    res.status(200).json({ message: "Post deleted successfully", postId: req.params.id });
  } catch (error) {
    console.error("Delete post error:", error);
    res.status(500).json({ message: "Server error deleting post" });
  }
};
