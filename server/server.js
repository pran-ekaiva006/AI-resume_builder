// server/server.js

const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const dotenv = require('dotenv');
const cookieParser = require('cookie-parser');
const { clerkMiddleware } = require('@clerk/express'); // ✅ Import Clerk middleware

const resumeRoutes = require('./routes/resumeRoutes');
const { attachUser } = require('./middlewares/authMiddleware'); // ✅ Import your attachUser middleware

// ====== Load Environment Variables ======
dotenv.config();

const app = express();
const PORT = process.env.PORT || 5001;
const MONGO_URI = process.env.MONGO_URI;

// ====== Middleware ======
app.use(cors({
  origin: [
    'http://localhost:5173',
    'https://ai-resume-builder-6-o5vo.onrender.com'
  ],
  credentials: true,
}));
app.use(express.json());
app.use(cookieParser());

// ✅ Clerk middleware MUST be before any getAuth/attachUser usage
app.use(clerkMiddleware());

// ✅ Then attach user info (depends on Clerk)
app.use(attachUser);

// ====== API Routes ======
app.use('/api/resumes', resumeRoutes);

// ====== Health Check ======
app.get('/', (req, res) => {
  res.send('🚀 AI Resume Builder API is running successfully');
});

// ====== 404 Handler ======
app.use((req, res) => {
  res.status(404).json({ message: '❌ Route not found' });
});

// ====== MongoDB Connection + Start Server ======
(async () => {
  try {
    const safeUri = MONGO_URI.replace(/:(.*)@/, ':*****@');
    console.log('Connecting to MongoDB with URI:', safeUri);

    await mongoose.connect(MONGO_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });

    console.log('✅ MongoDB connected successfully');

    app.listen(PORT, () => {
      console.log(`🚀 Server running on port ${PORT}`);
    });
  } catch (err) {
    console.error('❌ MongoDB connection error:', err.message);
    process.exit(1);
  }
})();
