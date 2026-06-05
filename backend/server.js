require("dns").setServers(["8.8.8.8", "1.1.1.1"]);

const express = require("express");
const cors = require("cors");
const dotenv = require("dotenv");
const connectDatabase = require("./config/db");

const authRoutes = require("./routes/authRoutes");
const postRoutes = require("./routes/postRoutes");

dotenv.config();

const app = express();

const PORT = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());

// Auth routes
app.use("/api/auth", authRoutes);

// Post routes
app.use("/api/posts", postRoutes);

app.get("/", function (req, res) {
    res.json({
        message: "Nexsoft Blog API is running successfully"
    });
});

// Start server after database connects
async function startServer() {
    await connectDatabase();

    app.listen(PORT, function () {
        console.log(`Server is running on port ${PORT}`);
    });
}

startServer();