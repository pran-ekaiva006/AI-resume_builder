/**
 * server/__tests__/resumeController.test.js
 *
 * Integration tests for updateResumeByResumeId — verifies that the allow-list
 * patch prevents mass-assignment of identity fields (userId, resumeId) while
 * still allowing legitimate field updates (title, etc.).
 *
 * Uses the shared in-memory MongoDB setup from setup.js. Builds a minimal
 * Express app with a fake auth middleware so we can control req.user directly.
 */

'use strict';

const express = require('express');
const mongoose = require('mongoose');
const request = require('supertest');

const Resume = require('../models/Resume');
const resumeController = require('../controllers/resumeController');

// ---------------------------------------------------------------------------
// Build a test app that mounts the resume PUT route with a fake auth middleware
// that injects req.user without hitting a real JWT / User collection.
// ---------------------------------------------------------------------------
function buildApp(fakeUser) {
  const app = express();
  app.set('trust proxy', 1);
  app.use(express.json());

  // Fake auth: inject whatever user the test provides
  app.use((req, _res, next) => {
    req.user = fakeUser;
    next();
  });

  // Mount only the routes we need for this test suite
  app.put('/api/resumes/:resumeId', resumeController.updateResumeByResumeId);

  return app;
}

// ---------------------------------------------------------------------------
// Tests
// ---------------------------------------------------------------------------
describe('updateResumeByResumeId — mass-assignment protection', () => {
  it('does NOT overwrite userId or resumeId when they are sent in the body, but DOES update title', async () => {
    // ── 1. Create a resume as "User A" ──────────────────────────────────────
    const userAId = new mongoose.Types.ObjectId();
    const originalDoc = await Resume.create({
      userId: userAId,
      userEmail: 'usera@example.com',
      title: 'Original Title',
    });

    const originalResumeId = originalDoc.resumeId;   // UUID auto-generated
    const originalUserId = originalDoc.userId.toString();

    // ── 2. Build app authenticated as User A ────────────────────────────────
    const app = buildApp({ id: userAId.toString(), email: 'usera@example.com' });

    // ── 3. PUT with attack payload: attempt to overwrite identity fields ─────
    const attackPayload = {
      title: 'Updated Title',          // legitimate — should succeed
      userId: new mongoose.Types.ObjectId().toString(), // attack — must be ignored
      resumeId: 'fake-resume-id-9999', // attack — must be ignored
    };

    const res = await request(app)
      .put(`/api/resumes/${originalResumeId}`)
      .send(attackPayload);

    expect(res.status).toBe(200);
    expect(res.body.success).toBe(true);

    // ── 4. Reload from DB and assert identity fields are unchanged ───────────
    const stored = await Resume.findById(originalDoc._id).lean();

    // Identity fields must be unchanged
    expect(stored.userId.toString()).toBe(originalUserId);
    expect(stored.resumeId).toBe(originalResumeId);

    // Legitimate field must have updated
    expect(stored.title).toBe('Updated Title');
  });

  it('also updates userEmail field that is NOT in the allow-list without affecting stored value', async () => {
    const userAId = new mongoose.Types.ObjectId();
    const doc = await Resume.create({
      userId: userAId,
      userEmail: 'usera@example.com',
      title: 'Resume X',
    });

    const app = buildApp({ id: userAId.toString(), email: 'usera@example.com' });

    const res = await request(app)
      .put(`/api/resumes/${doc.resumeId}`)
      .send({
        title: 'Resume X — edited',
        userEmail: 'hacker@evil.com', // NOT in allow-list — should be silently ignored
      });

    expect(res.status).toBe(200);

    const stored = await Resume.findById(doc._id).lean();
    expect(stored.title).toBe('Resume X — edited');   // allowed field updated ✓
    expect(stored.userEmail).toBe('usera@example.com'); // protected field unchanged ✓
  });

  it('returns 404 when resumeId does not belong to the authenticated user', async () => {
    const userAId = new mongoose.Types.ObjectId();
    const userBId = new mongoose.Types.ObjectId();

    const doc = await Resume.create({
      userId: userAId,
      userEmail: 'usera@example.com',
      title: 'A private resume',
    });

    // App authenticated as User B trying to update User A's resume
    const app = buildApp({ id: userBId.toString(), email: 'userb@example.com' });

    const res = await request(app)
      .put(`/api/resumes/${doc.resumeId}`)
      .send({ title: 'Stolen!' });

    expect(res.status).toBe(404);

    const stored = await Resume.findById(doc._id).lean();
    expect(stored.title).toBe('A private resume'); // untouched ✓
  });
});
