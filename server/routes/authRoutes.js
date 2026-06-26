const express = require('express');
const rateLimit = require('express-rate-limit');
const { signup, login, logout, refresh, me, forgotPassword, resetPassword } = require('../controllers/authController');
let requireAuth = (req, res, next) => next();

try {
  const authMiddleware = require('../middlewares/authMiddleware');
  if (authMiddleware.requireAuth) {
    requireAuth = authMiddleware.requireAuth;
  }
} catch (e) {
  // Ignored, will be created in prompt 0.3
}

const router = express.Router();

const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 5,
  validate: { xForwardedForHeader: false, default: true },
  message: { message: 'Too many attempts from this IP, please try again after 15 minutes' }
});

router.post('/signup', authLimiter, signup);
router.post('/login', authLimiter, login);
router.post('/logout', logout);
router.post('/refresh', refresh);
router.post('/forgot-password', forgotPassword);
router.post('/reset-password/:token', resetPassword);
router.get('/me', requireAuth, me);

module.exports = router;
