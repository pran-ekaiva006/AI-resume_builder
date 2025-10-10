const mongoose = require('mongoose');
const { v4: uuidv4 } = require('uuid');

const resumeSchema = new mongoose.Schema({
  resumeId: {
    type: String,
    default: uuidv4, // auto-generate unique resume ID
    unique: true,
  },

  // 🔗 Linked to Clerk user (instead of email-based ownership)
  userId: {
    type: String, // Clerk userId from req.user.clerkId
    required: true,
  },

  // Basic Info
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
  jobTitle: {
    type: String,
    required: true,
  },
  themeColor: {
    type: String,
    default: '#ff6666',
  },
  phone: String,
  address: String,
  summery: String,

  // Experience Section
  experience: [
    {
      id: Number,
      title: String,
      companyName: String,
      city: String,
      state: String,
      startDate: String,
      endDate: String,
      currentlyWorking: Boolean,
      workSummery: String,
    },
  ],

  // Education Section
  education: [
    {
      id: Number,
      universityName: String,
      degree: String,
      major: String,
      description: String,
      startDate: String,
      endDate: String,
    },
  ],

  // Skills Section
  skills: [
    {
      id: Number,
      name: String,
      rating: Number,
    },
  ],
}, {
  timestamps: true,
});

module.exports = mongoose.model('Resume', resumeSchema);
