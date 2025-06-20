const { connectDB } = require('../db/mongodb');
const User = require('../models/User');
const Exam = require('../models/Exam');
const Result = require('../models/Result');

const seedData = async () => {
  try {
    console.log('🌱 Seeding database...');
    
    // Connect to MongoDB
    await connectDB();
    
    // Clear existing data
    await User.deleteMany({});
    await Exam.deleteMany({});
    await Result.deleteMany({});
    
    console.log('🗑️  Cleared existing data');
    
    // Create admin user
    const adminUser = new User({
      username: 'admin',
      email: 'admin@examportal.com',
      password: 'admin123',
      role: 'admin',
      firstName: 'Admin',
      lastName: 'User'
    });
    await adminUser.save();
    console.log('✅ Created admin user');
    
    // Create sample student users
    const students = [
      {
        username: 'john_doe',
        email: 'john@example.com',
        password: 'password123',
        firstName: 'John',
        lastName: 'Doe'
      },
      {
        username: 'jane_smith',
        email: 'jane@example.com',
        password: 'password123',
        firstName: 'Jane',
        lastName: 'Smith'
      },
      {
        username: 'mike_wilson',
        email: 'mike@example.com',
        password: 'password123',
        firstName: 'Mike',
        lastName: 'Wilson'
      }
    ];
    
    const createdStudents = [];
    for (const studentData of students) {
      const student = new User(studentData);
      await student.save();
      createdStudents.push(student);
    }
    console.log('✅ Created student users');
    
    // Create sample exams
    const exams = [
      {
        title: 'JavaScript Fundamentals',
        description: 'Test your knowledge of JavaScript basics including variables, functions, and control structures.',
        subject: 'JavaScript',
        duration: 30, // 30 minutes
        questions: [
          {
            question: 'What is the correct way to declare a variable in JavaScript?',
            options: ['var x = 5;', 'variable x = 5;', 'v x = 5;', 'declare x = 5;'],
            correctAnswer: 0,
            points: 1,
            explanation: 'The correct syntax is "var x = 5;" or "let x = 5;" or "const x = 5;"'
          },
          {
            question: 'Which method is used to add an element to the end of an array?',
            options: ['push()', 'pop()', 'shift()', 'unshift()'],
            correctAnswer: 0,
            points: 1,
            explanation: 'push() adds elements to the end of an array'
          },
          {
            question: 'What is the result of 2 + "2" in JavaScript?',
            options: ['4', '22', 'NaN', 'Error'],
            correctAnswer: 1,
            points: 1,
            explanation: 'JavaScript converts the number to string and concatenates them'
          }
        ],
        startTime: new Date(Date.now() + 24 * 60 * 60 * 1000), // Tomorrow
        endTime: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000), // Next week
        createdBy: adminUser._id,
        passingScore: 60
      },
      {
        title: 'React Basics',
        description: 'Test your understanding of React fundamentals including components, props, and state.',
        subject: 'React',
        duration: 45, // 45 minutes
        questions: [
          {
            question: 'What is a React component?',
            options: [
              'A JavaScript function that returns HTML',
              'A CSS class',
              'A database table',
              'A server-side script'
            ],
            correctAnswer: 0,
            points: 1,
            explanation: 'React components are JavaScript functions that return HTML'
          },
          {
            question: 'How do you pass data to a child component?',
            options: ['Using state', 'Using props', 'Using context', 'Using refs'],
            correctAnswer: 1,
            points: 1,
            explanation: 'Props are used to pass data from parent to child components'
          },
          {
            question: 'What hook is used to manage state in functional components?',
            options: ['useState', 'useEffect', 'useContext', 'useReducer'],
            correctAnswer: 0,
            points: 1,
            explanation: 'useState is the hook used to manage state in functional components'
          },
          {
            question: 'What is the virtual DOM?',
            options: [
              'A real DOM element',
              'A lightweight copy of the real DOM',
              'A database',
              'A CSS framework'
            ],
            correctAnswer: 1,
            points: 1,
            explanation: 'Virtual DOM is a lightweight copy of the real DOM used for optimization'
          }
        ],
        startTime: new Date(Date.now() + 2 * 24 * 60 * 60 * 1000), // Day after tomorrow
        endTime: new Date(Date.now() + 10 * 24 * 60 * 60 * 1000), // 10 days from now
        createdBy: adminUser._id,
        passingScore: 70
      }
    ];
    
    const createdExams = [];
    for (const examData of exams) {
      const exam = new Exam(examData);
      await exam.save();
      createdExams.push(exam);
    }
    console.log('✅ Created sample exams');
    
    // Create sample results
    const sampleResults = [
      {
        student: createdStudents[0]._id,
        exam: createdExams[0]._id,
        answers: [
          { questionIndex: 0, selectedAnswer: 0, isCorrect: true, pointsEarned: 1, timeSpent: 30 },
          { questionIndex: 1, selectedAnswer: 0, isCorrect: true, pointsEarned: 1, timeSpent: 45 },
          { questionIndex: 2, selectedAnswer: 1, isCorrect: true, pointsEarned: 1, timeSpent: 20 }
        ],
        score: 3,
        totalPoints: 3,
        percentage: 100,
        timeStarted: new Date(Date.now() - 2 * 60 * 60 * 1000), // 2 hours ago
        timeCompleted: new Date(Date.now() - 1.5 * 60 * 60 * 1000), // 1.5 hours ago
        duration: 1800, // 30 minutes
        status: 'completed',
        isPassed: true
      },
      {
        student: createdStudents[1]._id,
        exam: createdExams[0]._id,
        answers: [
          { questionIndex: 0, selectedAnswer: 0, isCorrect: true, pointsEarned: 1, timeSpent: 25 },
          { questionIndex: 1, selectedAnswer: 2, isCorrect: false, pointsEarned: 0, timeSpent: 40 },
          { questionIndex: 2, selectedAnswer: 1, isCorrect: true, pointsEarned: 1, timeSpent: 35 }
        ],
        score: 2,
        totalPoints: 3,
        percentage: 67,
        timeStarted: new Date(Date.now() - 3 * 60 * 60 * 1000), // 3 hours ago
        timeCompleted: new Date(Date.now() - 2.5 * 60 * 60 * 1000), // 2.5 hours ago
        duration: 1800, // 30 minutes
        status: 'completed',
        isPassed: true
      }
    ];
    
    for (const resultData of sampleResults) {
      const result = new Result(resultData);
      await result.save();
    }
    console.log('✅ Created sample results');
    
    console.log('\n🎉 Database seeded successfully!');
    console.log('\n📊 Sample Data Created:');
    console.log('- 1 Admin user (admin@examportal.com / admin123)');
    console.log('- 3 Student users (john@example.com, jane@example.com, mike@example.com / password123)');
    console.log('- 2 Sample exams (JavaScript Fundamentals, React Basics)');
    console.log('- 2 Sample results');
    
    process.exit(0);
  } catch (error) {
    console.error('❌ Error seeding database:', error);
    process.exit(1);
  }
};

// Run the seed function
seedData(); 