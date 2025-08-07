// server/controllers/ResumeController.js

const Resume = require('../models/Resume'); // Use model once, reuse throughout

// Create new resume
const createResume = async (req, res) => {
  try {
    console.log("📥 Received resume data:", req.body);

    const resume = new Resume(req.body);
    await resume.save();

    console.log("✅ Resume saved to DB:", resume);

    // Map resumeId to documentId in the response
    const obj = resume.toObject();
    obj.documentId = obj.resumeId;

    res.status(201).json({
      message: "Resume created successfully",
      resume: obj,
    });
  } catch (error) {
    console.error("❌ Error creating resume:", error);
    res.status(500).json({ message: "Failed to create resume", error: error.message });
  }
};

// Get all resumes
const getAllResumes = async (req, res) => {
  try {
    const resumes = await Resume.find();
    // Map resumeId to documentId for each resume
    const mappedResumes = resumes.map(r => {
      const obj = r.toObject();
      obj.documentId = obj.resumeId;
      return obj;
    });
    res.json(mappedResumes);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching resumes', error: error.message });
  }
};

// Get resume by ID
const getResumeById = async (req, res) => {
  try {
    const resume = await Resume.findById(req.params.id);
    if (!resume) {
      return res.status(404).json({ message: 'Resume not found' });
    }
    // Map resumeId to documentId
    const obj = resume.toObject();
    obj.documentId = obj.resumeId;
    res.json(obj);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// Update resume by ID
// Update resume by ID
const updateResume = async (req, res) => {
  try {
    const { id } = req.params;
    const updateData = req.body;

    console.log("📥 Incoming data:", req.body);
    console.log("🪵 updateData:", updateData);

    const updatedResume = await Resume.findByIdAndUpdate(id, updateData, { new: true });

    if (!updatedResume) {
      return res.status(404).json({ message: 'Resume not found' });
    }

    // Map resumeId to documentId
    const obj = updatedResume.toObject();
    obj.documentId = obj.resumeId;

    res.json({
      message: 'Resume updated successfully',
      updatedResume: obj
    });
  } catch (error) {
    console.error("❌ Error updating resume:", error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};
module.exports = {
  createResume,
  getAllResumes,
  getResumeById,
  updateResume,
};