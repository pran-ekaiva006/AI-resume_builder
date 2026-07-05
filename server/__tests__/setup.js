/**
 * server/__tests__/setup.js
 *
 * Jest globalSetup-style file that spins up a single MongoMemoryServer
 * instance before all tests and tears it down after.
 *
 * Used via jest.config.js → globalSetup / setupFilesAfterFramework.
 *
 * Each test file gets a clean DB by wiping all collections between tests
 * via the afterEach hook registered here.
 */

'use strict';

const mongoose = require('mongoose');
const { MongoMemoryServer } = require('mongodb-memory-server');

let mongod;

// ── Run once before the entire test suite ────────────────────────────────────
beforeAll(async () => {
  mongod = await MongoMemoryServer.create();
  const uri = mongod.getUri();

  // Set env vars so any code that reads process.env.MONGO_URI picks up
  // the in-memory instance instead of a real database.
  process.env.MONGO_URI = uri;

  // Provide fallback secrets so tokenUtils / authMiddleware don't throw
  // during tests.
  process.env.ACCESS_TOKEN_SECRET  = process.env.ACCESS_TOKEN_SECRET  || 'test-access-secret-key-for-jest';
  process.env.REFRESH_TOKEN_SECRET = process.env.REFRESH_TOKEN_SECRET || 'test-refresh-secret-key-for-jest';
  process.env.GEMINI_API_KEY       = process.env.GEMINI_API_KEY       || 'test-gemini-key';
  process.env.CLIENT_URL           = process.env.CLIENT_URL           || 'http://localhost:5173';
  process.env.GOOGLE_CLIENT_ID     = process.env.GOOGLE_CLIENT_ID     || 'test-google-client-id';

  await mongoose.connect(uri);
});

// ── Wipe all collections between tests to prevent state bleed ────────────────
afterEach(async () => {
  const collections = mongoose.connection.collections;
  for (const key in collections) {
    await collections[key].deleteMany({});
  }
});

// ── Tear down after the entire test suite ────────────────────────────────────
afterAll(async () => {
  await mongoose.disconnect();
  if (mongod) {
    await mongod.stop();
  }
});
