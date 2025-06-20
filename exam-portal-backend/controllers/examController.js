const Exam = require('../models/Exam');
const Result = require('../models/Result');
const { validationResult } = require('express-validator');
const { v4: uuidv4 } = require('uuid');

// POST /exams (admin only)
exports.createExam = async (req, res, next) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }
    
    const { 
      title, 
      description, 
      subject, 
      duration, 
      questions, 
      startTime, 
      endTime, 
      allowRetake, 
      maxAttempts, 
      shuffleQuestions, 
      showResults, 
      passingScore 
    } = req.body;
    
    const exam = new Exam({
      title,
      description,
      subject,
      duration,
      questions,
      startTime: new Date(startTime),
      endTime: new Date(endTime),
      allowRetake: allowRetake || false,
      maxAttempts: maxAttempts || 1,
      shuffleQuestions: shuffleQuestions || false,
      showResults: showResults !== false, // Default to true
      passingScore,
      createdBy: req.user.userId
    });
    
    await exam.save();
    
    res.status(201).json({ 
      message: 'Exam created successfully',
      exam: {
        id: exam._id,
        title: exam.title,
        subject: exam.subject,
        duration: exam.duration,
        totalPoints: exam.totalPoints,
        startTime: exam.startTime,
        endTime: exam.endTime
      }
    });
  } catch (err) {
    console.error('Create exam error:', err);
    next(err);
  }
};

// GET /exams (available for all authenticated users)
exports.listExams = async (req, res, next) => {
  try {
    const { subject, isActive } = req.query;
    const filter = {};
    
    if (subject) filter.subject = subject;
    if (isActive !== undefined) filter.isActive = isActive === 'true';
    
    const exams = await Exam.find(filter)
      .select('title description subject duration totalPoints startTime endTime isActive')
      .populate('createdBy', 'firstName lastName')
      .sort({ createdAt: -1 });
    
    res.json(exams);
  } catch (err) {
    console.error('List exams error:', err);
    next(err);
  }
};

// GET /exams/:id (student only)
exports.getExamDetails = async (req, res, next) => {
  try {
    const { id } = req.params;
    
    const exam = await Exam.findById(id)
      .populate('createdBy', 'firstName lastName');
    
    if (!exam) {
      return res.status(404).json({ error: 'Exam not found' });
    }
    
    // Check if exam is active
    if (!exam.isActive) {
      return res.status(400).json({ error: 'This exam is not currently active' });
    }
    
    // Check if exam is within time window
    const now = new Date();
    if (now < exam.startTime || now > exam.endTime) {
      return res.status(400).json({ error: 'Exam is not available at this time' });
    }
    
    // For students, don't include correct answers
    const examForStudent = {
      id: exam._id,
      title: exam.title,
      description: exam.description,
      subject: exam.subject,
      duration: exam.duration,
      totalPoints: exam.totalPoints,
      startTime: exam.startTime,
      endTime: exam.endTime,
      questions: exam.questions.map(q => ({
        question: q.question,
        options: q.options,
        points: q.points
      }))
    };
    
    res.json(examForStudent);
  } catch (err) {
    console.error('Get exam details error:', err);
    next(err);
  }
};

// GET /exams/:id/admin (admin only - includes correct answers)
exports.getExamDetailsAdmin = async (req, res, next) => {
  try {
    const { id } = req.params;
    
    const exam = await Exam.findById(id)
      .populate('createdBy', 'firstName lastName');
    
    if (!exam) {
      return res.status(404).json({ error: 'Exam not found' });
    }
    
    res.json(exam);
  } catch (err) {
    console.error('Get exam details admin error:', err);
    next(err);
  }
};

// PUT /exams/:id (admin only)
exports.updateExam = async (req, res, next) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }
    
    const { id } = req.params;
    const updateData = req.body;
    
    // Convert date strings to Date objects
    if (updateData.startTime) updateData.startTime = new Date(updateData.startTime);
    if (updateData.endTime) updateData.endTime = new Date(updateData.endTime);
    
    const exam = await Exam.findByIdAndUpdate(
      id,
      updateData,
      { new: true, runValidators: true }
    );
    
    if (!exam) {
      return res.status(404).json({ error: 'Exam not found' });
    }
    
    res.json({ 
      message: 'Exam updated successfully',
      exam: {
        id: exam._id,
        title: exam.title,
        subject: exam.subject,
        duration: exam.duration,
        totalPoints: exam.totalPoints,
        startTime: exam.startTime,
        endTime: exam.endTime
      }
    });
  } catch (err) {
    console.error('Update exam error:', err);
    next(err);
  }
};

// DELETE /exams/:id (admin only)
exports.deleteExam = async (req, res, next) => {
  try {
    const { id } = req.params;
    
    const exam = await Exam.findByIdAndDelete(id);
    
    if (!exam) {
      return res.status(404).json({ error: 'Exam not found' });
    }
    
    // Also delete related results
    await Result.deleteMany({ exam: id });
    
    res.json({ message: 'Exam deleted successfully' });
  } catch (err) {
    console.error('Delete exam error:', err);
    next(err);
  }
};

// POST /exams/:id/submit (student only)
exports.submitExam = async (req, res, next) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }
    const { id: exam_id } = req.params;
    const user_id = req.user.id;
    const { answers } = req.body;
    // Save submission
    const submissionId = uuidv4();
    const { error: subError } = await supabase
      .from('submissions')
      .insert([{ id: submissionId, exam_id, user_id, answers }]);
    if (subError) throw subError;
    // Optionally: calculate score, store in results
    res.status(201).json({ message: 'Submission received', submissionId });
  } catch (err) {
    next(err);
  }
}; 