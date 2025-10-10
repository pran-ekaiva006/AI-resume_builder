

const { getAuth, clerkClient } = require('@clerk/express');
const User = require('../models/User');

// ✅ Attach authenticated Clerk user to the request
const attachUser = async (req, res, next) => {
  try {
    const { userId } = getAuth(req);

    if (!userId) {
      return res.status(401).json({ message: 'Unauthorized: No Clerk user found' });
    }

    // Check if the user already exists in MongoDB
    let user = await User.findOne({ clerkId: userId });

    // If not, create a new user record in MongoDB
    if (!user) {
      const clerkUser = await clerkClient.users.getUser(userId);
      const email = clerkUser.emailAddresses[0].emailAddress;

      user = await User.create({
        clerkId: userId,
        email,
        role: 'user', // Default role
      });
    }

    req.user = user;
    next();
  } catch (error) {
    console.error('❌ Error in attachUser:', error.message);
    res.status(500).json({ message: 'Server error attaching user' });
  }
};

// ✅ Role-based access control (RBAC)
const requireRole = (roles = []) => (req, res, next) => {
  if (!req.user || !roles.includes(req.user.role)) {
    return res.status(403).json({ message: 'Forbidden: Access denied' });
  }
  next();
};

module.exports = { attachUser, requireRole };
