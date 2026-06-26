const jwt = require('jsonwebtoken');

const signAccessToken = (userId) =>
  jwt.sign({ sub: userId }, process.env.ACCESS_TOKEN_SECRET || 'dev_access_secret', { expiresIn: '15m' });

const signRefreshToken = (userId) =>
  jwt.sign({ sub: userId }, process.env.REFRESH_TOKEN_SECRET || 'dev_refresh_secret', { expiresIn: '30d' });

const verifyAccessToken = (token) =>
  jwt.verify(token, process.env.ACCESS_TOKEN_SECRET || 'dev_access_secret');

const verifyRefreshToken = (token) =>
  jwt.verify(token, process.env.REFRESH_TOKEN_SECRET || 'dev_refresh_secret');

module.exports = { signAccessToken, signRefreshToken, verifyAccessToken, verifyRefreshToken };
