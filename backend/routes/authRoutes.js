const express = require("express");
const {
    registerUser,
    loginUser,
    getCurrentUser
} = require("../controllers/authController");

const authMiddleware = require("../middleware/authMiddleware");

const router = express.Router();

// Register new user
router.post("/register", registerUser);

// Login existing user
router.post("/login", loginUser);

// Get current logged in user
router.get("/me", authMiddleware, getCurrentUser);

module.exports = router;