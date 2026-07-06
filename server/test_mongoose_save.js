const mongoose = require('mongoose');
const User = require('./models/User');
require('dotenv').config();

mongoose.connect(process.env.MONGO_URI || 'mongodb://localhost:27017/ai-resume-builder').then(async () => {
  const user = new User({
    firstName: 'Test',
    email: 'test' + Date.now() + '@test.com',
  });
  
  await user.save();
  console.log("After save createdAt:", user.createdAt);
  process.exit(0);
});
