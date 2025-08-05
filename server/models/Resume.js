const mongoose = require('mongoose');

const resumeSchema = new mongoose.Schema({
  resumeId: {
    type: String,
    required: true,
    unique: true,
  },
  userEmail: {
    type: String,
    required: true,
  },
  firstName: {
    type: String,
    required: true,
  },
  lastName: {
    type: String,
    required: true,
  },
  title: {
    type: String,
    required: true,
  },
  themeColor: {
    type: String,
    default: '#ff6666',
  },
  phone: String,
  email: String,
  address: String,
  jobTitle: String,
  summery: String,
  experience: [
    {
      company: String,
      role: String,
      startYear: String,
      endYear: String,
      description: String,
    },
  ],
  education: [
    {
      school: String,
      degree: String,
      startYear: String,
      endYear: String,
    },
  ],
  skills: [String],
}, {
  timestamps: true,
});

module.exports = mongoose.model('Resume', resumeSchema);
