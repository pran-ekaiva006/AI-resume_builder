// server/server.js

const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const resumeRoutes = require("./routes/resumeRoutes");

const app = express();
const PORT = 5001;

// ====== Middleware ======
app.use(cors());
app.use(express.json());

// ====== Routes ======
app.use("/api/resumes", resumeRoutes);

// Optional: basic health check route
app.get("/", (req, res) => {
  res.send("🚀 AI Resume Builder API is running");
});

// ====== Database Connection ======
mongoose
  .connect("mongodb://localhost:27017/ai-resume-builder", {
    // No longer need useNewUrlParser / useUnifiedTopology in Mongoose 6+
  })
  .then(() => {
    console.log("✅ MongoDB connected");
    app.listen(PORT, () =>
      console.log(`🚀 Server running at http://localhost:${PORT}`)
    );
  })
  .catch((err) => {
    console.error("❌ MongoDB connection error:", err.message);
  });
