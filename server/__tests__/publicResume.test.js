/**
 * server/__tests__/publicResume.test.js
 *
 * Tests the isPublic gate on GET /api/resumes/public/:resumeId:
 *  - Returns 404 when isPublic is false (default)
 *  - Returns 200 with resume body when isPublic is true
 *  - Strips sensitive fields (userId, userEmail, isPublic) from the public response
 *
 * Uses mongodb-memory-server — no live DB required.
 */

'use strict';

const express = require('express');
const mongoose = require('mongoose');
const { MongoMemoryServer } = require('mongodb-memory-server');
const request = require('supertest');

const Resume = require('../models/Resume');
const resumeController = require('../controllers/resumeController');

// ---------------------------------------------------------------------------
// Minimal Express app — only mounts the public GET route (no auth needed)
// ---------------------------------------------------------------------------
function buildApp() {
  const app = express();
  app.set('trust proxy', 1);
  app.use(express.json());

  app.get('/api/resumes/public/:resumeId', resumeController.getPublicResume);

  return app;
}

// ---------------------------------------------------------------------------
// In-memory MongoDB lifecycle
// ---------------------------------------------------------------------------
let mongod;

beforeAll(async () => {
  mongod = await MongoMemoryServer.create();
  await mongoose.connect(mongod.getUri());
});

afterAll(async () => {
  await mongoose.disconnect();
  await mongod.stop();
});

afterEach(async () => {
  await Resume.deleteMany({});
});

// ---------------------------------------------------------------------------
// Tests
// ---------------------------------------------------------------------------
describe('GET /api/resumes/public/:resumeId — isPublic gate', () => {
  it('returns 404 when isPublic is false (default — resume exists but is private)', async () => {
    const userId = new mongoose.Types.ObjectId();
    const doc = await Resume.create({
      userId,
      userEmail: 'owner@example.com',
      title: 'Private Resume',
      // isPublic defaults to false
    });

    const app = buildApp();
    const res = await request(app).get(`/api/resumes/public/${doc.resumeId}`);

    expect(res.status).toBe(404);
    // Response must be identical to "doesn't exist" — no privacy leakage
    expect(res.body.success).toBe(false);
    expect(res.body.message).toBe('Resume not found');
  });

  it('returns 404 for a resumeId that does not exist at all', async () => {
    const app = buildApp();
    const res = await request(app).get('/api/resumes/public/nonexistent-uuid-9999');

    expect(res.status).toBe(404);
    expect(res.body.message).toBe('Resume not found');
  });

  it('returns 200 with the resume body when isPublic is true', async () => {
    const userId = new mongoose.Types.ObjectId();
    const doc = await Resume.create({
      userId,
      userEmail: 'owner@example.com',
      title: 'Public Resume',
      firstName: 'Ada',
      lastName: 'Lovelace',
      isPublic: true,
    });

    const app = buildApp();
    const res = await request(app).get(`/api/resumes/public/${doc.resumeId}`);

    expect(res.status).toBe(200);
    expect(res.body.success).toBe(true);
    expect(res.body.data.title).toBe('Public Resume');
    expect(res.body.data.firstName).toBe('Ada');
  });

  it('strips userId, userEmail, isPublic and __v from the public response', async () => {
    const userId = new mongoose.Types.ObjectId();
    const doc = await Resume.create({
      userId,
      userEmail: 'owner@example.com',
      title: 'Shared Resume',
      isPublic: true,
    });

    const app = buildApp();
    const res = await request(app).get(`/api/resumes/public/${doc.resumeId}`);

    expect(res.status).toBe(200);

    const data = res.body.data;
    expect(data.userId).toBeUndefined();
    expect(data.userEmail).toBeUndefined();
    expect(data.isPublic).toBeUndefined();
    expect(data.__v).toBeUndefined();
  });

  it('returns 404 after isPublic is switched back to false', async () => {
    const userId = new mongoose.Types.ObjectId();
    const doc = await Resume.create({
      userId,
      userEmail: 'owner@example.com',
      title: 'Toggled Resume',
      isPublic: true,
    });

    const app = buildApp();

    // Confirm it's publicly accessible first
    const before = await request(app).get(`/api/resumes/public/${doc.resumeId}`);
    expect(before.status).toBe(200);

    // Owner revokes public access
    await Resume.findByIdAndUpdate(doc._id, { isPublic: false });

    // Now it should be hidden again
    const after = await request(app).get(`/api/resumes/public/${doc.resumeId}`);
    expect(after.status).toBe(404);
  });
});
