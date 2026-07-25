// server/api/index.js
//
// Vercel Serverless Function entry point.
//
// This file is the ONLY entry point Vercel uses. It loads environment
// variables, ensures the database is connected, and exports the Express app.
//
// Local development continues to use server.js (with app.listen()).
// This file is exclusively for Vercel deployment.

require('dotenv').config();

const app = require('../app');

module.exports = app;
