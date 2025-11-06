const express = require("express");
const router = express.Router();

const ResumeController = require("../controllers/resumeController");
const { validateUUID } = require("../middlewares/validationMiddleware");
const { attachUser, requireRole } = require("../middlewares/authMiddleware");
const asyncHandler = require("../utils/asyncHandler");

// ✅ Attach Clerk user info before handling routes
router.use(attachUser);

// ✅ Create new resume
router.post("/", asyncHandler(ResumeController.createResume));

// ✅ Get all resumes for logged-in user
router.get("/", asyncHandler(ResumeController.getAllResumes));

// ✅ Get resume by ID  <-- FIXED
router.get("/:resumeId", validateUUID, asyncHandler(ResumeController.getResumeByResumeId));

// ✅ Update resume by ID  <-- FIXED
router.put("/:resumeId", validateUUID, asyncHandler(ResumeController.updateResumeByResumeId));

// ✅ Delete resume by ID (ADMIN)
router.delete("/:resumeId", validateUUID, requireRole(["admin"]), asyncHandler(ResumeController.deleteResumeByResumeId));

module.exports = router;
