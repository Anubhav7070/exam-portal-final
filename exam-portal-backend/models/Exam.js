const mongoose = require('mongoose');

const questionSchema = new mongoose.Schema({
  question: {
    type: String,
    required: true,
    trim: true
  },
  options: {
    type: [String],
    required: true,
    validate: {
      validator: function(v) {
        return v.length >= 2 && v.length <= 6; // At least 2 options, max 6
      },
      message: 'Question must have between 2 and 6 options'
    }
  },
  correctAnswer: {
    type: Number,
    required: true,
    min: 0
  },
  points: {
    type: Number,
    default: 1,
    min: 1
  },
  explanation: {
    type: String,
    trim: true
  }
});

const examSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
    trim: true,
    maxlength: 200
  },
  description: {
    type: String,
    trim: true,
    maxlength: 1000
  },
  subject: {
    type: String,
    required: true,
    trim: true
  },
  duration: {
    type: Number, // in minutes
    required: true,
    min: 1,
    max: 480 // 8 hours max
  },
  totalPoints: {
    type: Number,
    default: 0
  },
  questions: {
    type: [questionSchema],
    required: true,
    validate: {
      validator: function(v) {
        return v.length > 0;
      },
      message: 'Exam must have at least one question'
    }
  },
  startTime: {
    type: Date,
    required: true
  },
  endTime: {
    type: Date,
    required: true
  },
  isActive: {
    type: Boolean,
    default: true
  },
  allowRetake: {
    type: Boolean,
    default: false
  },
  maxAttempts: {
    type: Number,
    default: 1,
    min: 1
  },
  shuffleQuestions: {
    type: Boolean,
    default: false
  },
  showResults: {
    type: Boolean,
    default: true
  },
  passingScore: {
    type: Number,
    min: 0
  },
  createdBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  }
}, {
  timestamps: true
});

// Calculate total points before saving
examSchema.pre('save', function(next) {
  this.totalPoints = this.questions.reduce((total, question) => total + question.points, 0);
  next();
});

// Index for better query performance
examSchema.index({ subject: 1, isActive: 1 });
examSchema.index({ startTime: 1, endTime: 1 });
examSchema.index({ createdBy: 1 });

module.exports = mongoose.model('Exam', examSchema); 