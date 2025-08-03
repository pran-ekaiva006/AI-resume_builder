// server/models/Resume.js
const mongoose = require("mongoose");

const resumeSchema = new mongoose.Schema({
  name: String,
  email: String,
  phone: String,
  summary: String,
  education: [
    {
      school: String,
      degree: String,
      startYear: String,
      endYear: String
    }
  ],
  experience: [
    {
      company: String,
      role: String,
      startYear: String,
      endYear: String,
      description: String
    }
  ],
  projects: [
    {
      title: String,
      description: String,
      technologies: [String]
    }
  ],
  skills: [String]
});

module.exports = mongoose.model("Resume", resumeSchema);