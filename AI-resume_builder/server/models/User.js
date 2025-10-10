// models/User.js
const mongoose = require('mongoose');
const bcrypt = require('bcrypt');

const userSchema = new mongoose.Schema({
  email: {
    type: String,
    required: true,
    unique: true,
    lowercase: true,
    match: [/.+@.+\..+/, 'Invalid email']
  },
  password: {
    type: String,
    required: true,
    minlength: 6,
    select: false
  },
  provider: {
    type: String,
    enum: ['email', 'google', 'github', 'microsoft'],
    default: 'email'
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

// Password hashing
userSchema.pre('save', async function (next) {
  if (!this.isModified('password')) return next();
  this.password = await bcrypt.hash(this.password, 12);
  next();
});

module.exports = mongoose.model('User', userSchema);
