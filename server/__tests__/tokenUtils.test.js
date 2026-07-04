/**
 * server/__tests__/tokenUtils.test.js
 *
 * Unit tests for the secret-resolution logic in tokenUtils.js.
 *
 * Key technique: jest.resetModules() + manual process.env mutation lets us
 * re-require the module fresh for each test so the module-level _warned Set
 * and any captured env values are reset.
 */

'use strict';

// Snapshot real env values so we can restore them after each test.
const ORIGINAL_ENV = { ...process.env };

afterEach(() => {
  // Restore env and reset module registry so every test gets a clean slate.
  Object.assign(process.env, ORIGINAL_ENV);
  // Remove any keys the test added that were not in the original
  for (const key of Object.keys(process.env)) {
    if (!(key in ORIGINAL_ENV)) delete process.env[key];
  }
  jest.resetModules();
});

// ── Helpers ────────────────────────────────────────────────────────────────

/** Load a fresh copy of tokenUtils with the given env overrides applied. */
function loadTokenUtils(envOverrides = {}) {
  Object.assign(process.env, envOverrides);
  return require('../utils/tokenUtils');
}

// ── Tests ──────────────────────────────────────────────────────────────────

describe('tokenUtils — production: missing secret must throw', () => {
  it('signAccessToken throws when ACCESS_TOKEN_SECRET is unset in production', () => {
    const { signAccessToken } = loadTokenUtils({
      NODE_ENV: 'production',
      ACCESS_TOKEN_SECRET: '',        // explicitly empty
      REFRESH_TOKEN_SECRET: 'some-refresh-secret',
    });

    expect(() => signAccessToken('user-123')).toThrow(
      /ACCESS_TOKEN_SECRET must be set in production/i,
    );
  });

  it('signRefreshToken throws when REFRESH_TOKEN_SECRET is unset in production', () => {
    const { signRefreshToken } = loadTokenUtils({
      NODE_ENV: 'production',
      ACCESS_TOKEN_SECRET: 'some-access-secret',
      REFRESH_TOKEN_SECRET: '',
    });

    expect(() => signRefreshToken('user-123')).toThrow(
      /REFRESH_TOKEN_SECRET must be set in production/i,
    );
  });

  it('verifyAccessToken throws when ACCESS_TOKEN_SECRET is unset in production', () => {
    const { verifyAccessToken } = loadTokenUtils({
      NODE_ENV: 'production',
      ACCESS_TOKEN_SECRET: '',
      REFRESH_TOKEN_SECRET: 'some-refresh-secret',
    });

    expect(() => verifyAccessToken('any.jwt.token')).toThrow(
      /ACCESS_TOKEN_SECRET must be set in production/i,
    );
  });

  it('verifyRefreshToken throws when REFRESH_TOKEN_SECRET is unset in production', () => {
    const { verifyRefreshToken } = loadTokenUtils({
      NODE_ENV: 'production',
      ACCESS_TOKEN_SECRET: 'some-access-secret',
      REFRESH_TOKEN_SECRET: '',
    });

    expect(() => verifyRefreshToken('any.jwt.token')).toThrow(
      /REFRESH_TOKEN_SECRET must be set in production/i,
    );
  });

  it('does NOT throw when both secrets are set in production', () => {
    const { signAccessToken, signRefreshToken } = loadTokenUtils({
      NODE_ENV: 'production',
      ACCESS_TOKEN_SECRET: 'real-access-secret-32chars-long!!',
      REFRESH_TOKEN_SECRET: 'real-refresh-secret-32chars-long!',
    });

    // Should produce a valid JWT without throwing
    expect(() => signAccessToken('user-abc')).not.toThrow();
    expect(() => signRefreshToken('user-abc')).not.toThrow();
  });
});

describe('tokenUtils — development: missing secret uses fallback and warns', () => {
  it('does NOT throw in development when secrets are missing — uses dev fallback', () => {
    const { signAccessToken } = loadTokenUtils({
      NODE_ENV: 'development',
      ACCESS_TOKEN_SECRET: '',
      REFRESH_TOKEN_SECRET: '',
    });

    // Should return a token string (not throw)
    const token = signAccessToken('user-dev');
    expect(typeof token).toBe('string');
    expect(token.split('.').length).toBe(3); // valid JWT structure
  });

  it('prints a console.warn when falling back to dev secret', () => {
    const warnSpy = jest.spyOn(console, 'warn').mockImplementation(() => {});

    const { signAccessToken } = loadTokenUtils({
      NODE_ENV: 'development',
      ACCESS_TOKEN_SECRET: '',
      REFRESH_TOKEN_SECRET: '',
    });

    signAccessToken('user-dev');

    expect(warnSpy).toHaveBeenCalledWith(
      expect.stringContaining('ACCESS_TOKEN_SECRET'),
    );

    warnSpy.mockRestore();
  });

  it('round-trips sign → verify using the dev fallback in test environment', () => {
    const { signAccessToken, verifyAccessToken } = loadTokenUtils({
      NODE_ENV: 'test',
      ACCESS_TOKEN_SECRET: '',
    });

    const token = signAccessToken('user-roundtrip');
    const payload = verifyAccessToken(token);
    expect(payload.sub).toBe('user-roundtrip');
  });
});
