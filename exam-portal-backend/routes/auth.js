const express = require('express');
const router = express.Router();
const { signup, login } = require('../controllers/authController');
const { body } = require('express-validator');

// POST /auth/signup
router.post('/signup', [
  body('email').isEmail(),
  body('password').isLength({ min: 6 }),
  body('role').isIn(['admin', 'student'])
], signup);

// POST /auth/login
router.post('/login', [
  body('email').isEmail(),
  body('password').exists()
], login);

module.exports = router; 