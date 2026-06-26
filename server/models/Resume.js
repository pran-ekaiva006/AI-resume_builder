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

  // 🔗 Linked to MongoDB User
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
    index: true,
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
    match: [/^#([0-9A-F]{3}){1,2}$/i, "Invalid theme color"],
  },
  phone: String,
  address: String,
  summery: String,

  // Experience Section
  experience: [
    {
      title: { type: String, required: true },
      companyName: { type: String, required: true },
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
      universityName: { type: String, required: true },
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
      name: { type: String, required: true },
      rating: { type: Number, min: 0, max: 100 },
    },
  ],
}, {
  timestamps: true,
});

module.exports = mongoose.model('Resume', resumeSchema);
