const mongoose = require('mongoose');

const answerSchema = new mongoose.Schema({
  questionIndex: {
    type: Number,
    required: true,
    min: 0
  },
  selectedAnswer: {
    type: Number,
    required: true,
    min: 0
  },
  isCorrect: {
    type: Boolean,
    required: true
  },
  pointsEarned: {
    type: Number,
    default: 0,
    min: 0
  },
  timeSpent: {
    type: Number, // in seconds
    default: 0,
    min: 0
  }
});

const resultSchema = new mongoose.Schema({
  student: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  exam: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Exam',
    required: true
  },
  answers: {
    type: [answerSchema],
    required: true
  },
  score: {
    type: Number,
    required: true,
    min: 0
  },
  totalPoints: {
    type: Number,
    required: true,
    min: 0
  },
  percentage: {
    type: Number,
    required: true,
    min: 0,
    max: 100
  },
  timeStarted: {
    type: Date,
    required: true
  },
  timeCompleted: {
    type: Date,
    required: true
  },
  duration: {
    type: Number, // in seconds
    required: true,
    min: 0
  },
  attemptNumber: {
    type: Number,
    default: 1,
    min: 1
  },
  isPassed: {
    type: Boolean,
    default: false
  },
  status: {
    type: String,
    enum: ['in-progress', 'completed', 'abandoned'],
    default: 'in-progress'
  },
  ipAddress: {
    type: String,
    trim: true
  },
  userAgent: {
    type: String,
    trim: true
  }
}, {
  timestamps: true
});

// Calculate percentage before saving
resultSchema.pre('save', function(next) {
  if (this.totalPoints > 0) {
    this.percentage = Math.round((this.score / this.totalPoints) * 100);
  }
  next();
});

// Index for better query performance
resultSchema.index({ student: 1, exam: 1 });
resultSchema.index({ exam: 1, score: -1 });
resultSchema.index({ student: 1, createdAt: -1 });
resultSchema.index({ status: 1 });

// Compound index to ensure one result per student per exam per attempt
resultSchema.index({ student: 1, exam: 1, attemptNumber: 1 }, { unique: true });

module.exports = mongoose.model('Result', resultSchema); 