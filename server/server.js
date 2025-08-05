// server/server.js

const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const dotenv = require('dotenv');
const resumeRoutes = require('./routes/resumeRoutes');

// ====== Load Environment Variables ======
dotenv.config();

const app = express();
const PORT = process.env.PORT || 5001;
const MONGO_URI = process.env.MONGO_URI;

// ====== Middleware ======
app.use(cors());
app.use(express.json());

// ====== Dev Logging Middleware ======
if (process.env.NODE_ENV !== 'production') {
  app.use((req, res, next) => {
    console.log(`[${req.method}] ${req.url}`);
    next();
  });
}

// ====== API Routes ======
app.use('/api/resumes', resumeRoutes);

// ====== Health Check ======
app.get('/', (req, res) => {
  res.send('🚀 AI Resume Builder API is running');
});

// ====== Fallback 404 ======
app.use((req, res) => {
  res.status(404).json({ message: '❌ Route not found' });
});

// ====== Optional Debug Route: Shows DB Name + Collections ======
app.get('/debug-db', async (req, res) => {
  try {
    const db = mongoose.connection.db;
    const collections = await db.listCollections().toArray();
    res.json({
      dbName: db.databaseName,
      collections: collections.map(c => c.name),
    });
  } catch (err) {
    res.status(500).json({ error: 'Unable to fetch DB info' });
  }
});

// ====== Connect to MongoDB and Start Server ======
(async () => {
  try {
    const safeUri = MONGO_URI.replace(/:(.*)@/, ':*****@');
    console.log('Connecting to MongoDB with URI:', safeUri);

    await mongoose.connect(MONGO_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });

    console.log('✅ MongoDB connected');

    app.listen(PORT, () => {
      console.log(`🚀 Server running at http://localhost:${PORT}`);
    });
  } catch (err) {
    console.error('❌ MongoDB connection error:', err.message);
    process.exit(1);
  }
})();
