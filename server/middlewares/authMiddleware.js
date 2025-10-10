const { getAuth, clerkClient } = require('@clerk/express');
const User = require('../models/User');

const attachUser = async (req, res, next) => {
  try {
    console.log('>> attachUser - incoming headers:', {
      authorization: req.headers.authorization,
      host: req.headers.host,
      origin: req.headers.origin,
    });

    const { userId } = getAuth(req);
    console.log('authMiddleware.getAuth ->', { userId }); // debug

    if (!userId) {
      console.log('attachUser: no userId found -> returning 401');
      return res.status(401).json({ message: 'Unauthorized: No Clerk user found' });
    }

    // Fetch Clerk user details (wrap in try so failures return 401)
    let email = null;
    try {
      const clerkUser = await clerkClient.users.getUser(userId);
      email = clerkUser?.emailAddresses?.[0]?.emailAddress || null;
    } catch (clerkErr) {
      console.warn('Warning: clerkClient.users.getUser failed', clerkErr?.message || clerkErr);
      // continue — we'll still attach minimal user context
    }

    let user = await User.findOne({ clerkId: userId });
    if (!user) {
      user = await User.create({ clerkId: userId, email: email || 'unknown', role: 'user' });
    }

    req.user = {
      email,
      clerkId: userId,
      role: user.role || 'user',
    };

    console.log('attachUser: attached req.user ->', req.user);
    next();
  } catch (error) {
    console.error('❌ Error in attachUser:', error);
    // return 401 if auth fails (avoid generic 500)
    return res.status(401).json({ message: 'Unauthorized: auth failed' });
  }
};

// Simple RBAC helper
const requireRole = (roles = []) => (req, res, next) => {
  if (!req.user || !roles.includes(req.user.role)) {
    return res.status(403).json({ message: 'Forbidden: Access denied' });
  }
  next();
};

module.exports = { attachUser, requireRole };
