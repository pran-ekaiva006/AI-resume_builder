// server/routes/cronRoutes.js
//
// Cron-triggered routes for Vercel.
//
// Vercel Cron Jobs call these endpoints on a schedule defined in vercel.json.
// Each endpoint is protected by a CRON_SECRET header so only Vercel's
// scheduler (or an admin with the secret) can trigger them.

const express = require('express');
const router = express.Router();

const User = require('../models/User');
const Resume = require('../models/Resume');

/**
 * POST /api/cron/cleanup
 *
 * Replaces the old setInterval demo-account cleanup from server.js.
 * Finds demo users older than 24 hours and cascade-deletes their
 * resumes and user records.
 *
 * Protected by CRON_SECRET — Vercel sends this automatically for
 * cron-triggered requests.
 */
router.post('/cleanup', async (req, res) => {
  // ── Authenticate the cron request ──────────────────────────────────────
  const cronSecret = process.env.CRON_SECRET;
  if (!cronSecret) {
    console.error('🧹 CRON_SECRET not configured — rejecting cleanup request');
    return res.status(500).json({ success: false, message: 'CRON_SECRET not configured' });
  }

  const authHeader = req.headers['authorization'];
  if (authHeader !== `Bearer ${cronSecret}`) {
    return res.status(401).json({ success: false, message: 'Unauthorized' });
  }

  // ── Run the cleanup ────────────────────────────────────────────────────
  try {
    const twentyFourHoursAgo = new Date(Date.now() - 24 * 60 * 60 * 1000);

    // Find all demo users older than 24 hours
    const expiredDemoUsers = await User.find({
      isDemo: true,
      createdAt: { $lt: twentyFourHoursAgo },
    });

    if (expiredDemoUsers.length === 0) {
      return res.status(200).json({
        success: true,
        message: 'No expired demo accounts found',
        deletedUsers: 0,
        deletedResumes: 0,
      });
    }

    const userIds = expiredDemoUsers.map((user) => user._id);

    // Cascade delete: resumes first, then users
    const resumeResult = await Resume.deleteMany({ userId: { $in: userIds } });
    const userResult = await User.deleteMany({ _id: { $in: userIds } });

    console.log(
      `🧹 Cleanup complete: Deleted ${userResult.deletedCount} demo users ` +
        `and ${resumeResult.deletedCount} resumes.`,
    );

    return res.status(200).json({
      success: true,
      message: 'Cleanup complete',
      deletedUsers: userResult.deletedCount,
      deletedResumes: resumeResult.deletedCount,
    });
  } catch (err) {
    console.error('🧹 Demo cleanup failed:', err.message);
    return res.status(500).json({
      success: false,
      message: 'Cleanup failed',
      error: err.message,
    });
  }
});

module.exports = router;
