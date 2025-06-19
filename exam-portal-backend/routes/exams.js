const express = require('express');
const router = express.Router();
const { authenticateToken, authorizeRoles } = require('../middleware/auth');
const examController = require('../controllers/examController');
const { body } = require('express-validator');

// POST /exams (admin only)
router.post('/',
  authenticateToken,
  authorizeRoles('admin'),
  [
    body('title').notEmpty(),
    body('duration').isInt({ min: 1 }),
    body('questions').isArray({ min: 1 })
  ],
  examController.createExam
);

// GET /exams (student only)
router.get('/',
  authenticateToken,
  authorizeRoles('student'),
  examController.listExams
);

// GET /exams/:id (student only)
router.get('/:id',
  authenticateToken,
  authorizeRoles('student'),
  examController.getExamDetails
);

// POST /exams/:id/submit (student only)
router.post('/:id/submit',
  authenticateToken,
  authorizeRoles('student'),
  [body('answers').isArray({ min: 1 })],
  examController.submitExam
);

module.exports = router; 