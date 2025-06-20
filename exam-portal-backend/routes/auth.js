const express = require('express');
const router = express.Router();
const { signup, login, getProfile, updateProfile } = require('../controllers/authController');
const { authenticateToken } = require('../middleware/auth');
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

module.exports = router; 