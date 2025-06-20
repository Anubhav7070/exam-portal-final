const express = require('express');
const router = express.Router();
const { signup, login, getProfile, updateProfile, sendVerificationOTP, verifyEmail, sendLoginOTP, verifyLoginOTP, deleteUser, getAllUsers } = require('../controllers/authController');
const { authenticateToken, requireAdmin } = require('../middleware/auth');
const { body } = require('express-validator');

// POST /auth/signup
router.post('/signup', [
  body('username')
    .isLength({ min: 3, max: 30 })
    .withMessage('Username must be between 3 and 30 characters')
    .matches(/^[a-zA-Z0-9_]+$/)
    .withMessage('Username can only contain letters, numbers, and underscores'),
  body('email')
    .isEmail()
    .withMessage('Valid email is required')
    .normalizeEmail(),
  body('password')
    .isLength({ min: 6 })
    .withMessage('Password must be at least 6 characters'),
  body('firstName')
    .notEmpty()
    .withMessage('First name is required')
    .isLength({ max: 50 })
    .withMessage('First name must be less than 50 characters'),
  body('lastName')
    .notEmpty()
    .withMessage('Last name is required')
    .isLength({ max: 50 })
    .withMessage('Last name must be less than 50 characters'),
  body('role')
    .optional()
    .isIn(['admin', 'student'])
    .withMessage('Role must be admin or student')
], signup);

// POST /auth/login
router.post('/login', [
  body('username')
    .notEmpty()
    .withMessage('Username is required'),
  body('password')
    .exists()
    .withMessage('Password is required'),
  body('role')
    .isIn(['admin', 'student'])
    .withMessage('Role must be admin or student')
], login);

// GET /auth/profile (protected)
router.get('/profile', authenticateToken, getProfile);

// PUT /auth/profile (protected)
router.put('/profile', [
  authenticateToken,
  body('firstName')
    .optional()
    .isLength({ max: 50 })
    .withMessage('First name must be less than 50 characters'),
  body('lastName')
    .optional()
    .isLength({ max: 50 })
    .withMessage('Last name must be less than 50 characters'),
  body('email')
    .optional()
    .isEmail()
    .withMessage('Valid email is required')
    .normalizeEmail()
], updateProfile);

// POST /auth/send-verification
router.post('/send-verification', sendVerificationOTP);

// POST /auth/verify-email
router.post('/verify-email', verifyEmail);

// POST /auth/login-otp
router.post('/login-otp', sendLoginOTP);

// POST /auth/verify-login-otp
router.post('/verify-login-otp', verifyLoginOTP);

// DELETE /auth/user/:id (admin only)
router.delete('/user/:id', authenticateToken, requireAdmin, deleteUser);

// GET /auth/users (admin only)
router.get('/users', authenticateToken, requireAdmin, getAllUsers);

// PATCH /auth/user/:id (admin only)
router.patch('/user/:id', authenticateToken, requireAdmin, require('../controllers/authController').updateUser);

// PATCH /auth/user/:id/active (admin only)
router.patch('/user/:id/active', authenticateToken, requireAdmin, require('../controllers/authController').toggleUserActive);

// PATCH /auth/user/:id/role (admin only)
router.patch('/user/:id/role', authenticateToken, requireAdmin, require('../controllers/authController').changeUserRole);

// POST /auth/user/:id/reset-password (admin only)
router.post('/user/:id/reset-password', authenticateToken, requireAdmin, require('../controllers/authController').triggerPasswordReset);

module.exports = router; 