// server/middlewares/authMiddleware.js

const { verifyAccessToken } = require('../utils/tokenUtils');
const User = require('../models/User');

const requireAuth = async (req, res, next) => {
  try {
    const token = req.cookies?.accessToken;
    if (!token) return res.status(401).json({ message: 'Unauthorized: no token' });
    const payload = verifyAccessToken(token);
    const user = await User.findById(payload.sub);
    if (!user) return res.status(401).json({ message: 'Unauthorized: user not found' });
    req.user = { id: user._id.toString(), email: user.email, role: user.role };
    next();
  } catch (err) {
    return res.status(401).json({ message: 'Unauthorized: invalid or expired token' });
  }
};

// ✅ SIMPLE RBAC MIDDLEWARE (FIXED EXPORT)
const requireRole = (allowedRoles = []) => {
  return (req, res, next) => {
    if (!req.user || !allowedRoles.includes(req.user.role)) {
      return res.status(403).json({ message: "Forbidden: Access denied" });
    }
    next();
  };
};

module.exports = {
  requireAuth,
  requireRole,   
};
