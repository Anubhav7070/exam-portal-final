const supabase = require('../db/supabaseClient');
const { v4: uuidv4 } = require('uuid');

async function seed() {
  try {
    // Create a mock exam
    const examId = uuidv4();
    const { error: examError } = await supabase
      .from('exams')
      .insert([{ id: examId, title: 'Sample Exam', duration: 60 }]);
    if (examError) throw examError;

    // Create mock questions
    const questions = [
      {
        id: uuidv4(),
        exam_id: examId,
        question: 'What is 2 + 2?',
        options: JSON.stringify(['2', '3', '4', '5']),
        answer: '4',
        type: 'mcq'
      },
      {
        id: uuidv4(),
        exam_id: examId,
        question: 'Describe the process of photosynthesis.',
        options: null,
        answer: null,
        type: 'descriptive'
      }
    ];
    const { error: qError } = await supabase
      .from('questions')
      .insert(questions);
    if (qError) throw qError;

    console.log('Seed data inserted successfully!');
    process.exit(0);
  } catch (err) {
    console.error('Seed error:', err);
    process.exit(1);
  }
}

seed(); 