const jwt = require("jsonwebtoken");
const User = require("../models/User");

// Create JWT token for logged in user
function createToken(userId) {
    return jwt.sign(
        {
            userId: userId
        },
        process.env.JWT_SECRET,
        {
            expiresIn: process.env.JWT_EXPIRES_IN
        }
    );
}

// Register a new user
async function registerUser(req, res) {
    try {
        const { name, email, password } = req.body;

        if (!name || !email || !password) {
            return res.status(400).json({
                message: "Please provide name, email, and password"
            });
        }

        const existingUser = await User.findOne({ email: email });

        if (existingUser) {
            return res.status(400).json({
                message: "User already exists with this email"
            });
        }

        const user = await User.create({
            name: name,
            email: email,
            password: password
        });

        const token = createToken(user._id);

        res.status(201).json({
            message: "User registered successfully",
            token: token,
            user: {
                id: user._id,
                name: user.name,
                email: user.email
            }
        });
    } catch (error) {
        res.status(500).json({
            message: "Registration failed",
            error: error.message
        });
    }
}

// Login existing user
async function loginUser(req, res) {
    try {
        const { email, password } = req.body;

        if (!email || !password) {
            return res.status(400).json({
                message: "Please provide email and password"
            });
        }

        const user = await User.findOne({ email: email });

        if (!user) {
            return res.status(401).json({
                message: "Invalid email or password"
            });
        }

        const passwordMatches = await user.matchPassword(password);

        if (!passwordMatches) {
            return res.status(401).json({
                message: "Invalid email or password"
            });
        }

        const token = createToken(user._id);

        res.status(200).json({
            message: "Login successful",
            token: token,
            user: {
                id: user._id,
                name: user.name,
                email: user.email
            }
        });
    } catch (error) {
        res.status(500).json({
            message: "Login failed",
            error: error.message
        });
    }
}

// Get current logged in user
async function getCurrentUser(req, res) {
    res.status(200).json({
        message: "Current user fetched successfully",
        user: {
            id: req.user._id,
            name: req.user.name,
            email: req.user.email
        }
    });
}

module.exports = {
    registerUser,
    loginUser,
    getCurrentUser
};