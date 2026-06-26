// server/server.js

const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const dotenv = require("dotenv");
const cookieParser = require("cookie-parser");
const axios = require("axios");

const resumeRoutes = require("./routes/resumeRoutes");
const aiRoutes = require("./routes/aiRoutes");
const { requireAuth } = require("./middlewares/authMiddleware");

dotenv.config();
const app = express();

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

// ✅ AI ROUTES DO NOT REQUIRE AUTH
app.use("/api/ai", aiRoutes);


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
  console.log(`❌ 404 - Route not found: ${req.method} ${req.url}`);
  res.status(404).json({ message: "❌ Route not found" });
});

// ✅ Keep server awake on Render free tier
if (process.env.NODE_ENV === "production") {
  setInterval(async () => {
    try {
      await axios.get(`${process.env.RENDER_EXTERNAL_URL || 'http://localhost:5001'}/`);
      console.log("⏰ Keep-alive ping sent");
    } catch (err) {
      console.error("Keep-alive ping failed:", err.message);
    }
  }, 14 * 60 * 1000); // Every 14 minutes
}

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
