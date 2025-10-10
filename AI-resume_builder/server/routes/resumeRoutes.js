// routes/resumeRoutes.js
const express = require('express');
const router = express.Router();
const ResumeController = require('../controllers/resumeController');
const { validateUUID } = require('../middlewares/validationMiddleware');
const asyncHandler = require('../utils/asyncHandler');

// ✅ Create a new resume
router.post('/', asyncHandler(ResumeController.createResume));

// ✅ Get all resumes
router.get('/', asyncHandler(ResumeController.getAllResumes));

// ✅ Get a resume by resumeId (UUID)
router.get('/resumeId/:resumeId', validateUUID, asyncHandler(ResumeController.getResumeByResumeId));

// ✅ Update a resume by resumeId (UUID)
router.put('/resumeId/:resumeId', validateUUID, asyncHandler(ResumeController.updateResumeByResumeId));

// ✅ Delete a resume by resumeId (UUID)  <-- MISSING BEFORE
router.delete('/resumeId/:resumeId', validateUUID, asyncHandler(ResumeController.deleteResumeByResumeId));

module.exports = router;