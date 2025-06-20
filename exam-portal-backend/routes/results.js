const express = require('express');
const router = express.Router();
const { authenticateToken, requireAdmin } = require('../middleware/auth');
const { 
  submitExam, 
  getUserResults, 
  getResultDetails, 
  getExamResults 
} = require('../controllers/resultsController');
const { body } = require('express-validator');

// POST /results - Submit exam results
router.post('/', [
  authenticateToken,
  body('examId')
    .notEmpty()
    .withMessage('Exam ID is required'),
  body('answers')
    .isArray({ min: 1 })
    .withMessage('At least one answer is required'),
  body('answers.*.questionIndex')
    .isInt({ min: 0 })
    .withMessage('Valid question index is required'),
  body('answers.*.selectedAnswer')
    .isInt({ min: 0 })
    .withMessage('Valid selected answer is required'),
  body('answers.*.timeSpent')
    .optional()
    .isInt({ min: 0 })
    .withMessage('Time spent must be a positive number'),
  body('timeStarted')
    .isISO8601()
    .withMessage('Valid start time is required'),
  body('timeCompleted')
    .isISO8601()
    .withMessage('Valid completion time is required')
], submitExam);

// GET /results - Get user's own results
router.get('/', authenticateToken, getUserResults);

// GET /results/:id - Get specific result details
router.get('/:id', authenticateToken, getResultDetails);

// GET /results/exam/:examId - Get all results for an exam (admin only)
router.get('/exam/:examId', [
  authenticateToken,
  requireAdmin
], getExamResults);

module.exports = router; 