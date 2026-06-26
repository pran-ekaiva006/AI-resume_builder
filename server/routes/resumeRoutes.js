const express = require("express");
const router = express.Router();

const ResumeController = require("../controllers/resumeController");
const { validateUUID } = require("../middlewares/validationMiddleware");
const { requireRole } = require("../middlewares/authMiddleware");
const asyncHandler = require("../utils/asyncHandler");

// ✅ Create new resume
router.post("/", asyncHandler(ResumeController.createResume));

// ✅ Get all resumes for logged-in user
router.get("/", asyncHandler(ResumeController.getAllResumes));

// ✅ Get resume by ID  <-- FIXED
router.get("/:resumeId", validateUUID, asyncHandler(ResumeController.getResumeByResumeId));

// ✅ Update resume by ID  <-- FIXED
router.put("/:resumeId", validateUUID, asyncHandler(ResumeController.updateResumeByResumeId));

// ✅ Delete resume by ID (allow user to delete their own resume)
router.delete("/:resumeId", validateUUID, asyncHandler(ResumeController.deleteResumeByResumeId));

module.exports = router;
