const Resume = require('../models/Resume');

// Create new resume
const createResume = async (req, res) => {
  try {
    console.log("📥 Received resume data:", req.body);

    const resume = new Resume(req.body);
    await resume.save();

    console.log("✅ Resume saved to DB:", resume);

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

// Get resume by resumeId (UUID)
const getResumeByResumeId = async (req, res) => {
  try {
    const resume = await Resume.findOne({ resumeId: req.params.resumeId });
    if (!resume) {
      return res.status(404).json({ message: 'Resume not found' });
    }

    const obj = resume.toObject();
    obj.documentId = obj.resumeId;
    res.json(obj);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// Update resume by resumeId (UUID)
const updateResumeByResumeId = async (req, res) => {
  try {
    const { resumeId } = req.params;
    const updateData = req.body;

    console.log("📥 Incoming update:", updateData);

    const updatedResume = await Resume.findOneAndUpdate(
      { resumeId },
      updateData,
      { new: true }
    );

    if (!updatedResume) {
      return res.status(404).json({ message: 'Resume not found' });
    }

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

// Delete resume by resumeId (UUID)
const deleteResumeByResumeId = async (req, res) => {
  try {
    const { resumeId } = req.params;

    const deletedResume = await Resume.findOneAndDelete({ resumeId });

    if (!deletedResume) {
      return res.status(404).json({ message: 'Resume not found' });
    }

    res.json({ message: 'Resume deleted successfully' });
  } catch (error) {
    console.error("❌ Error deleting resume:", error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

module.exports = {
  createResume,
  getAllResumes,
  getResumeByResumeId,
  updateResumeByResumeId,
  deleteResumeByResumeId
};