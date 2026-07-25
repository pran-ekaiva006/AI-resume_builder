// server/server.js
//
// LOCAL DEVELOPMENT entry point only.
//
// This file starts the Express server with app.listen() for local development.
// It is NOT used by Vercel — Vercel uses api/index.js instead.
//
// Usage:
//   node server.js        (production-like local run)
//   npx nodemon server.js (development with auto-reload)

const dotenv = require("dotenv");
dotenv.config();

// ── Fail-fast: required environment variables ───────────────────────────────
// In production all critical variables MUST be set before we do anything else.
// In development, missing variables are allowed but a visible warning is printed.
const REQUIRED_SECRETS = [
  'ACCESS_TOKEN_SECRET',
  'REFRESH_TOKEN_SECRET',
  'MONGO_URI',
  'GEMINI_API_KEY',
  'CLIENT_URL',
  'GOOGLE_CLIENT_ID',
];

if (process.env.NODE_ENV === 'production') {
  const missing = REQUIRED_SECRETS.filter((k) => !process.env[k]);
  if (missing.length) {
    console.error(
      `\n🚨 FATAL: The following environment variables must be set in production:\n` +
      missing.map((k) => `   • ${k}`).join('\n') +
      '\nShutting down.\n',
    );
    process.exit(1);
  }
} else {
  const missing = REQUIRED_SECRETS.filter((k) => !process.env[k]);
  if (missing.length) {
    console.warn(
      `\n⚠️  WARNING: ${missing.join(', ')} ${missing.length === 1 ? 'is' : 'are'} not set. ` +
      'Using insecure dev fallback(s). Set these before deploying to production.\n',
    );
  }
}

const connectDB = require("./lib/connectDB");

// Import the Express app (routes, middleware, error handlers)
const app = require("./app");

const PORT = process.env.PORT || 5001;

// ✅ DB Connection & Server start (local development only)
(async () => {
  try {
    await connectDB();
    console.log("✅ MongoDB connected successfully");

    app.listen(PORT, () =>
      console.log(`🚀 Server running on http://localhost:${PORT}`)
    );
  } catch (error) {
    console.error("❌ MongoDB error:", error.message);
    process.exit(1);
  }
})();
