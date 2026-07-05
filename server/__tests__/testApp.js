/**
 * server/__tests__/testApp.js
 *
 * Re-exports the Express app from server/app.js for use in integration tests.
 *
 * Tests import this instead of server.js so they get the fully-configured
 * app (routes, middleware, error handlers) without binding a port or
 * starting background timers.
 *
 * Usage:
 *   const app = require('./testApp');
 *   const request = require('supertest');
 *
 *   const res = await request(app).get('/api/some-route');
 */

'use strict';

const app = require('../app');

module.exports = app;
