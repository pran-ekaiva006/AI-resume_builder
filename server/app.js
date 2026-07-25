// server/app.js
//
// Express application — routes, middleware, error handlers.
//
// This file is imported by:
//   • api/index.js  (Vercel serverless entry point)
//   • server.js     (local development with app.listen())
//   • __tests__/    (Jest tests via testApp.js)

const express = require("express");
const cors = require("cors");
const cookieParser = require("cookie-parser");
const connectDB = require("./lib/connectDB");
const { requireAuth } = require("./middlewares/authMiddleware");

const app = express();

app.set('trust proxy', 1);

// ── CORS config ──────────────────────────────────────────────────────────
// Reads CLIENT_URL from environment so the allowed origin is configurable
// per deployment without code changes. Keeps localhost for local dev.
const allowedOrigins = [
  "http://localhost:5173",
];

if (process.env.CLIENT_URL) {
  allowedOrigins.push(process.env.CLIENT_URL);
}

app.use(
  cors({
    origin: allowedOrigins,
    credentials: true,
    methods: ["GET", "POST", "PUT", "DELETE"],
    allowedHeaders: ["Content-Type", "Authorization"],
  })
);

app.use(express.json({ limit: "10mb" }));
app.use(cookieParser());

// ── Ensure MongoDB is connected before any route handler ─────────────────
// In serverless (Vercel), there is no persistent process, so the DB
// connection must be established (or reused) on every invocation.
app.use(async (req, res, next) => {
  try {
    await connectDB();
    next();
  } catch (err) {
    console.error("❌ MongoDB connection failed:", err.message);
    res.status(503).json({
      success: false,
      message: "Database connection failed. Please try again shortly.",
    });
  }
});

// ── Routes ───────────────────────────────────────────────────────────────

// ✅ PUBLIC RESUME ROUTE (no auth required — for recruiter sharing)
const { getPublicResume } = require("./controllers/resumeController");
app.get("/api/resumes/public/:resumeId", getPublicResume);

// ✅ APPLY AUTH PROTECTION TO RESUME ROUTES
const resumeRoutes = require("./routes/resumeRoutes");
app.use(
  "/api/resumes",
  requireAuth,
  resumeRoutes
);

const authRoutes = require("./routes/authRoutes");
app.use("/api/auth", authRoutes);

// ✅ AI ROUTES NOW REQUIRE AUTH
const aiRoutes = require("./routes/aiRoutes");
app.use("/api/ai", requireAuth, aiRoutes);

// ✅ CRON ROUTES (protected by CRON_SECRET, not user auth)
const cronRoutes = require("./routes/cronRoutes");
app.use("/api/cron", cronRoutes);

// 🔥 Health check
app.get("/api/health", (_, res) => {
  res.send("🚀 API Running Successfully");
});

// 🚨 Global error handler
app.use((err, req, res, next) => {
  console.error("🔥 Server Error:", err);
  console.error("Stack:", err.stack);

  res.status(err.status || 500).json({
    success: false,
    message: err.message || "Internal Server Error",
    ...(process.env.NODE_ENV === "development" && { stack: err.stack }),
  });
});

// 🚨 404 handler for API routes
app.use("/api", (req, res) => {
  if (process.env.NODE_ENV !== "production") console.log(`❌ 404 - API Route not found: ${req.method} ${req.url}`);
  res.status(404).json({ message: "❌ API Route not found" });
});

// ── Root fallback ────────────────────────────────────────────────────────
// No static file serving — the frontend is deployed separately.
app.get("/", (_, res) => {
  res.json({
    success: true,
    message: "AI Resume Builder API",
    docs: "All API routes are under /api/*",
  });
});

module.exports = app;
