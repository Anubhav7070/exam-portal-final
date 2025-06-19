const supabase = require('../db/supabaseClient');
const { validationResult } = require('express-validator');
const { v4: uuidv4 } = require('uuid');

// POST /exams (admin only)
exports.createExam = async (req, res, next) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }
    const { title, duration, questions } = req.body;
    const examId = uuidv4();
    // Insert exam
    const { error: examError } = await supabase
      .from('exams')
      .insert([{ id: examId, title, duration }]);
    if (examError) throw examError;
    // Insert questions
    const questionsToInsert = questions.map(q => ({
      id: uuidv4(),
      exam_id: examId,
      ...q
    }));
    const { error: qError } = await supabase
      .from('questions')
      .insert(questionsToInsert);
    if (qError) throw qError;
    res.status(201).json({ message: 'Exam created', examId });
  } catch (err) {
    next(err);
  }
};

// GET /exams (student only)
exports.listExams = async (req, res, next) => {
  try {
    const { data, error } = await supabase
      .from('exams')
      .select('id, title, duration');
    if (error) throw error;
    res.json(data);
  } catch (err) {
    next(err);
  }
};

// GET /exams/:id (student only)
exports.getExamDetails = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { data: exam, error: examError } = await supabase
      .from('exams')
      .select('id, title, duration')
      .eq('id', id)
      .single();
    if (examError || !exam) return res.status(404).json({ error: 'Exam not found' });
    const { data: questions, error: qError } = await supabase
      .from('questions')
      .select('id, question, options, type')
      .eq('exam_id', id);
    if (qError) throw qError;
    res.json({ ...exam, questions });
  } catch (err) {
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