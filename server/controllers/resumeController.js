const Resume = require('../models/Resume');

/**
 * 🧠 Create a new resume (for logged-in Clerk user)
 */
const createResume = async (req, res) => {
  try {
    if (!req.user || !req.user.clerkId) {
      return res.status(401).json({ success: false, message: 'Unauthorized: missing user' });
    }

    const { clerkId, email } = req.user;

    console.log("📥 Received resume data from:", email);
    console.log("🧾 Incoming request body:", req.body);

    const resume = new Resume({
      ...req.body,
      title: req.body.title?.trim() || "Untitled Resume", // ✅ ensure title always set
      userId: clerkId,
      userEmail: email,
    });

    await resume.save();

    console.log(`✅ Resume created for ${email} | Title: ${resume.title}`);

    const obj = resume.toObject();
    obj.documentId = obj.resumeId;

    res.status(201).json({
      success: true,
      message: "Resume created successfully",
      resume: obj,
    });
  } catch (error) {
    console.error("❌ Error creating resume:", error);
    res.status(500).json({
      success: false,
      message: "Failed to create resume",
      error: error.message,
    });
  }
};

/**
 * 📋 Get all resumes for logged-in user
 */
const getAllResumes = async (req, res) => {
  try {
    if (!req.user || !req.user.clerkId) {
      return res.status(401).json({ success: false, message: 'Unauthorized: missing user' });
    }

    console.log("📄 Fetching resumes for user:", req.user.emailAddress);

    const resumes = await Resume.find({ userId: req.user.clerkId }).sort({ createdAt: -1 });

    const mappedResumes = resumes.map(r => {
      const obj = r.toObject();
      obj.documentId = obj.resumeId;
      obj.title = obj.title?.trim() || "Untitled Resume"; // ✅ fallback
      return obj;
    });

    res.status(200).json({
      success: true,
      count: mappedResumes.length,
      data: mappedResumes,
    });
  } catch (error) {
    console.error("❌ Error fetching resumes:", error);
    res.status(500).json({
      success: false,
      message: "Error fetching resumes",
      error: error.message,
    });
  }
};

/**
 * 🔍 Get a single resume by resumeId
 */
const getResumeByResumeId = async (req, res) => {
  try {
    if (!req.user || !req.user.clerkId) {
      return res.status(401).json({ success: false, message: 'Unauthorized: missing user' });
    }

    const resume = await Resume.findOne({
      resumeId: req.params.resumeId,
      userId: req.user.clerkId,
    });

    if (!resume) {
      return res.status(404).json({
        success: false,
        message: "Resume not found or unauthorized",
      });
    }

    const obj = resume.toObject();
    obj.documentId = obj.resumeId;
    obj.title = obj.title?.trim() || "Untitled Resume";

    res.status(200).json({
      success: true,
      data: obj,
    });
  } catch (error) {
    console.error("❌ Error fetching resume:", error);
    res.status(500).json({
      success: false,
      message: "Failed to fetch resume",
      error: error.message,
    });
  }
};

/**
 * ✏️ Update a resume by resumeId (only owner or admin)
 */
const updateResumeByResumeId = async (req, res) => {
  try {
    if (!req.user || !req.user.clerkId) {
      return res.status(401).json({ success: false, message: 'Unauthorized: missing user' });
    }

    const query = { resumeId: req.params.resumeId };
    if (req.user.role !== 'admin') query.userId = req.user.clerkId;

    const updatedResume = await Resume.findOneAndUpdate(
      query,
      { ...req.body, title: req.body.title?.trim() || "Untitled Resume" },
      { new: true }
    );

    if (!updatedResume) {
      return res.status(404).json({
        success: false,
        message: "Resume not found or unauthorized",
      });
    }

    const obj = updatedResume.toObject();
    obj.documentId = obj.resumeId;

    res.status(200).json({
      success: true,
      message: "Resume updated successfully",
      updatedResume: obj,
    });
  } catch (error) {
    console.error("❌ Error updating resume:", error);
    res.status(500).json({
      success: false,
      message: "Failed to update resume",
      error: error.message,
    });
  }
};

/**
 * 🗑️ Delete a resume by resumeId (only owner or admin)
 */
const deleteResumeByResumeId = async (req, res) => {
  try {
    if (!req.user || !req.user.clerkId) {
      return res.status(401).json({ success: false, message: 'Unauthorized: missing user' });
    }

    const query = { resumeId: req.params.resumeId };
    if (req.user.role !== 'admin') query.userId = req.user.clerkId;

    const deletedResume = await Resume.findOneAndDelete(query);

    if (!deletedResume) {
      return res.status(404).json({
        success: false,
        message: "Resume not found or unauthorized",
      });
    }

    res.status(200).json({
      success: true,
      message: "Resume deleted successfully",
    });
  } catch (error) {
    console.error("❌ Error deleting resume:", error);
    res.status(500).json({
      success: false,
      message: "Failed to delete resume",
      error: error.message,
    });
  }
};

module.exports = {
  createResume,
  getAllResumes,
  getResumeByResumeId,
  updateResumeByResumeId,
  deleteResumeByResumeId,
};
