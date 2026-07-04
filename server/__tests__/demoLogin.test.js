require('dotenv').config();
const request = require('supertest');
const express = require('express');
const mongoose = require('mongoose');
const cookieParser = require('cookie-parser');
const authRoutes = require('../routes/authRoutes');
const User = require('../models/User');
const Resume = require('../models/Resume');
const { verifyAccessToken } = require('../utils/tokenUtils');
const { requireAuth } = require('../middlewares/authMiddleware');

const app = express();
app.use(express.json());
app.use(cookieParser());
app.use('/api/auth', authRoutes);

describe('Demo Login API', () => {
  beforeAll(async () => {
    // We expect the mongo setup/teardown to be handled via global hooks or similar,
    // but just in case, we will connect to a test db if not connected.
    if (mongoose.connection.readyState === 0) {
      await mongoose.connect(process.env.MONGO_URI || 'mongodb://127.0.0.1:27017/resumeBuilderTest');
    }
  });

  afterAll(async () => {
    await User.deleteMany({ isDemo: true });
    await Resume.deleteMany({ firstName: 'Demo' });
    if (mongoose.connection.readyState !== 0) {
      await mongoose.disconnect();
    }
  });

  it('should create a demo user, issue cookies, and create a demo resume', async () => {
    const res = await request(app)
      .post('/api/auth/demo-login')
      .expect(200);

    expect(res.body.success).toBe(true);
    expect(res.body.user).toBeDefined();
    expect(res.body.user.firstName).toBe('Demo');
    expect(res.body.user.isDemo).toBe(true);

    // Verify cookies
    const cookies = res.headers['set-cookie'];
    expect(cookies).toBeDefined();
    const hasAccess = cookies.some(c => c.startsWith('accessToken='));
    const hasRefresh = cookies.some(c => c.startsWith('refreshToken='));
    expect(hasAccess).toBe(true);
    expect(hasRefresh).toBe(true);

    // Verify Resume document
    const resume = await Resume.findOne({ userId: res.body.user.id });
    expect(resume).toBeDefined();
    expect(resume.title).toBe('Demo Resume');
    expect(resume.skills.length).toBeGreaterThan(0);

    // Verify GET /api/auth/me
    const meRes = await request(app)
      .get('/api/auth/me')
      .set('Cookie', cookies)
      .expect(200);

    expect(meRes.body.success).toBe(true);
    expect(meRes.body.user.email).toBe(res.body.user.email);
  });
});
