/**
 * server/__tests__/resumeOwnership.test.js
 *
 * Tests the ownership boundaries for Resume CRUD operations.
 * Ensures users cannot access, modify, or delete resumes they do not own.
 */

'use strict';

const request = require('supertest');
const app = require('./testApp');
const User = require('../models/User');
const Resume = require('../models/Resume');

// Helper to sign up and get cookies
async function createUserAndGetCookies(ip, email) {
  const res = await request(app)
    .post('/api/auth/signup')
    .set('X-Forwarded-For', ip)
    .send({
      firstName: 'Test',
      lastName: 'User',
      email,
      password: 'SecurePass123!',
    });
  
  if (res.status !== 201) {
    throw new Error(`Failed to create user ${email}: ${res.status}`);
  }

  const cookiesArray = res.headers['set-cookie'];
  const cookiesStr = cookiesArray.map(c => c.split(';')[0]).join('; ');
  
  const user = await User.findOne({ email });
  return { cookies: cookiesStr, user };
}

// Helper to create a resume for a user
async function createResume(cookies, title) {
  const res = await request(app)
    .post('/api/resumes')
    .set('Cookie', cookies)
    .send({
      title,
      firstName: 'John',
      lastName: 'Doe',
      userEmail: 'dummy@example.com'
    });
  
  if (res.status !== 201) {
    throw new Error(`Failed to create resume: ${res.status} - ${JSON.stringify(res.body)}`);
  }
  
  return res.body.resume;
}

describe('Resume Ownership Boundaries', () => {
  let userA, cookiesA;
  let userB, cookiesB;
  let resumeA;

  beforeEach(async () => {
    // 1. Create two separate users
    const resA = await createUserAndGetCookies('10.10.1.1', 'usera@example.com');
    userA = resA.user;
    cookiesA = resA.cookies;

    const resB = await createUserAndGetCookies('10.10.1.2', 'userb@example.com');
    userB = resB.user;
    cookiesB = resB.cookies;

    // 2. User A creates a resume
    resumeA = await createResume(cookiesA, "User A's Resume");
  });

  // -------------------------------------------------------------------------
  // Cross-User Access (GET, PUT, DELETE)
  // -------------------------------------------------------------------------
  describe('User B attempting to access User A\'s resume', () => {
    it('GET returns 404 (not found or unauthorized)', async () => {
      const res = await request(app)
        .get(`/api/resumes/${resumeA.resumeId}`)
        .set('Cookie', cookiesB);

      expect(res.status).toBe(404);
      expect(res.body.message).toBe('Resume not found or unauthorized');
    });

    it('PUT returns 404', async () => {
      const res = await request(app)
        .put(`/api/resumes/${resumeA.resumeId}`)
        .set('Cookie', cookiesB)
        .send({ title: 'Hacked by User B' });

      expect(res.status).toBe(404);
      expect(res.body.message).toBe('Resume not found or unauthorized');
    });

    it('DELETE returns 404', async () => {
      const res = await request(app)
        .delete(`/api/resumes/${resumeA.resumeId}`)
        .set('Cookie', cookiesB);

      expect(res.status).toBe(404);
      expect(res.body.message).toBe('Resume not found or unauthorized');
    });
  });

  // -------------------------------------------------------------------------
  // GET /api/resumes Collection Isolation
  // -------------------------------------------------------------------------
  describe('GET /api/resumes (Collection)', () => {
    it('returns only the requesting user\'s resumes', async () => {
      // User B creates a resume
      const resumeB = await createResume(cookiesB, "User B's Resume");

      // User A fetches their resumes
      const resA = await request(app)
        .get('/api/resumes')
        .set('Cookie', cookiesA);
      
      expect(resA.status).toBe(200);
      expect(resA.body.data.length).toBe(1);
      expect(resA.body.data[0].resumeId).toBe(resumeA.resumeId);

      // User B fetches their resumes
      const resB = await request(app)
        .get('/api/resumes')
        .set('Cookie', cookiesB);
      
      expect(resB.status).toBe(200);
      expect(resB.body.data.length).toBe(1);
      expect(resB.body.data[0].resumeId).toBe(resumeB.resumeId);
    });
  });

  // -------------------------------------------------------------------------
  // DELETE Operation
  // -------------------------------------------------------------------------
  describe('DELETE /api/resumes/:resumeId', () => {
    it('removes the resume for the owner, and a subsequent GET returns 404', async () => {
      // 1. User A deletes their own resume
      const delRes = await request(app)
        .delete(`/api/resumes/${resumeA.resumeId}`)
        .set('Cookie', cookiesA);
      
      expect(delRes.status).toBe(200);
      expect(delRes.body.success).toBe(true);

      // 2. Subsequent GET returns 404
      const getRes = await request(app)
        .get(`/api/resumes/${resumeA.resumeId}`)
        .set('Cookie', cookiesA);
      
      expect(getRes.status).toBe(404);
      expect(getRes.body.message).toBe('Resume not found or unauthorized');

      // 3. Verify it is actually gone from the database
      const dbResume = await Resume.findOne({ resumeId: resumeA.resumeId });
      expect(dbResume).toBeNull();
    });
  });
});
