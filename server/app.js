

const express = require("express");
const cors = require("cors");
const cookieParser = require("cookie-parser");
const { requireAuth } = require("./middlewares/authMiddleware");

const app = express();

app.set('trust proxy', 1);

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

module.exports = app;
