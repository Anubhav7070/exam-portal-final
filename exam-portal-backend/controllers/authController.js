const User = require('../models/User');
const { validationResult } = require('express-validator');
const jwt = require('jsonwebtoken');
const nodemailer = require('nodemailer');

// Utility to send email
async function sendEmail(to, subject, text) {
  const transporter = nodemailer.createTransport({
    host: process.env.SMTP_HOST,
    port: process.env.SMTP_PORT,
    secure: process.env.SMTP_SECURE === 'true',
    auth: {
      user: process.env.SMTP_USER,
      pass: process.env.SMTP_PASS
    }
  });
  await transporter.sendMail({ from: process.env.SMTP_FROM, to, subject, text });
}

exports.signup = async (req, res, next) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ 
        error: 'Validation failed', 
        details: errors.array() 
      });
    }
    
    const { username, email, password, firstName, lastName, role = 'student' } = req.body;
    
    // Check if user already exists
    const existingUser = await User.findOne({ 
      $or: [{ email }, { username }] 
    });
    
    if (existingUser) {
      return res.status(400).json({ 
        error: 'User with this email or username already exists' 
      });
    }
    
    // Create new user
    const user = new User({
      username,
      email,
      password,
      firstName,
      lastName,
      role
    });
    
    await user.save();
    
    // Generate JWT token
    const token = jwt.sign(
      { userId: user._id, role: user.role },
      process.env.JWT_SECRET,
      { expiresIn: process.env.JWT_EXPIRE || '24h' }
    );
    
    res.status(201).json({ 
      message: 'User registered successfully',
      token,
      user: {
        id: user._id,
        username: user.username,
        email: user.email,
        role: user.role,
        firstName: user.firstName,
        lastName: user.lastName
      }
    });
  } catch (err) {
    console.error('Signup process error:', err);
    next(err);
  }
};

exports.login = async (req, res, next) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ 
        error: 'Validation failed', 
        details: errors.array() 
      });
    }

    const { username, password, role } = req.body;

    // Find user by username
    const user = await User.findOne({ username });
    
    if (!user) {
      return res.status(401).json({ error: 'Invalid username or password' });
    }
    
    // Check if user is active
    if (!user.isActive) {
      return res.status(401).json({ error: 'Account is deactivated' });
    }
    
    // Check role matches
    if (role && user.role !== role) {
      return res.status(401).json({ error: 'Role does not match' });
    }
    
    // Verify password
    const isPasswordValid = await user.comparePassword(password);
    
    if (!isPasswordValid) {
      return res.status(401).json({ error: 'Invalid username or password' });
    }
    
    // Update last login
    user.lastLogin = new Date();
    await user.save();
    
    // Generate JWT token
    const token = jwt.sign(
      { userId: user._id, role: user.role },
      process.env.JWT_SECRET,
      { expiresIn: process.env.JWT_EXPIRE || '24h' }
    );

    res.json({
      message: "Logged in successfully",
      token,
      user: {
        id: user._id,
        username: user.username,
        email: user.email,
        role: user.role,
        firstName: user.firstName,
        lastName: user.lastName
      },
    });
  } catch (err) {
    console.error('Login process error:', err);
    next(err);
  }
};

exports.getProfile = async (req, res, next) => {
  try {
    const user = await User.findById(req.user.userId).select('-password');
    
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }
    
    res.json({ user });
  } catch (err) {
    console.error('Get profile error:', err);
    next(err);
  }
};

exports.updateProfile = async (req, res, next) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ 
        error: 'Validation failed', 
        details: errors.array() 
      });
    }
    
    const { firstName, lastName, email } = req.body;
    
    const user = await User.findById(req.user.userId);
    
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }
    
    // Check if email is already taken by another user
    if (email && email !== user.email) {
      const existingUser = await User.findOne({ email });
      if (existingUser) {
        return res.status(400).json({ error: 'Email already taken' });
      }
    }
    
    // Update user fields
    if (firstName) user.firstName = firstName;
    if (lastName) user.lastName = lastName;
    if (email) user.email = email;
    
    await user.save();
    
    res.json({ 
      message: 'Profile updated successfully',
      user: {
        id: user._id,
        username: user.username,
        email: user.email,
        role: user.role,
        firstName: user.firstName,
        lastName: user.lastName
      }
    });
  } catch (err) {
    console.error('Update profile error:', err);
    next(err);
  }
};

// Send verification OTP to user's email
exports.sendVerificationOTP = async (req, res, next) => {
  try {
    const { email } = req.body;
    if (!email) return res.status(400).json({ error: 'Email is required' });
    const user = await User.findOne({ email });
    if (!user) return res.status(404).json({ error: 'User not found' });
    if (user.isEmailVerified) return res.status(400).json({ error: 'Email already verified' });
    // Generate 6-digit code
    const code = Math.floor(100000 + Math.random() * 900000).toString();
    user.emailVerificationCode = code;
    user.emailVerificationExpires = new Date(Date.now() + 10 * 60 * 1000); // 10 min
    await user.save();
    await sendEmail(user.email, 'Examinia Email Verification', `Your verification code is: ${code}`);
    res.json({ message: 'Verification code sent to email' });
  } catch (err) {
    next(err);
  }
};

// Verify email with OTP
exports.verifyEmail = async (req, res, next) => {
  try {
    const { email, code } = req.body;
    if (!email || !code) return res.status(400).json({ error: 'Email and code are required' });
    const user = await User.findOne({ email });
    if (!user) return res.status(404).json({ error: 'User not found' });
    if (user.isEmailVerified) return res.status(400).json({ error: 'Email already verified' });
    if (!user.emailVerificationCode || !user.emailVerificationExpires) return res.status(400).json({ error: 'No verification code found' });
    if (user.emailVerificationCode !== code) return res.status(400).json({ error: 'Invalid code' });
    if (user.emailVerificationExpires < new Date()) return res.status(400).json({ error: 'Code expired' });
    user.isEmailVerified = true;
    user.emailVerificationCode = undefined;
    user.emailVerificationExpires = undefined;
    await user.save();
    res.json({ message: 'Email verified successfully' });
  } catch (err) {
    next(err);
  }
};

// Send login OTP to user's email
exports.sendLoginOTP = async (req, res, next) => {
  try {
    const { email } = req.body;
    if (!email) return res.status(400).json({ error: 'Email is required' });
    const user = await User.findOne({ email });
    if (!user) return res.status(404).json({ error: 'User not found' });
    if (!user.isEmailVerified) return res.status(400).json({ error: 'Email not verified' });
    // Generate 6-digit code
    const code = Math.floor(100000 + Math.random() * 900000).toString();
    user.loginOTP = code;
    user.loginOTPExpires = new Date(Date.now() + 10 * 60 * 1000); // 10 min
    await user.save();
    await sendEmail(user.email, 'Examinia Login OTP', `Your login code is: ${code}`);
    res.json({ message: 'Login OTP sent to email' });
  } catch (err) {
    next(err);
  }
};

// Verify login OTP and log in
exports.verifyLoginOTP = async (req, res, next) => {
  try {
    const { email, code } = req.body;
    if (!email || !code) return res.status(400).json({ error: 'Email and code are required' });
    const user = await User.findOne({ email });
    if (!user) return res.status(404).json({ error: 'User not found' });
    if (!user.isEmailVerified) return res.status(400).json({ error: 'Email not verified' });
    if (!user.loginOTP || !user.loginOTPExpires) return res.status(400).json({ error: 'No login code found' });
    if (user.loginOTP !== code) return res.status(400).json({ error: 'Invalid code' });
    if (user.loginOTPExpires < new Date()) return res.status(400).json({ error: 'Code expired' });
    user.loginOTP = undefined;
    user.loginOTPExpires = undefined;
    user.lastLogin = new Date();
    await user.save();
    const jwt = require('jsonwebtoken');
    const token = jwt.sign(
      { userId: user._id, role: user.role },
      process.env.JWT_SECRET,
      { expiresIn: process.env.JWT_EXPIRE || '24h' }
    );
    res.json({
      message: 'Logged in successfully',
      token,
      user: {
        id: user._id,
        username: user.username,
        email: user.email,
        role: user.role,
        firstName: user.firstName,
        lastName: user.lastName
      }
    });
  } catch (err) {
    next(err);
  }
};

// Admin: Delete a user by ID
exports.deleteUser = async (req, res, next) => {
  try {
    const { id } = req.params;
    if (req.user.userId === id) return res.status(400).json({ error: 'Admin cannot delete themselves' });
    const user = await User.findByIdAndDelete(id);
    if (!user) return res.status(404).json({ error: 'User not found' });
    res.json({ message: 'User deleted successfully' });
  } catch (err) {
    next(err);
  }
};

// Admin: Get all users
exports.getAllUsers = async (req, res, next) => {
  try {
    const users = await User.find({}, '-password');
    res.json(users);
  } catch (err) {
    next(err);
  }
};

// Admin: Update user details
exports.updateUser = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { firstName, lastName, email } = req.body;
    const user = await User.findById(id);
    if (!user) return res.status(404).json({ error: 'User not found' });
    if (email && email !== user.email) {
      const existing = await User.findOne({ email });
      if (existing) return res.status(400).json({ error: 'Email already in use' });
      user.email = email;
      user.isEmailVerified = false; // Require re-verification if email changes
    }
    if (firstName) user.firstName = firstName;
    if (lastName) user.lastName = lastName;
    await user.save();
    res.json({ message: 'User updated', user });
  } catch (err) {
    next(err);
  }
};

// Admin: Toggle user active status
exports.toggleUserActive = async (req, res, next) => {
  try {
    const { id } = req.params;
    const user = await User.findById(id);
    if (!user) return res.status(404).json({ error: 'User not found' });
    user.isActive = !user.isActive;
    await user.save();
    res.json({ message: `User ${user.isActive ? 'activated' : 'deactivated'}` });
  } catch (err) {
    next(err);
  }
};

// Admin: Change user role
exports.changeUserRole = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { role } = req.body;
    if (!['student', 'admin'].includes(role)) return res.status(400).json({ error: 'Invalid role' });
    const user = await User.findById(id);
    if (!user) return res.status(404).json({ error: 'User not found' });
    user.role = role;
    await user.save();
    res.json({ message: 'User role updated', user });
  } catch (err) {
    next(err);
  }
};

// Admin: Trigger password reset email
exports.triggerPasswordReset = async (req, res, next) => {
  try {
    const { id } = req.params;
    const user = await User.findById(id);
    if (!user) return res.status(404).json({ error: 'User not found' });
    // Generate a reset code (for demo, just a random 6-digit code)
    const code = Math.floor(100000 + Math.random() * 900000).toString();
    user.resetPasswordCode = code;
    user.resetPasswordExpires = new Date(Date.now() + 10 * 60 * 1000); // 10 min
    await user.save();
    await sendEmail(user.email, 'Examinia Password Reset', `Your password reset code is: ${code}`);
    res.json({ message: 'Password reset email sent' });
  } catch (err) {
    next(err);
  }
};

// Admin: Get all students
exports.getAllStudents = async (req, res, next) => {
  try {
    const students = await User.find({ role: 'student' }, '-password');
    res.json(students);
  } catch (err) {
    next(err);
  }
}; 