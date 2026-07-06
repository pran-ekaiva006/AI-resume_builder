const mongoose = require('mongoose');
const User = require('./models/User');
require('dotenv').config();

mongoose.connect(process.env.MONGO_URI || 'mongodb://localhost:27017/ai-resume-builder', {
  useNewUrlParser: true,
  useUnifiedTopology: true,
}).then(async () => {
  const user = await User.findOne({ email: 'demo-d70f3008-f956-400a-8820-1fd5c29d66de@demo.local' });
  console.log("DB User:", user);
  process.exit(0);
}).catch(err => {
  console.error(err);
  process.exit(1);
});
