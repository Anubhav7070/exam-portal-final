const Result = require('../models/Result');
const Exam = require('../models/Exam');
const User = require('../models/User');
const { validationResult } = require('express-validator');

// POST /results - Submit exam results
exports.submitExam = async (req, res, next) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }
    
    const { examId, answers, timeStarted, timeCompleted } = req.body;
    const studentId = req.user.userId;
    
    // Get the exam
    const exam = await Exam.findById(examId);
    if (!exam) {
      return res.status(404).json({ error: 'Exam not found' });
    }
    
    // Check if exam is active and within time window
    const now = new Date();
    if (!exam.isActive || now < exam.startTime || now > exam.endTime) {
      return res.status(400).json({ error: 'Exam is not currently available' });
    }
    
    // Check if student has already taken this exam
    const existingResult = await Result.findOne({ 
      student: studentId, 
      exam: examId 
    });
    
    if (existingResult && !exam.allowRetake) {
      return res.status(400).json({ error: 'You have already taken this exam' });
    }
    
    // Calculate attempt number
    const attemptNumber = existingResult ? existingResult.attemptNumber + 1 : 1;
    
    if (attemptNumber > exam.maxAttempts) {
      return res.status(400).json({ error: 'Maximum attempts exceeded for this exam' });
    }
    
    // Process answers and calculate score
    let score = 0;
    let totalPoints = 0;
    const processedAnswers = [];
    
    for (let i = 0; i < answers.length; i++) {
      const answer = answers[i];
      const question = exam.questions[answer.questionIndex];
      
      if (question) {
        const isCorrect = answer.selectedAnswer === question.correctAnswer;
        const pointsEarned = isCorrect ? question.points : 0;
        
        processedAnswers.push({
          questionIndex: answer.questionIndex,
          selectedAnswer: answer.selectedAnswer,
          isCorrect,
          pointsEarned,
          timeSpent: answer.timeSpent || 0
        });
        
        score += pointsEarned;
        totalPoints += question.points;
      }
    }
    
    // Calculate percentage and check if passed
    const percentage = totalPoints > 0 ? Math.round((score / totalPoints) * 100) : 0;
    const isPassed = exam.passingScore ? percentage >= exam.passingScore : true;
    
    // Calculate duration
    const duration = timeCompleted && timeStarted ? 
      Math.floor((new Date(timeCompleted) - new Date(timeStarted)) / 1000) : 0;
    
    // Create or update result
    const resultData = {
      student: studentId,
      exam: examId,
      answers: processedAnswers,
      score,
      totalPoints,
      percentage,
      timeStarted: new Date(timeStarted),
      timeCompleted: new Date(timeCompleted),
      duration,
      attemptNumber,
      isPassed,
      status: 'completed',
      ipAddress: req.ip,
      userAgent: req.get('User-Agent')
    };
    
    let result;
    if (existingResult) {
      result = await Result.findByIdAndUpdate(
        existingResult._id,
        resultData,
        { new: true, runValidators: true }
      );
    } else {
      result = new Result(resultData);
      await result.save();
    }
    
    // Populate exam details for response
    await result.populate('exam', 'title subject');
    
    res.status(201).json({
      message: 'Exam submitted successfully',
      result: {
        id: result._id,
        score: result.score,
        totalPoints: result.totalPoints,
        percentage: result.percentage,
        isPassed: result.isPassed,
        exam: result.exam
      }
    });
    
  } catch (err) {
    console.error('Submit exam error:', err);
    next(err);
  }
};

// GET /results - Get user's results
exports.getUserResults = async (req, res, next) => {
  try {
    const userId = req.user.userId;
    const { examId, status } = req.query;
    
    const filter = { student: userId };
    if (examId) filter.exam = examId;
    if (status) filter.status = status;
    
    const results = await Result.find(filter)
      .populate('exam', 'title subject duration totalPoints')
      .sort({ createdAt: -1 });
    
    res.json(results);
  } catch (err) {
    console.error('Get user results error:', err);
    next(err);
  }
};

// GET /results/:id - Get specific result details
exports.getResultDetails = async (req, res, next) => {
  try {
    const { id } = req.params;
    const userId = req.user.userId;
    
    const result = await Result.findById(id)
      .populate('exam', 'title subject questions')
      .populate('student', 'firstName lastName email');
    
    if (!result) {
      return res.status(404).json({ error: 'Result not found' });
    }
    
    // Check if user has permission to view this result
    if (result.student._id.toString() !== userId && req.user.role !== 'admin') {
      return res.status(403).json({ error: 'Access denied' });
    }
    
    // For students, don't include correct answers unless showResults is true
    if (req.user.role === 'student' && !result.exam.showResults) {
      result.exam.questions = result.exam.questions.map(q => ({
        question: q.question,
        options: q.options,
        points: q.points
      }));
    }
    
    res.json(result);
  } catch (err) {
    console.error('Get result details error:', err);
    next(err);
  }
};

// GET /results/exam/:examId - Get all results for an exam (admin only)
exports.getExamResults = async (req, res, next) => {
  try {
    const { examId } = req.params;
    
    const results = await Result.find({ exam: examId })
      .populate('student', 'firstName lastName email username')
      .populate('exam', 'title subject')
      .sort({ score: -1, timeCompleted: -1 });
    
    // Calculate statistics
    const totalResults = results.length;
    const passedResults = results.filter(r => r.isPassed).length;
    const averageScore = totalResults > 0 ? 
      results.reduce((sum, r) => sum + r.percentage, 0) / totalResults : 0;
    
    res.json({
      results,
      statistics: {
        totalResults,
        passedResults,
        failedResults: totalResults - passedResults,
        passRate: totalResults > 0 ? Math.round((passedResults / totalResults) * 100) : 0,
        averageScore: Math.round(averageScore)
      }
    });
  } catch (err) {
    console.error('Get exam results error:', err);
    next(err);
  }
}; 