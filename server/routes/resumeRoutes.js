const express = require('express');
const router = express.Router();
const ResumeController = require('../controllers/ResumeController');

router.post('/', ResumeController.createResume);
// If you want GET support, add this:
router.get('/', ResumeController.getAllResumes);

module.exports = router;
