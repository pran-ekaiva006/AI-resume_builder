// server/server.js

const dotenv = require("dotenv");
dotenv.config();

// ── Fail-fast: required environment variables ───────────────────────────────
// In production all critical variables MUST be set before we do anything else.
// In development, missing variables are allowed but a visible warning is printed.
const REQUIRED_SECRETS = [
  'ACCESS_TOKEN_SECRET',
  'REFRESH_TOKEN_SECRET',
  'MONGO_URI',
  'GEMINI_API_KEY',
  'CLIENT_URL',
  'GOOGLE_CLIENT_ID',
];

if (process.env.NODE_ENV === 'production') {
  const missing = REQUIRED_SECRETS.filter((k) => !process.env[k]);
  if (missing.length) {
    console.error(
      `\n🚨 FATAL: The following environment variables must be set in production:\n` +
      missing.map((k) => `   • ${k}`).join('\n') +
      '\nShutting down.\n',
    );
    process.exit(1);
  }
} else {
  const missing = REQUIRED_SECRETS.filter((k) => !process.env[k]);
  if (missing.length) {
    console.warn(
      `\n⚠️  WARNING: ${missing.join(', ')} ${missing.length === 1 ? 'is' : 'are'} not set. ` +
      'Using insecure dev fallback(s). Set these before deploying to production.\n',
    );
  }
}

const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const cookieParser = require("cookie-parser");
const axios = require("axios");
const User = require("./models/User");
const Resume = require("./models/Resume");

const resumeRoutes = require("./routes/resumeRoutes");
const aiRoutes = require("./routes/aiRoutes");
const { requireAuth } = require("./middlewares/authMiddleware");
const app = express();

// Trust Render's reverse proxy so rate limiters and IP logic
// see the real client IP (from X-Forwarded-For), not the proxy IP.
app.set('trust proxy', 1);

const PORT = process.env.PORT || 5001;
const MONGO_URI = process.env.MONGO_URI;

// ✅ CORS config
app.use(
  cors({
    origin: [
      "http://localhost:5173",
      "https://ai-resume-builder-6-o5vo.onrender.com",
      "https://capable-churros-e51954.netlify.app",
    ],
    credentials: true,
    methods: ["GET", "POST", "PUT", "DELETE"],
    allowedHeaders: ["Content-Type", "Authorization"],
  })
);

app.use(express.json({ limit: "10mb" }));
app.use(cookieParser());


// ✅ PUBLIC RESUME ROUTE (no auth required — for recruiter sharing)
const { getPublicResume } = require("./controllers/resumeController");
app.get("/api/resumes/public/:resumeId", getPublicResume);

// ✅ APPLY AUTH PROTECTION TO RESUME ROUTES
app.use(
  "/api/resumes",
  requireAuth,
  resumeRoutes
);

const authRoutes = require("./routes/authRoutes");
app.use("/api/auth", authRoutes);

// ✅ AI ROUTES NOW REQUIRE AUTH
app.use("/api/ai", requireAuth, aiRoutes);


// 🔥 Health check
app.get("/", (_, res) => {
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

// 🚨 404 handler
app.use((req, res) => {
  if (process.env.NODE_ENV !== "production") console.log(`❌ 404 - Route not found: ${req.method} ${req.url}`);
  res.status(404).json({ message: "❌ Route not found" });
});

// ✅ Keep server awake on Render free tier
if (process.env.NODE_ENV === "production") {
  setInterval(async () => {
    try {
      await axios.get(`${process.env.RENDER_EXTERNAL_URL || 'http://localhost:5001'}/`);
      if (process.env.NODE_ENV !== "production") console.log("⏰ Keep-alive ping sent");
    } catch (err) {
      console.error("Keep-alive ping failed:", err.message);
    }
  }, 14 * 60 * 1000); // Every 14 minutes
}

// 🧹 Demo Account Cleanup Task (Runs every hour)
setInterval(async () => {
  try {
    const twentyFourHoursAgo = new Date(Date.now() - 24 * 60 * 60 * 1000);
    
    // Find all demo users older than 24 hours
    const expiredDemoUsers = await User.find({
      isDemo: true,
      createdAt: { $lt: twentyFourHoursAgo }
    });

    if (expiredDemoUsers.length > 0) {
      const userIds = expiredDemoUsers.map(user => user._id);
      
      // Cascade delete Resumes
      const resumeResult = await Resume.deleteMany({ userId: { $in: userIds } });
      // Delete Users
      const userResult = await User.deleteMany({ _id: { $in: userIds } });
      
      console.log(`🧹 Cleanup complete: Deleted ${userResult.deletedCount} demo users and ${resumeResult.deletedCount} resumes.`);
    }
  } catch (err) {
    console.error("🧹 Demo cleanup failed:", err.message);
  }
}, 60 * 60 * 1000); // Every hour

// ✅ DB Connection & Server start
(async () => {
  try {
    await mongoose.connect(MONGO_URI);
    console.log("✅ MongoDB connected successfully");

    app.listen(PORT, () =>
      console.log(`🚀 Server running on port ${PORT}`)
    );
  } catch (error) {
    console.error("❌ MongoDB error:", error.message);
    process.exit(1);
  }
})();
