import mongoose from "mongoose";

export const connectDB = async () => {
  const mongoUri = process.env.MONGO_URI;
  if (!mongoUri) {
    console.error("MONGO_URI is not set in environment");
    process.exit(1);
  }
  try {
    const conn = await mongoose.connect(mongoUri, {
      dbName: process.env.MONGO_DB || "carevia",
    });
    console.log(`MongoDB connected: ${conn.connection.host}`);
  } catch (err) {
    console.error("Failed to connect to MongoDB", err);
    process.exit(1);
  }
};


