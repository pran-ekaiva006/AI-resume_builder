// server/lib/connectDB.js
//
// Cached MongoDB connection for Vercel Serverless Functions.
//
// Vercel functions are stateless and short-lived, but the Node.js process may
// be reused across invocations ("warm starts"). By caching the connection
// promise on `global`, we avoid opening a new connection on every request.
//
// This is the pattern recommended by both Vercel and MongoDB for serverless
// deployments: https://www.mongodb.com/developer/languages/javascript/
//   integrate-mongodb-vercel-functions-serverless-experience/

const mongoose = require('mongoose');

// Use a global variable so the connection persists across warm invocations.
// `global.__mongoose` survives between Vercel function reuses.
let cached = global.__mongoose;
if (!cached) {
  cached = global.__mongoose = { conn: null, promise: null };
}

async function connectDB() {
  // Already connected — return immediately.
  if (cached.conn) {
    return cached.conn;
  }

  const MONGO_URI = process.env.MONGO_URI;
  if (!MONGO_URI) {
    throw new Error('MONGO_URI environment variable is not set');
  }

  // If a connection attempt is already in progress, await it instead of
  // starting a second one.
  if (!cached.promise) {
    cached.promise = mongoose
      .connect(MONGO_URI, {
        // These options optimise for serverless cold-start performance:
        bufferCommands: false, // Fail fast rather than queue commands while connecting
      })
      .then((m) => {
        console.log('✅ MongoDB connected (serverless)');
        return m;
      });
  }

  try {
    cached.conn = await cached.promise;
  } catch (err) {
    // Reset so the next invocation retries instead of reusing a failed promise.
    cached.promise = null;
    throw err;
  }

  return cached.conn;
}

module.exports = connectDB;
