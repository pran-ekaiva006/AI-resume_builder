const express = require('express');
const router = express.Router();
const ResumeController = require('../controllers/resumeController');

// Create resume
router.post('/', ResumeController.createResume);

// Get all resumes
router.get('/', ResumeController.getAllResumes);

// Get resume by ID
router.get('/:id', ResumeController.getResumeById);

// Update resume by ID

router.put('/:id', ResumeController.updateResume);

module.exports = router;
