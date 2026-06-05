const jwt = require("jsonwebtoken");
const User = require("../models/User");

// Verify JWT and attach user to request
async function authMiddleware(req, res, next) {
    try {
        const authorizationHeader = req.headers.authorization;

        if (!authorizationHeader) {
            return res.status(401).json({
                message: "No token provided"
            });
        }

        if (!authorizationHeader.startsWith("Bearer ")) {
            return res.status(401).json({
                message: "Invalid token format"
            });
        }

        const token = authorizationHeader.split(" ")[1];

        const decodedToken = jwt.verify(
            token,
            process.env.JWT_SECRET
        );

        const user = await User.findById(
            decodedToken.userId
        ).select("-password");

        if (!user) {
            return res.status(401).json({
                message: "User not found"
            });
        }

        req.user = user;

        next();
    } catch (error) {
        return res.status(401).json({
            message: "Invalid or expired token"
        });
    }
}

module.exports = authMiddleware;