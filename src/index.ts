import express from "express";
import cors from "cors";
import helmet from "helmet";
import compression from "compression";
import rateLimit from "express-rate-limit";
import surahRoutes from "./routes/surahRoutes";
import searchRoutes from "./routes/searchRoutes";
import { errorHandler } from "./middleware/errorHandler";

const app = express();

// Security middleware
app.use(
  helmet({
    crossOriginResourcePolicy: { policy: "cross-origin" },
  }),
);

// CORS configuration
app.use(
  cors({
    origin: process.env.FRONTEND_URL || "*",
    credentials: true,
    methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization"],
  }),
);

// Compression
app.use(compression());

// Rate limiting (adjusted for serverless)
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100,
  message: "Too many requests from this IP",
  standardHeaders: true,
  legacyHeaders: false,
});
app.use("/api/", limiter);

// Body parsing
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Health check endpoint
app.get("/health", (req, res) => {
  res.status(200).json({
    status: "healthy",
    timestamp: new Date().toISOString(),
    environment: process.env.NODE_ENV || "development",
  });
});

// Root endpoint
app.get("/", (req, res) => {
  res.json({
    name: "Quran API",
    version: "1.0.0",
    status: "running",
    endpoints: {
      surahs: "/api/surahs",
      surahById: "/api/surahs/:id",
      search: "/api/search?q=query",
    },
  });
});

// API Routes
app.use("/api/surahs", surahRoutes);
app.use("/api/search", searchRoutes);

// 404 handler
app.use((req, res) => {
  res.status(404).json({
    success: false,
    error: "Endpoint not found",
  });
});

// Error handling
app.use(errorHandler);

// Export for Vercel (instead of app.listen)
export default app;
