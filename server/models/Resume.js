const mongoose = require('mongoose');

const resumeSchema = new mongoose.Schema({
  resumeId: {
    type: String,
    required: true,
    unique: true,
  },
  title: String,
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