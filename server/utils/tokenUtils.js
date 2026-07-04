// server/utils/tokenUtils.js
//
// Secret resolution strategy:
//   production  → missing secret throws immediately (server.js startup check exits first,
//                  but these guards are a second line of defence)
//   development/test → use a visible fallback and warn once so it is never silent

const jwt = require('jsonwebtoken');

// ── Secret resolution ─────────────────────────────────────────────────────

/**
 * Resolve a JWT secret from the environment.
 * - In production: throws if the variable is absent or empty.
 * - In dev/test:   returns a hard-coded fallback but prints a one-time warning.
 */
const _warned = new Set();
function resolveSecret(envKey, devFallback) {
  const value = process.env[envKey];

  if (value) return value;

  if (process.env.NODE_ENV === 'production') {
    throw new Error(
      `[tokenUtils] ${envKey} must be set in production. ` +
      'Refusing to sign/verify tokens with an empty secret.',
    );
  }

  // Development / test: use fallback but warn exactly once per key.
  if (!_warned.has(envKey)) {
    console.warn(
      `\n⚠️  [tokenUtils] WARNING: ${envKey} is not set. ` +
      `Using insecure dev fallback "${devFallback}". ` +
      'Set this variable before deploying to production.\n',
    );
    _warned.add(envKey);
  }
  return devFallback;
}

// ── Public API ────────────────────────────────────────────────────────────

const signAccessToken = (userId) =>
  jwt.sign(
    { sub: userId },
    resolveSecret('ACCESS_TOKEN_SECRET', 'dev_access_secret'),
    { expiresIn: '15m' },
  );

const signRefreshToken = (userId) =>
  jwt.sign(
    { sub: userId },
    resolveSecret('REFRESH_TOKEN_SECRET', 'dev_refresh_secret'),
    { expiresIn: '30d' },
  );

const verifyAccessToken = (token) =>
  jwt.verify(token, resolveSecret('ACCESS_TOKEN_SECRET', 'dev_access_secret'));

const verifyRefreshToken = (token) =>
  jwt.verify(token, resolveSecret('REFRESH_TOKEN_SECRET', 'dev_refresh_secret'));

module.exports = { signAccessToken, signRefreshToken, verifyAccessToken, verifyRefreshToken };
