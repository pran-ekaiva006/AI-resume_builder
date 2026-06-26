const User = require('../models/User');
const bcrypt = require('bcryptjs');
const { signAccessToken, signRefreshToken, verifyRefreshToken } = require('../utils/tokenUtils');
const getCookieOptions = require('../utils/cookieOptions');
const jwt = require('jsonwebtoken');
const crypto = require('crypto');
const sendEmail = require('../utils/sendEmail');

const signup = async (req, res) => {
  try {
    const { firstName, lastName, email, password } = req.body;
    
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ message: 'Email already in use' });
    }

    const user = new User({ firstName, lastName, email, password });
    
    const accessToken = signAccessToken(user._id);
    const refreshToken = signRefreshToken(user._id);
    
    user.refreshTokenHash = await bcrypt.hash(refreshToken, 12);
    await user.save();

    res.cookie('accessToken', accessToken, getCookieOptions('access'));
    res.cookie('refreshToken', refreshToken, getCookieOptions('refresh'));

    return res.status(201).json({
      success: true,
      user: {
        id: user._id,
        firstName: user.firstName,
        lastName: user.lastName,
        email: user.email,
        role: user.role
      }
    });
  } catch (err) {
    console.error('Signup error:', err);
    res.status(500).json({ message: 'Server error during signup' });
  }
};

const login = async (req, res) => {
  try {
    const { email, password } = req.body;
    
    const user = await User.findOne({ email }).select('+password');
    if (!user || !(await user.comparePassword(password))) {
      return res.status(401).json({ message: 'Invalid email or password' });
    }

    const accessToken = signAccessToken(user._id);
    const refreshToken = signRefreshToken(user._id);
    
    user.refreshTokenHash = await bcrypt.hash(refreshToken, 12);
    await user.save();

    res.cookie('accessToken', accessToken, getCookieOptions('access'));
    res.cookie('refreshToken', refreshToken, getCookieOptions('refresh'));

    return res.status(200).json({
      success: true,
      user: {
        id: user._id,
        firstName: user.firstName,
        lastName: user.lastName,
        email: user.email,
        role: user.role
      }
    });
  } catch (err) {
    console.error('Login error:', err);
    res.status(500).json({ message: 'Server error during login' });
  }
};

const logout = async (req, res) => {
  try {
    const { refreshToken } = req.cookies;
    if (refreshToken) {
      try {
        const decoded = jwt.decode(refreshToken);
        if (decoded && decoded.sub) {
          await User.findByIdAndUpdate(decoded.sub, { refreshTokenHash: null });
        }
      } catch (err) {
         console.error('Error decoding refresh token during logout', err);
      }
    }
    
    res.clearCookie('accessToken', getCookieOptions('access'));
    res.clearCookie('refreshToken', getCookieOptions('refresh'));
    
    return res.status(200).json({ success: true, message: 'Logged out successfully' });
  } catch (err) {
    console.error('Logout error:', err);
    res.status(500).json({ message: 'Server error during logout' });
  }
};

const refresh = async (req, res) => {
  try {
    const { refreshToken } = req.cookies;
    if (!refreshToken) {
      return res.status(401).json({ message: 'No refresh token provided' });
    }

    let decoded;
    try {
      decoded = verifyRefreshToken(refreshToken);
    } catch (err) {
      return res.status(401).json({ message: 'Invalid or expired refresh token' });
    }

    const user = await User.findById(decoded.sub).select('+refreshTokenHash');
    if (!user || !user.refreshTokenHash) {
      return res.status(401).json({ message: 'Invalid refresh token' });
    }

    const isValid = await bcrypt.compare(refreshToken, user.refreshTokenHash);
    if (!isValid) {
      user.refreshTokenHash = null;
      await user.save();
      res.clearCookie('accessToken');
      res.clearCookie('refreshToken');
      return res.status(401).json({ message: 'Token reused, logged out' });
    }

    const newAccessToken = signAccessToken(user._id);
    const newRefreshToken = signRefreshToken(user._id);
    
    user.refreshTokenHash = await bcrypt.hash(newRefreshToken, 12);
    await user.save();

    res.cookie('accessToken', newAccessToken, getCookieOptions('access'));
    res.cookie('refreshToken', newRefreshToken, getCookieOptions('refresh'));

    return res.status(200).json({ success: true });
  } catch (err) {
    console.error('Refresh error:', err);
    res.status(500).json({ message: 'Server error during refresh' });
  }
};

const me = async (req, res) => {
  return res.status(200).json({ success: true, user: req.user });
};

const forgotPassword = async (req, res) => {
  try {
    const { email } = req.body;
    const user = await User.findOne({ email });
    
    // Always return success to prevent email enumeration
    if (!user) {
      return res.status(200).json({ success: true, message: 'If that email is registered, a reset link has been sent.' });
    }

    const resetToken = crypto.randomBytes(32).toString('hex');
    user.resetPasswordTokenHash = crypto.createHash('sha256').update(resetToken).digest('hex');
    user.resetPasswordExpires = Date.now() + 15 * 60 * 1000; // 15 mins
    await user.save();

    const clientUrl = process.env.CLIENT_URL || 'http://localhost:5173';
    const resetUrl = `${clientUrl}/auth/reset-password/${resetToken}`;

    await sendEmail({
      to: user.email,
      subject: 'Password Reset Request',
      text: `You requested a password reset. Please go to this link to reset your password: ${resetUrl}`
    });

    res.status(200).json({ success: true, message: 'If that email is registered, a reset link has been sent.' });
  } catch (err) {
    console.error('Forgot password error:', err);
    res.status(500).json({ message: 'Server error during forgot password' });
  }
};

const resetPassword = async (req, res) => {
  try {
    const { token } = req.params;
    const { password } = req.body;

    const hashedToken = crypto.createHash('sha256').update(token).digest('hex');

    const user = await User.findOne({
      resetPasswordTokenHash: hashedToken,
      resetPasswordExpires: { $gt: Date.now() }
    });

    if (!user) {
      return res.status(400).json({ message: 'Token is invalid or has expired' });
    }

    user.password = password; // pre-save hook will hash it
    user.resetPasswordTokenHash = undefined;
    user.resetPasswordExpires = undefined;
    await user.save();

    res.status(200).json({ success: true, message: 'Password has been reset' });
  } catch (err) {
    console.error('Reset password error:', err);
    res.status(500).json({ message: 'Server error during reset password' });
  }
};

const { OAuth2Client } = require('google-auth-library');
const googleClient = new OAuth2Client(process.env.GOOGLE_CLIENT_ID);

const googleLogin = async (req, res) => {
  try {
    const { credential } = req.body;
    if (!credential) {
      return res.status(400).json({ message: 'Google credential is required' });
    }

    // Verify the Google ID token
    const ticket = await googleClient.verifyIdToken({
      idToken: credential,
      audience: process.env.GOOGLE_CLIENT_ID,
    });
    const payload = ticket.getPayload();
    const { sub: googleId, email, given_name, family_name } = payload;

    // Find existing user by googleId or email
    let user = await User.findOne({ $or: [{ googleId }, { email }] });

    if (user) {
      // Link Google ID if user exists by email but hasn't linked Google yet
      if (!user.googleId) {
        user.googleId = googleId;
      }
    } else {
      // Create a new user (no password needed for Google accounts)
      user = new User({
        firstName: given_name || 'User',
        lastName: family_name || '',
        email,
        googleId,
      });
    }

    // Issue tokens (same flow as regular login)
    const accessToken = signAccessToken(user._id);
    const refreshToken = signRefreshToken(user._id);
    user.refreshTokenHash = await bcrypt.hash(refreshToken, 12);
    await user.save();

    res.cookie('accessToken', accessToken, getCookieOptions('access'));
    res.cookie('refreshToken', refreshToken, getCookieOptions('refresh'));

    return res.status(200).json({
      success: true,
      user: {
        id: user._id,
        firstName: user.firstName,
        lastName: user.lastName,
        email: user.email,
        role: user.role,
      },
    });
  } catch (err) {
    console.error('Google login error:', err);
    res.status(500).json({ message: 'Server error during Google login' });
  }
};

module.exports = { signup, login, logout, refresh, me, forgotPassword, resetPassword, googleLogin };

