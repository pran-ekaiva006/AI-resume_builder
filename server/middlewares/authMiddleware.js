// server/middlewares/authMiddleware.js

const { getAuth, clerkClient } = require("@clerk/express");
const User = require("../models/User");

const attachUser = async (req, res, next) => {
  try {
    console.log("🔐 Auth check - Headers:", req.headers.authorization ? "Present" : "Missing");
    
    const { userId } = getAuth(req);

    if (!userId) {
      console.error("❌ No Clerk userId found in request");
      return res.status(401).json({ 
        message: "Unauthorized: No Clerk user found",
        hint: "Token might be expired or invalid"
      });
    }

    console.log("✅ Clerk userId extracted:", userId);

    let email = null;
    try {
      const clerkUser = await clerkClient.users.getUser(userId);
      email = clerkUser?.emailAddresses?.[0]?.emailAddress || null;
      console.log("✅ Clerk email fetched:", email);
    } catch (clerkErr) {
      console.error("⚠️ Failed to fetch Clerk user details:", clerkErr.message);
    }

    let user = await User.findOne({ clerkId: userId });
    if (!user) {
      console.log("🆕 Creating new user in DB for clerkId:", userId);
      user = await User.create({ clerkId: userId, email, role: "user" });
    }

    req.user = {
      clerkId: userId,
      email,
      role: user.role || "user",
    };

    console.log("✅ User attached to request:", req.user);
    return next();
  } catch (err) {
    console.error("🔥 Auth Middleware Error:", err);
    console.error("Error stack:", err.stack);
    return res.status(401).json({ 
      message: "Unauthorized: auth failed",
      error: err.message 
    });
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
