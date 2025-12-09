// server/server.js

const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const dotenv = require("dotenv");
const cookieParser = require("cookie-parser");
const { clerkMiddleware, getAuth, clerkClient } = require("@clerk/express");
const User = require("./models/User");

const resumeRoutes = require("./routes/resumeRoutes");
const aiRoutes = require("./routes/aiRoutes");
const { attachUser } = require("./middlewares/authMiddleware");

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
      "https://capable-churros-e51954.netlify.app", // Add your frontend domain
    ],
    credentials: true,
    methods: ["GET", "POST", "PUT", "DELETE"],
    allowedHeaders: ["Content-Type", "Authorization"],
  })
);

app.use(express.json({ limit: "10mb" }));
app.use(cookieParser());


// ✅ APPLY CLERK PROTECTION ONLY TO RESUME ROUTES
app.use(
  "/api/resumes",
  clerkMiddleware({ jwtKey: process.env.CLERK_JWT_KEY }),
  attachUser,
  resumeRoutes
);

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
