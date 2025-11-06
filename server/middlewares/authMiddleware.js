// server/middlewares/authMiddleware.js

const { getAuth, clerkClient } = require("@clerk/express");
const User = require("../models/User");

const attachUser = async (req, res, next) => {
  try {
    const { userId } = getAuth(req);

    if (!userId) {
      return res.status(401).json({ message: "Unauthorized: No Clerk user found" });
    }

    let email = null;
    try {
      const clerkUser = await clerkClient.users.getUser(userId);
      email = clerkUser?.emailAddresses?.[0]?.emailAddress || null;
    } catch {}

    let user = await User.findOne({ clerkId: userId });
    if (!user) {
      user = await User.create({ clerkId: userId, email, role: "user" });
    }

    req.user = {
      clerkId: userId,
      email,
      role: user.role || "user",
    };

    return next();
  } catch (err) {
    return res.status(401).json({ message: "Unauthorized: auth failed" });
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
  attachUser,
  requireRole,   
};
