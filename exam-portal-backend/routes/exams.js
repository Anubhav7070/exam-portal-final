const express = require('express');
const router = express.Router();
const { authenticateToken, requireAdmin, requireStudent } = require('../middleware/auth');
const { 
  createExam, 
  listExams, 
  getExamDetails, 
  getExamDetailsAdmin,
  updateExam,
  deleteExam 
} = require('../controllers/examController');
const { body } = require('express-validator');

// POST /exams (admin only)
router.post('/', [
  authenticateToken,
  requireAdmin,
  body('title')
    .notEmpty()
    .withMessage('Title is required')
    .isLength({ max: 200 })
    .withMessage('Title must be less than 200 characters'),
  body('description')
    .optional()
    .isLength({ max: 1000 })
    .withMessage('Description must be less than 1000 characters'),
  body('subject')
    .notEmpty()
    .withMessage('Subject is required'),
  body('duration')
    .isInt({ min: 1, max: 480 })
    .withMessage('Duration must be between 1 and 480 minutes'),
  body('questions')
    .isArray({ min: 1 })
    .withMessage('At least one question is required'),
  body('questions.*.question')
    .notEmpty()
    .withMessage('Question text is required'),
  body('questions.*.options')
    .isArray({ min: 2, max: 6 })
    .withMessage('Each question must have 2-6 options'),
  body('questions.*.correctAnswer')
    .isInt({ min: 0 })
    .withMessage('Correct answer index is required'),
  body('questions.*.points')
    .optional()
    .isInt({ min: 1 })
    .withMessage('Points must be at least 1'),
  body('startTime')
    .isISO8601()
    .withMessage('Valid start time is required'),
  body('endTime')
    .isISO8601()
    .withMessage('Valid end time is required'),
  body('passingScore')
    .optional()
    .isInt({ min: 0 })
    .withMessage('Passing score must be a positive number')
], createExam);

// GET /exams (available for all authenticated users)
router.get('/', authenticateToken, listExams);

// GET /exams/:id (student view - no correct answers)
router.get('/:id', [
  authenticateToken,
  requireStudent
], getExamDetails);

// GET /exams/:id/admin (admin view - includes correct answers)
router.get('/:id/admin', [
  authenticateToken,
  requireAdmin
], getExamDetailsAdmin);

// PUT /exams/:id (admin only)
router.put('/:id', [
  authenticateToken,
  requireAdmin,
  body('title')
    .optional()
    .isLength({ max: 200 })
    .withMessage('Title must be less than 200 characters'),
  body('description')
    .optional()
    .isLength({ max: 1000 })
    .withMessage('Description must be less than 1000 characters'),
  body('duration')
    .optional()
    .isInt({ min: 1, max: 480 })
    .withMessage('Duration must be between 1 and 480 minutes'),
  body('startTime')
    .optional()
    .isISO8601()
    .withMessage('Valid start time is required'),
  body('endTime')
    .optional()
    .isISO8601()
    .withMessage('Valid end time is required'),
  body('passingScore')
    .optional()
    .isInt({ min: 0 })
    .withMessage('Passing score must be a positive number')
], updateExam);

// DELETE /exams/:id (admin only)
router.delete('/:id', [
  authenticateToken,
  requireAdmin
], deleteExam);

module.exports = router; 