/**
 * server/__tests__/demoLogin.test.js
 *
 * Integration tests for the demo login endpoint.
 * Uses the shared in-memory MongoDB setup from setup.js.
 */

'use strict';

const request = require('supertest');
const app = require('./testApp');
const User = require('../models/User');
const Resume = require('../models/Resume');

describe('Demo Login API', () => {
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
