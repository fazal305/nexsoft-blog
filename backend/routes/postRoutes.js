const express = require("express");
const {
    createPost,
    getAllPosts,
    getSinglePost,
    updatePost,
    deletePost
} = require("../controllers/postController");

const authMiddleware = require("../middleware/authMiddleware");

const router = express.Router();

// Get all posts
router.get("/", getAllPosts);

// Get one post
router.get("/:id", getSinglePost);

// Create new post
router.post("/", authMiddleware, createPost);

// Update post
router.put("/:id", authMiddleware, updatePost);

// Delete post
router.delete("/:id", authMiddleware, deletePost);

module.exports = router;