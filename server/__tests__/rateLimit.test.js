/**
 * server/__tests__/rateLimit.test.js
 *
 * Verifies that `app.set('trust proxy', 1)` causes express-rate-limit to
 * derive the client IP from X-Forwarded-For, so each real IP gets its own
 * independent rate-limit counter.
 *
 * The test spins up a minimal Express app that mirrors the exact trust-proxy
 * setting and auth-limiter configuration from the production server — no
 * MongoDB connection required.
 */

'use strict';

const express = require('express');
const rateLimit = require('express-rate-limit');
const request = require('supertest');

// ---------------------------------------------------------------------------
// Build a minimal app that replicates the relevant production middleware chain
// ---------------------------------------------------------------------------
function buildApp() {
  const app = express();

  // ── The fix under test ──────────────────────────────────────────────────
  app.set('trust proxy', 1);

  // ── Same limiter config as authRoutes.js ────────────────────────────────
  const authLimiter = rateLimit({
    windowMs: 15 * 60 * 1000,
    max: 5,
    // Use a per-test in-memory store (default MemoryStore) so windows are
    // isolated between test runs without needing external state.
    standardHeaders: true,
    legacyHeaders: false,
    message: { message: 'Too many attempts from this IP, please try again after 15 minutes' },
  });

  app.use(express.json());

  // Minimal stand-in for POST /api/auth/login — always returns 200 so we can
  // observe rate-limit responses (429) without needing a real DB.
  app.post('/api/auth/login', authLimiter, (req, res) => {
    res.status(200).json({ ok: true });
  });

  return app;
}

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------

/**
 * Fire `count` sequential POST /api/auth/login requests from a spoofed IP.
 * Returns an array of HTTP status codes.
 */
async function fireRequests(app, ip, count) {
  const statuses = [];
  for (let i = 0; i < count; i++) {
    const res = await request(app)
      .post('/api/auth/login')
      .set('X-Forwarded-For', ip)
      .send({ email: 'test@example.com', password: 'pass' });
    statuses.push(res.status);
  }
  return statuses;
}

// ---------------------------------------------------------------------------
// Tests
// ---------------------------------------------------------------------------

describe('Rate limiter — per-IP isolation via X-Forwarded-For (trust proxy)', () => {
  let app;

  beforeEach(() => {
    // Fresh app (and fresh MemoryStore) for every test so windows don't bleed.
    app = buildApp();
  });

  it('allows up to 5 requests from a single IP and blocks the 6th', async () => {
    const statuses = await fireRequests(app, '10.0.0.1', 6);

    // First 5 should succeed
    expect(statuses.slice(0, 5)).toEqual([200, 200, 200, 200, 200]);
    // 6th should be rate-limited
    expect(statuses[5]).toBe(429);
  });

  it('IP-A hitting the 5-request limit does NOT block IP-B', async () => {
    const IP_A = '10.0.0.10';
    const IP_B = '10.0.0.20';

    // Exhaust IP-A's quota (5 allowed + 1 blocked)
    const statusesA = await fireRequests(app, IP_A, 6);
    expect(statusesA[5]).toBe(429); // IP-A is now rate-limited

    // IP-B should still get through fine (its counter is independent)
    const statusesB = await fireRequests(app, IP_B, 5);
    expect(statusesB).toEqual([200, 200, 200, 200, 200]);
  });

  it('two IPs accumulate independent counters when interleaved', async () => {
    const IP_A = '192.168.1.1';
    const IP_B = '192.168.1.2';

    const results = [];

    // Alternate requests: A then B, 6 rounds each
    for (let i = 0; i < 6; i++) {
      results.push({
        A: (await request(app)
          .post('/api/auth/login')
          .set('X-Forwarded-For', IP_A)
          .send({})).status,
        B: (await request(app)
          .post('/api/auth/login')
          .set('X-Forwarded-For', IP_B)
          .send({})).status,
      });
    }

    // A's 6th request (index 5) must be blocked
    expect(results[5].A).toBe(429);
    // B's 6th request (index 5) must ALSO be blocked (its own independent counter)
    expect(results[5].B).toBe(429);

    // But the first 5 for both should all be 200
    for (let i = 0; i < 5; i++) {
      expect(results[i].A).toBe(200);
      expect(results[i].B).toBe(200);
    }
  });
});
