import mongoose from "mongoose";

const connectToDatabase = async () => {
    try {
        await mongoose.connect(process.env.MONGOURI);
        console.log("Connected to DB");
    } catch (err) {
        console.error("Error connecting to DB:", err);
    }
};

module.exports = connectToDatabase;
