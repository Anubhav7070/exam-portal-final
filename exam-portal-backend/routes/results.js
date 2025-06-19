const express = require('express');
const router = express.Router();
const { authenticateToken } = require('../middleware/auth');
const resultsController = require('../controllers/resultsController');

// GET /results/:userId
router.get('/:userId', authenticateToken, resultsController.getUserResults);

module.exports = router; 