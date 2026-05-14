import mongoose from "mongoose";

const MONGO_URI = process.env.MONGO_URI || process.env.MONGODB_URI ||
  "mongodb+srv://walekarprathamesh8_db_user:v9ianxJdhmDG7Ita@cluster0.fve9qej.mongodb.net/MediCare?retryWrites=true&w=majority";

export const connectDB = async () => {
  try {
    await mongoose.connect(MONGO_URI);
    console.log("Connected to MongoDB successfully");
  } catch (error) {
    console.error("Error connecting to MongoDB:", error);
    process.exit(1);
  }
};