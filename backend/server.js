import express from "express";
import dotenv from "dotenv";
import morgan from "morgan";
import cors from "cors";
import cookieParser from "cookie-parser";
import { connectDB } from "./config/db.js";

import authRoutes from "./routes/auth.js";
import userRoutes from "./routes/users.js";
import healthRoutes from "./routes/health.js";
import moodRoutes from "./routes/mood.js";
import articleRoutes from "./routes/articles.js";
import aiRoutes from "./routes/ai.js";
import privacyRoutes from "./routes/privacy.js";

dotenv.config();

const app = express();

// Connect to MongoDB
connectDB();

// Middleware
app.use(morgan(process.env.NODE_ENV === "production" ? "combined" : "dev"));
app.use(express.json());
app.use(cookieParser());
app.use(
  cors({
    origin: process.env.CLIENT_URL || "http://localhost:5173",
    credentials: true,
  })
);

// Health endpoint
app.get("/api/healthz", (req, res) => {
  res.json({ status: "ok", timestamp: new Date().toISOString() });
});

// Routes
app.use("/api/auth", authRoutes);
app.use("/api/users", userRoutes);
app.use("/api/health", healthRoutes);
app.use("/api/mood", moodRoutes);
app.use("/api/articles", articleRoutes);
app.use("/api/ai", aiRoutes);
app.use("/api/privacy", privacyRoutes);

// 404 handler
app.use((req, res, next) => {
  res.status(404).json({ message: "Not Found" });
});

// Error handler
// eslint-disable-next-line no-unused-vars
app.use((err, req, res, next) => {
  console.error(err);
  res.status(err.status || 500).json({ message: err.message || "Server error" });
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Carevia backend running on port ${PORT}`);
});

