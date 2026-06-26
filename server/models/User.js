const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const userSchema = new mongoose.Schema({
  firstName: { type: String, required: true, trim: true },
  lastName: { type: String, trim: true },
  email: { type: String, required: true, unique: true, lowercase: true, trim: true },
  password: {
    type: String,
    required: function () { return !this.googleId; }, // only required for email/password accounts
    select: false,
  },
  googleId: { type: String, unique: true, sparse: true }, // sparse allows multiple nulls
  role: { type: String, enum: ['user', 'admin'], default: 'user' },
  refreshTokenHash: { type: String, select: false },
  resetPasswordTokenHash: { type: String, select: false },
  resetPasswordExpires: { type: Date, select: false },
}, { timestamps: true });

userSchema.pre('save', async function (next) {
  if (!this.isModified('password') || !this.password) return next();
  this.password = await bcrypt.hash(this.password, 12);
  next();
});

userSchema.methods.comparePassword = function (candidate) {
  if (!this.password) return Promise.resolve(false); // Google-only users have no password
  return bcrypt.compare(candidate, this.password);
};

module.exports = mongoose.model('User', userSchema);