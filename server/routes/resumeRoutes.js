const express = require('express');
const router = express.Router();
const ResumeController = require('../controllers/resumeController');
const { validateUUID } = require('../middlewares/validationMiddleware');
const { attachUser, requireRole } = require('../middlewares/authMiddleware');
const asyncHandler = require('../utils/asyncHandler');

// ✅ Attach Clerk user to every request before hitting any resume route
router.use(attachUser);

// ✅ Create new resume
router.post('/', asyncHandler(ResumeController.createResume));

// ✅ Get all resumes for logged-in user
router.get('/', asyncHandler(ResumeController.getAllResumes));

// ✅ Get single resume by ID
router.get('/resumeId/:resumeId', validateUUID, asyncHandler(ResumeController.getResumeByResumeId));

// ✅ Update resume by ID
router.put('/resumeId/:resumeId', validateUUID, asyncHandler(ResumeController.updateResumeByResumeId));

// ✅ Delete resume by ID (admin only)
router.delete('/resumeId/:resumeId', validateUUID, requireRole(['admin']), asyncHandler(ResumeController.deleteResumeByResumeId));

module.exports = router;
