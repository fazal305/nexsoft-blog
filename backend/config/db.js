const mongoose = require("mongoose");

// Connect backend server to MongoDB database
async function connectDatabase() {
    try {
        const databaseConnection = await mongoose.connect(process.env.MONGODB_URI);

        console.log(`MongoDB connected: ${databaseConnection.connection.host}`);
    } catch (error) {
        console.error(`MongoDB connection failed: ${error.message}`);
        process.exit(1);
    }
}

module.exports = connectDatabase;