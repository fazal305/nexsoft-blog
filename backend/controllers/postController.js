const Post = require("../models/Post");

// Create a new blog post
async function createPost(req, res) {
    try {
        const { title, content, category } = req.body;

        if (!title || !content || !category) {
            return res.status(400).json({
                message: "Please provide title, content, and category"
            });
        }

        const post = await Post.create({
            title: title,
            content: content,
            category: category,
            author: req.user._id
        });

        res.status(201).json({
            message: "Post created successfully",
            post: post
        });
    } catch (error) {
        res.status(500).json({
            message: "Post creation failed",
            error: error.message
        });
    }
}

// Get all blog posts
async function getAllPosts(req, res) {
    try {
        const posts = await Post.find()
            .populate("author", "name email")
            .sort({ createdAt: -1 });

        res.status(200).json({
            message: "Posts fetched successfully",
            count: posts.length,
            posts: posts
        });
    } catch (error) {
        res.status(500).json({
            message: "Posts fetch failed",
            error: error.message
        });
    }
}

// Get one blog post
async function getSinglePost(req, res) {
    try {
        const post = await Post.findById(req.params.id)
            .populate("author", "name email");

        if (!post) {
            return res.status(404).json({
                message: "Post not found"
            });
        }

        res.status(200).json({
            message: "Post fetched successfully",
            post: post
        });
    } catch (error) {
        res.status(500).json({
            message: "Post fetch failed",
            error: error.message
        });
    }
}

// Update a blog post
async function updatePost(req, res) {
    try {
        const { title, content, category } = req.body;

        const post = await Post.findById(req.params.id);

        if (!post) {
            return res.status(404).json({
                message: "Post not found"
            });
        }

        if (post.author.toString() !== req.user._id.toString()) {
            return res.status(403).json({
                message: "You can only update your own posts"
            });
        }

        post.title = title || post.title;
        post.content = content || post.content;
        post.category = category || post.category;

        const updatedPost = await post.save();

        res.status(200).json({
            message: "Post updated successfully",
            post: updatedPost
        });
    } catch (error) {
        res.status(500).json({
            message: "Post update failed",
            error: error.message
        });
    }
}

// Delete a blog post
async function deletePost(req, res) {
    try {
        const post = await Post.findById(req.params.id);

        if (!post) {
            return res.status(404).json({
                message: "Post not found"
            });
        }

        if (post.author.toString() !== req.user._id.toString()) {
            return res.status(403).json({
                message: "You can only delete your own posts"
            });
        }

        await post.deleteOne();

        res.status(200).json({
            message: "Post deleted successfully"
        });
    } catch (error) {
        res.status(500).json({
            message: "Post delete failed",
            error: error.message
        });
    }
}

module.exports = {
    createPost,
    getAllPosts,
    getSinglePost,
    updatePost,
    deletePost
};