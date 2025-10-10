const mongoose = require('mongoose');
const { v4: uuidv4 } = require('uuid');

const resumeSchema = new mongoose.Schema({
  resumeId: {
    type: String,
    default: uuidv4, // auto-generate unique resume ID
    unique: true,
  },

  // 🧾 Resume Title
  title: {
    type: String,
    required: false,
    default: "Untitled Resume",
    trim: true, // ✅ removes accidental spaces
  },

  // 🔗 Linked to Clerk user
  userId: {
    type: String, // Clerk userId from req.user.clerkId
    required: true,
  },

  // Basic Info
  userEmail: {
    type: String,
    required: true,
    lowercase: true,
    trim: true,
  },

  firstName: String,
  lastName: String,
  jobTitle: String,
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
