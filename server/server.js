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

// ✅ CORS config
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

// 🚨 Global error handler (add before the 404 handler)
app.use((err, req, res, next) => {
  console.error("🔥 Server Error:", err);
  res.status(500).json({
    success: false,
    message: err.message || "Internal Server Error",
    stack: process.env.NODE_ENV === "development" ? err.stack : undefined,
  });
});

// 🚨 404 handler
app.use((_, res) => res.status(404).json({ message: "❌ Route not found" }));

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

const attachUser = async (req, res, next) => {
  try {
    const { userId } = getAuth(req);

    if (!userId) {
      console.error("❌ No Clerk userId found in request");
      return res.status(401).json({ message: "Unauthorized: No Clerk user found" });
    }

    console.log("✅ Clerk userId:", userId);

    let email = null;
    try {
      const clerkUser = await clerkClient.users.getUser(userId);
      email = clerkUser?.emailAddresses?.[0]?.emailAddress || null;
    } catch (clerkErr) {
      console.error("⚠️ Failed to fetch Clerk user details:", clerkErr.message);
    }

    let user = await User.findOne({ clerkId: userId });
    if (!user) {
      console.log("🆕 Creating new user in DB");
      user = await User.create({ clerkId: userId, email, role: "user" });
    }

    req.user = {
      clerkId: userId,
      email,
      role: user.role || "user",
    };

    console.log("✅ User attached to req:", req.user);
    return next();
  } catch (err) {
    console.error("🔥 Auth Middleware Error:", err);
    return res.status(401).json({ message: "Unauthorized: auth failed" });
  }
};
