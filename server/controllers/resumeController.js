const Resume = require('../models/Resume');

/**
 * 🧠 Create a new resume (for logged-in Clerk user)
 */
const createResume = async (req, res) => {
  try {
    console.log("🔍 Create Resume Request Body:", req.body);
    console.log("🔍 Clerk User from req.user:", req.user);

    if (!req.user || !req.user.clerkId) {
      console.error("❌ Missing req.user or clerkId");
      return res.status(401).json({
        success: false,
        message: "Unauthorized: Missing Clerk user",
      });
    }

    const { title, ...rest } = req.body;
    
    const resumeData = {
      title: title || "Untitled Resume",
      userId: req.user.clerkId,
      userEmail: req.user.email || req.body.userEmail,
      ...rest,
    };

    console.log("✅ Creating resume with data:", resumeData);

    const newResume = await Resume.create(resumeData);
    
    console.log("✅ Resume created successfully:", newResume.resumeId);

    res.status(201).json({
      success: true,
      resume: newResume,
    });
  } catch (error) {
    console.error("❌ Create Resume Error:", error);
    console.error("Error stack:", error.stack);
    
    res.status(500).json({
      success: false,
      message: error.message,
      ...(process.env.NODE_ENV === "development" && { stack: error.stack }),
    });
  }
};

/**
 * 📋 Get all resumes for the logged-in user
 */
const getAllResumes = async (req, res) => {
  try {
    if (!req.user || !req.user.clerkId) {
      return res.status(401).json({ success: false, message: 'Unauthorized: missing user' });
    }

    const resumes = await Resume.find({ userId: req.user.clerkId }).sort({ createdAt: -1 });

    const mappedResumes = resumes.map((r) => {
      const obj = r.toObject();
      obj.documentId = obj.resumeId;
      return obj;
    });

    return res.status(200).json({
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

    return res.status(200).json({
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
 * ✏️ Update a resume by resumeId
 */
const updateResumeByResumeId = async (req, res) => {
  try {
    if (!req.user || !req.user.clerkId) {
      return res.status(401).json({ success: false, message: 'Unauthorized: missing user' });
    }

    const query = { resumeId: req.params.resumeId, userId: req.user.clerkId };
    const updatedResume = await Resume.findOneAndUpdate(query, req.body, { new: true });

    if (!updatedResume) {
      return res.status(404).json({
        success: false,
        message: "Resume not found or unauthorized",
      });
    }

    const obj = updatedResume.toObject();
    obj.documentId = obj.resumeId;

    return res.status(200).json({
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
 * 🗑️ Delete a resume by resumeId
 */
const deleteResumeByResumeId = async (req, res) => {
  try {
    if (!req.user || !req.user.clerkId) {
      return res.status(401).json({ success: false, message: 'Unauthorized: missing user' });
    }

    const query = { resumeId: req.params.resumeId, userId: req.user.clerkId };
    const deletedResume = await Resume.findOneAndDelete(query);

    if (!deletedResume) {
      return res.status(404).json({
        success: false,
        message: "Resume not found or unauthorized",
      });
    }

    return res.status(200).json({
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

// ✅ Export all functions at once
module.exports = {
  createResume,
  getAllResumes,
  getResumeByResumeId,
  updateResumeByResumeId,
  deleteResumeByResumeId,
};
