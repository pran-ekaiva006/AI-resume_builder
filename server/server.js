// server/server.js

const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const dotenv = require("dotenv");
const cookieParser = require("cookie-parser");
const { clerkMiddleware } = require("@clerk/express");

const resumeRoutes = require("./routes/resumeRoutes");
const aiRoutes = require("./routes/aiRoutes");
const { attachUser } = require("./middlewares/authMiddleware");

dotenv.config();
const app = express();

const PORT = process.env.PORT || 5001;
const MONGO_URI = process.env.MONGO_URI;

// ✅ CORS
app.use(
  cors({
    origin: [
      "http://localhost:5173",
      "https://ai-resume-builder-6-o5vo.onrender.com",
    ],
    credentials: true,
    methods: ["GET", "POST", "PUT", "DELETE"],
    allowedHeaders: ["Content-Type", "Authorization"],
  })
);

app.use(express.json({ limit: "10mb" }));
app.use(cookieParser());

// ✅ Clerk middleware (with JWT key)
app.use(
  clerkMiddleware({
    jwtKey: process.env.CLERK_JWT_KEY,
  })
);

// ✅ Attach req.user (maps Clerk → Mongo user)
app.use(attachUser);

// ✅ API routes
app.use("/api/resumes", resumeRoutes);
app.use("/api/ai", aiRoutes);

// Health check
app.get("/", (_, res) => {
  res.send("🚀 API Running Successfully");
});

// 404
app.use((_, res) => res.status(404).json({ message: "❌ Route not found" }));

// ✅ Connect DB + start server
(async () => {
  try {
    await mongoose.connect(MONGO_URI);
    console.log("✅ MongoDB connected successfully");

    app.listen(PORT, () => console.log(`🚀 Server running on port ${PORT}`));
  } catch (error) {
    console.error("❌ MongoDB error:", error.message);
    process.exit(1);
  }
})();
