const User = require('../models/User');
const Resume = require('../models/Resume');
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


    const tokenPreHash = crypto.createHash('sha256').update(refreshToken).digest('base64');
    user.refreshTokenHash = await bcrypt.hash(tokenPreHash, 12);
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
        role: user.role,
        createdAt: user.createdAt
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

    // Fix bcrypt 72-byte truncation: pre-hash the JWT with SHA-256
    const tokenPreHash = crypto.createHash('sha256').update(refreshToken).digest('base64');
    user.refreshTokenHash = await bcrypt.hash(tokenPreHash, 12);
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
        createdAt: user.createdAt
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


    const incomingTokenPreHash = crypto.createHash('sha256').update(refreshToken).digest('base64');
    const isValid = await bcrypt.compare(incomingTokenPreHash, user.refreshTokenHash);
    if (!isValid) {
      user.refreshTokenHash = null;
      await user.save();
      res.clearCookie('accessToken');
      res.clearCookie('refreshToken');
      return res.status(401).json({ message: 'Token reused, logged out' });
    }

    const newAccessToken = signAccessToken(user._id);
    const newRefreshToken = signRefreshToken(user._id);


    const newTokenPreHash = crypto.createHash('sha256').update(newRefreshToken).digest('base64');
    user.refreshTokenHash = await bcrypt.hash(newTokenPreHash, 12);
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

    user.password = password;
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


    const ticket = await googleClient.verifyIdToken({
      idToken: credential,
      audience: process.env.GOOGLE_CLIENT_ID,
    });
    const payload = ticket.getPayload();
    const { sub: googleId, email, given_name, family_name } = payload;


    let user = await User.findOne({ $or: [{ googleId }, { email }] });

    if (user) {

      if (!user.googleId) {
        user.googleId = googleId;
      }
    } else {

      user = new User({
        firstName: given_name || 'User',
        lastName: family_name || '',
        email,
        googleId,
      });
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
        role: user.role,
        createdAt: user.createdAt
      },
    });
  } catch (err) {
    console.error('Google login error:', err);
    res.status(500).json({ message: 'Server error during Google login' });
  }
};

const demoLogin = async (req, res) => {
  try {
    const demoId = crypto.randomUUID();
    const email = `demo-${demoId}@demo.local`;

    const user = new User({
      firstName: 'Demo',
      lastName: 'User',
      email,
      isDemo: true,
    });


    const accessToken = signAccessToken(user._id);
    const refreshToken = signRefreshToken(user._id);
    user.refreshTokenHash = await bcrypt.hash(refreshToken, 12);
    await user.save();

    const demoResume = new Resume({
      title: 'Demo Resume',
      resumeId: crypto.randomUUID(),
      userEmail: user.email,
      userId: user._id,
      userName: 'Demo User',
      firstName: 'Demo',
      lastName: 'User',
      jobTitle: 'Software Engineer',
      themeColor: '#3498db',
      summery: 'Dedicated software engineer with a passion for building scalable web applications. Experienced in React, Node.js, and modern cloud architectures.',
      experience: [
        {
          title: 'Senior Developer',
          companyName: 'Tech Corp',
          city: 'San Francisco',
          state: 'CA',
          startDate: '2020-01',
          endDate: 'Present',
          workSummery: 'Led frontend development for a high-traffic SaaS platform. Improved performance by 40% and mentored junior developers.'
        }
      ],
      education: [
        {
          universityName: 'State University',
          degree: 'BS',
          major: 'Computer Science',
          startDate: '2015-08',
          endDate: '2019-05',
          description: 'Graduated with honors. Participated in multiple hackathons.'
        }
      ],
      skills: [
        { name: 'React', rating: 5 },
        { name: 'JavaScript', rating: 5 },
        { name: 'Node.js', rating: 4 },
        { name: 'CSS', rating: 4 }
      ]
    });
    await demoResume.save();

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
        isDemo: user.isDemo,
        createdAt: user.createdAt
      }
    });
  } catch (err) {
    console.error('Demo login error:', err);
    res.status(500).json({ message: 'Server error during demo login' });
  }
};

module.exports = { signup, login, logout, refresh, me, forgotPassword, resetPassword, googleLogin, demoLogin };

