const { getAuth, clerkClient } = require('@clerk/express');
const User = require('../models/User');

const attachUser = async (req, res, next) => {
  try {
    // Extract Clerk user ID
    const { userId } = getAuth(req);

    if (!userId) {
      return res.status(401).json({ message: 'Unauthorized: No Clerk user found' });
    }

    // Fetch Clerk user details
    const clerkUser = await clerkClient.users.getUser(userId);
    const email = clerkUser.emailAddresses[0].emailAddress;

    // Sync with MongoDB (optional)
    let user = await User.findOne({ clerkId: userId });
    if (!user) {
      user = await User.create({
        clerkId: userId,
        email,
        role: 'user',
      });
    }

    // Attach data to request (renamed clerkId to match existing controllers)
    req.user = {
      email,
      clerkId: userId, // ✅ changed key name
      role: user.role || 'user',
    };

    next();
  } catch (error) {
    console.error('❌ Error in attachUser:', error.message);
    res.status(500).json({ message: 'Server error attaching user' });
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
