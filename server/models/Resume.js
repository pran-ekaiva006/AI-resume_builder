const mongoose = require('mongoose');
const { stringify } = require('querystring');

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
      title: String,         // ✅ not 'role'
      companyName: String,   // ✅ not 'company'
      city: String,
      state: String,
      startDate: String,
      endDate: String,
      workSummery: String,   // ✅ not 'description'
    },
  ],
  
  education: [
    {
      universityName: String,
      degree: String,
      startYear: String,
      endYear: String,
      major:String,
      description:String,
    },
  ],
  skills: [String],
}, {
  timestamps: true,
});

module.exports = mongoose.model('Resume', resumeSchema);
