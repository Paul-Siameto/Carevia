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
import billingRoutes from "./routes/billing.js";

dotenv.config();

const app = express();

// Connect to MongoDB
connectDB();

// Middleware
app.use(morgan(process.env.NODE_ENV === "production" ? "combined" : "dev"));
app.use(express.json());
app.use(cookieParser());

// Build allowed origins list
const allowedOrigins = new Set();

// Add CLIENT_ORIGINS if set (comma-separated)
if (process.env.CLIENT_ORIGINS) {
  process.env.CLIENT_ORIGINS.split(",").forEach((origin) => {
    const trimmed = origin.trim();
    if (trimmed) allowedOrigins.add(trimmed);
  });
}

// Add CLIENT_URL if set
if (process.env.CLIENT_URL) {
  allowedOrigins.add(process.env.CLIENT_URL.trim());
}

// In development, always allow both common Vite ports
if (process.env.NODE_ENV !== "production") {
  allowedOrigins.add("http://localhost:5173");
  allowedOrigins.add("http://localhost:5174");
}

// If no origins were configured, use defaults
if (allowedOrigins.size === 0) {
  allowedOrigins.add("http://localhost:5173");
  allowedOrigins.add("http://localhost:5174");
}

console.log("Allowed CORS origins:", Array.from(allowedOrigins));

app.use(
  cors({
    origin(origin, callback) {
      // Allow requests with no origin (like mobile apps or curl requests)
      if (!origin) {
        return callback(null, true);
      }
      
      // Check if origin is in allowed set
      if (allowedOrigins.has(origin)) {
        return callback(null, true);
      }
      
      // Log for debugging
      console.log(`CORS blocked origin: ${origin}. Allowed:`, Array.from(allowedOrigins));
      return callback(new Error(`Origin ${origin} not allowed by CORS`));
    },
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
app.use("/api/billing", billingRoutes);

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



