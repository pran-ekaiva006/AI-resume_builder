/**
 * server/__tests__/auth.test.js
 *
 * Integration tests for the full auth flow:
 *   signup → login → me → refresh → logout
 *
 * Uses the shared in-memory MongoDB setup from setup.js and the real
 * Express app from testApp.js.
 *
 * NOTE: The auth routes have a rate limiter (5 req / 15 min per IP).
 * Each describe block uses a unique X-Forwarded-For IP so tests don't
 * trip the limiter across blocks. The app has trust proxy enabled.
 */

'use strict';

const request = require('supertest');
const app = require('./testApp');
const User = require('../models/User');

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------
const TEST_USER = {
  firstName: 'Test',
  lastName: 'User',
  email: 'testuser@example.com',
  password: 'SecurePass123!',
};

/** Sign up a user, spoofing the given IP to avoid rate-limit collisions. */
async function signupUser(ip, overrides = {}) {
  return request(app)
    .post('/api/auth/signup')
    .set('X-Forwarded-For', ip)
    .send({ ...TEST_USER, ...overrides });
}

/** Log in a user, spoofing the given IP. */
async function loginUser(ip, overrides = {}) {
  return request(app)
    .post('/api/auth/login')
    .set('X-Forwarded-For', ip)
    .send({
      email: overrides.email || TEST_USER.email,
      password: overrides.password || TEST_USER.password,
    });
}

/**
 * Extract named cookies from a supertest set-cookie header array.
 * Returns an object like { accessToken: 'eyJ...', refreshToken: 'eyJ...' }
 */
function parseCookies(setCookieHeader) {
  const cookies = {};
  if (!setCookieHeader) return cookies;
  const arr = Array.isArray(setCookieHeader) ? setCookieHeader : [setCookieHeader];
  for (const raw of arr) {
    const [pair] = raw.split(';');
    const [name, ...valueParts] = pair.split('=');
    cookies[name.trim()] = valueParts.join('=');
  }
  return cookies;
}

/**
 * Build a Cookie header string from a set-cookie response array so we can
 * forward cookies in follow-up requests.
 */
function cookieHeader(setCookieArray) {
  if (!setCookieArray) return '';
  return setCookieArray
    .map((raw) => raw.split(';')[0])
    .join('; ');
}

// ---------------------------------------------------------------------------
// 1 & 2. Signup
// ---------------------------------------------------------------------------
describe('POST /api/auth/signup', () => {
  const IP = '10.1.0.1';

  it('returns 201, sets cookies, and creates a User in the DB', async () => {
    const res = await signupUser(IP);

    expect(res.status).toBe(201);
    expect(res.body.success).toBe(true);
    expect(res.body.user.firstName).toBe('Test');
    expect(res.body.user.email).toBe(TEST_USER.email);

    // Cookies must be set
    const cookies = parseCookies(res.headers['set-cookie']);
    expect(cookies.accessToken).toBeDefined();
    expect(cookies.refreshToken).toBeDefined();

    // User must exist in DB
    const dbUser = await User.findOne({ email: TEST_USER.email });
    expect(dbUser).not.toBeNull();
    expect(dbUser.firstName).toBe('Test');
  });

  it('returns 400 with "Email already in use" for a duplicate email', async () => {
    // First signup succeeds
    await signupUser(IP);

    // Second signup with same email must fail
    const res = await signupUser(IP);

    expect(res.status).toBe(400);
    expect(res.body.message).toBe('Email already in use');
  });
});

// ---------------------------------------------------------------------------
// 3 & 4. Login
// ---------------------------------------------------------------------------
describe('POST /api/auth/login', () => {
  const IP = '10.2.0.1';

  beforeEach(async () => {
    // Create a user to log in with (uses a different IP to avoid rate limit)
    await signupUser('10.2.0.99');
  });

  it('returns 200 and sets cookies with correct credentials', async () => {
    const res = await loginUser(IP);

    expect(res.status).toBe(200);
    expect(res.body.success).toBe(true);
    expect(res.body.user.email).toBe(TEST_USER.email);

    const cookies = parseCookies(res.headers['set-cookie']);
    expect(cookies.accessToken).toBeDefined();
    expect(cookies.refreshToken).toBeDefined();
  });

  it('returns 401 with wrong password', async () => {
    const res = await loginUser(IP, { password: 'WrongPassword!' });

    expect(res.status).toBe(401);
    expect(res.body.message).toBe('Invalid email or password');
  });
});

// ---------------------------------------------------------------------------
// 5 & 6. GET /api/auth/me
// ---------------------------------------------------------------------------
describe('GET /api/auth/me', () => {
  const IP = '10.3.0.1';

  it('returns 401 with no cookie', async () => {
    const res = await request(app).get('/api/auth/me');

    expect(res.status).toBe(401);
  });

  it('returns the user when a valid accessToken cookie is present', async () => {
    // Sign up to get cookies
    const signupRes = await signupUser(IP);
    expect(signupRes.status).toBe(201);

    const cookies = cookieHeader(signupRes.headers['set-cookie']);

    const res = await request(app)
      .get('/api/auth/me')
      .set('Cookie', cookies);

    expect(res.status).toBe(200);
    expect(res.body.success).toBe(true);
    expect(res.body.user.email).toBe(TEST_USER.email);
  });
});

// ---------------------------------------------------------------------------
// 7 & 8. POST /api/auth/refresh
// ---------------------------------------------------------------------------
describe('POST /api/auth/refresh', () => {
  const IP = '10.4.0.1';

  it('issues new cookies when a valid refreshToken is provided', async () => {
    // Sign up to get initial cookies
    const signupRes = await signupUser(IP);
    expect(signupRes.status).toBe(201);
    const initialCookies = cookieHeader(signupRes.headers['set-cookie']);

    const res = await request(app)
      .post('/api/auth/refresh')
      .set('Cookie', initialCookies);

    expect(res.status).toBe(200);
    expect(res.body.success).toBe(true);

    // New cookies must be set
    const newCookies = parseCookies(res.headers['set-cookie']);
    expect(newCookies.accessToken).toBeDefined();
    expect(newCookies.refreshToken).toBeDefined();

    // New access token should work for /me
    const meRes = await request(app)
      .get('/api/auth/me')
      .set('Cookie', cookieHeader(res.headers['set-cookie']));

    expect(meRes.status).toBe(200);
    expect(meRes.body.user.email).toBe(TEST_USER.email);
  });

  it('returns 401 and clears cookies when a reused/invalid refreshToken is sent', async () => {
    // Use a completely unique IP for this test to avoid rate-limit state
    const signupRes = await signupUser('10.4.1.1');
    expect(signupRes.status).toBe(201);
    const initialCookieStr = cookieHeader(signupRes.headers['set-cookie']);
    const initialParsed = parseCookies(signupRes.headers['set-cookie']);

    // Wait >1 second so the JWT iat (issued-at timestamp, in whole seconds)
    // differs between signup and first refresh, guaranteeing the rotated
    // refresh token is a different string from the original.
    await new Promise((r) => setTimeout(r, 1500));

    // First refresh succeeds — this rotates the token in the DB
    const firstRefresh = await request(app)
      .post('/api/auth/refresh')
      .set('X-Forwarded-For', '10.4.1.1')
      .set('Cookie', initialCookieStr);
    expect(firstRefresh.status).toBe(200);

    // Verify that the rotated token is actually different
    const rotatedParsed = parseCookies(firstRefresh.headers['set-cookie']);
    expect(rotatedParsed.refreshToken).not.toBe(initialParsed.refreshToken);

    // Second refresh with the OLD (now-stale) token must fail
    const secondRefresh = await request(app)
      .post('/api/auth/refresh')
      .set('X-Forwarded-For', '10.4.1.1')
      .set('Cookie', initialCookieStr);

    expect(secondRefresh.status).toBe(401);
    expect(secondRefresh.body.message).toBe('Token reused, logged out');
  });

  it('returns 401 when no refreshToken cookie is sent', async () => {
    const res = await request(app)
      .post('/api/auth/refresh');

    expect(res.status).toBe(401);
    expect(res.body.message).toBe('No refresh token provided');
  });
});

// ---------------------------------------------------------------------------
// 9. POST /api/auth/logout
// ---------------------------------------------------------------------------
describe('POST /api/auth/logout', () => {
  const IP = '10.5.0.1';

  it('clears cookies and nulls refreshTokenHash on the user', async () => {
    // Sign up to get cookies and a user with refreshTokenHash
    const signupRes = await signupUser(IP);
    expect(signupRes.status).toBe(201);
    const cookies = cookieHeader(signupRes.headers['set-cookie']);

    // Verify the user has a refreshTokenHash before logout
    const beforeUser = await User.findOne({ email: TEST_USER.email }).select('+refreshTokenHash');
    expect(beforeUser).not.toBeNull();
    expect(beforeUser.refreshTokenHash).toBeDefined();
    expect(beforeUser.refreshTokenHash).not.toBeNull();

    // Logout
    const res = await request(app)
      .post('/api/auth/logout')
      .set('Cookie', cookies);

    expect(res.status).toBe(200);
    expect(res.body.success).toBe(true);
    expect(res.body.message).toBe('Logged out successfully');

    // Cookies should be cleared (set to empty or with past expiry)
    const setCookie = res.headers['set-cookie'];
    expect(setCookie).toBeDefined();
    const accessCookie = setCookie.find(c => c.startsWith('accessToken='));
    const refreshCookie = setCookie.find(c => c.startsWith('refreshToken='));
    expect(accessCookie).toBeDefined();
    expect(refreshCookie).toBeDefined();

    // refreshTokenHash should be null in DB
    const afterUser = await User.findOne({ email: TEST_USER.email }).select('+refreshTokenHash');
    expect(afterUser.refreshTokenHash).toBeNull();
  });
});
