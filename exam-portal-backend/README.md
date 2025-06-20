# Exam Portal Backend

A comprehensive backend API for an online examination system built with Node.js, Express, and MongoDB.

## Features

- **User Management**: Student and admin registration/authentication
- **Exam Management**: Create, update, and manage exams with multiple-choice questions
- **Result Tracking**: Detailed exam results with analytics and performance metrics
- **Role-based Access**: Secure admin and student interfaces
- **JWT Authentication**: Secure token-based authentication
- **Data Validation**: Comprehensive input validation and sanitization
- **MongoDB Integration**: Robust NoSQL database with Mongoose ODM

## Tech Stack

- **Runtime**: Node.js
- **Framework**: Express.js
- **Database**: MongoDB with Mongoose ODM
- **Authentication**: JWT (JSON Web Tokens)
- **Password Hashing**: bcryptjs
- **Validation**: express-validator
- **Development**: nodemon

## Quick Start

### Prerequisites

- Node.js (v14 or higher)
- MongoDB (local or MongoDB Atlas)
- npm or yarn

### Installation

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd exam-portal-backend
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Set up environment variables**
   ```bash
   npm run setup
   ```

4. **Configure MongoDB**
   - For local MongoDB: Install MongoDB Community Server
   - For MongoDB Atlas: Create a free account and get your connection string
   - Update the `MONGODB_URI` in your `.env` file

5. **Test database connection**
   ```bash
   npm run test-db
   ```

6. **Seed the database (optional)**
   ```bash
   npm run seed
   ```

7. **Start the development server**
   ```bash
   npm run dev
   ```

The server will start on `http://localhost:5000`

## Database Schema

### Collections

#### Users
```javascript
{
  username: String (unique),
  email: String (unique),
  password: String (hashed),
  role: String (enum: ['student', 'admin']),
  firstName: String,
  lastName: String,
  isActive: Boolean,
  lastLogin: Date,
  timestamps: true
}
```

#### Exams
```javascript
{
  title: String,
  description: String,
  subject: String,
  duration: Number (minutes),
  questions: [{
    question: String,
    options: [String],
    correctAnswer: Number,
    points: Number,
    explanation: String
  }],
  startTime: Date,
  endTime: Date,
  isActive: Boolean,
  allowRetake: Boolean,
  maxAttempts: Number,
  shuffleQuestions: Boolean,
  showResults: Boolean,
  passingScore: Number,
  createdBy: ObjectId (ref: User),
  timestamps: true
}
```

#### Results
```javascript
{
  student: ObjectId (ref: User),
  exam: ObjectId (ref: Exam),
  answers: [{
    questionIndex: Number,
    selectedAnswer: Number,
    isCorrect: Boolean,
    pointsEarned: Number,
    timeSpent: Number
  }],
  score: Number,
  totalPoints: Number,
  percentage: Number,
  timeStarted: Date,
  timeCompleted: Date,
  duration: Number (seconds),
  attemptNumber: Number,
  isPassed: Boolean,
  status: String (enum: ['in-progress', 'completed', 'abandoned']),
  ipAddress: String,
  userAgent: String,
  timestamps: true
}
```

## API Endpoints

### Authentication
- `POST /auth/register` - User registration
- `POST /auth/login` - User login
- `GET /auth/profile` - Get user profile (protected)
- `PUT /auth/profile` - Update user profile (protected)

### Exams
- `GET /exams` - List available exams
- `POST /exams` - Create new exam (admin only)
- `GET /exams/:id` - Get exam details
- `PUT /exams/:id` - Update exam (admin only)
- `DELETE /exams/:id` - Delete exam (admin only)

### Results
- `POST /results` - Submit exam results
- `GET /results` - Get user results (protected)
- `GET /results/:id` - Get specific result details
- `GET /results/exam/:examId` - Get all results for an exam (admin only)

## Environment Variables

Create a `.env` file in the root directory:

```env
# MongoDB Configuration
MONGODB_URI=mongodb://localhost:27017/exam-portal

# JWT Configuration
JWT_SECRET=your-super-secret-jwt-key-here
JWT_EXPIRE=24h

# Server Configuration
PORT=5000
NODE_ENV=development
```

## Scripts

- `npm start` - Start production server
- `npm run dev` - Start development server with nodemon
- `npm run seed` - Seed database with sample data
- `npm run setup` - Create environment file
- `npm run test-db` - Test MongoDB connection

## Sample Data

The seed script creates:

**Users:**
- Admin: `admin@examportal.com` / `admin123`
- Students: `john@example.com`, `jane@example.com`, `mike@example.com` / `password123`

**Exams:**
- JavaScript Fundamentals (30 minutes, 3 questions)
- React Basics (45 minutes, 4 questions)

## Security Features

- **Password Hashing**: All passwords are hashed using bcrypt
- **JWT Authentication**: Secure token-based authentication
- **Input Validation**: All inputs are validated and sanitized
- **Role-based Access**: Admin and student role separation
- **Environment Variables**: Sensitive data stored in environment variables

## Development

### Project Structure
```
exam-portal-backend/
├── controllers/     # Route controllers
├── db/             # Database configuration
├── middleware/     # Custom middleware
├── models/         # Mongoose models
├── routes/         # API routes
├── seed/           # Database seeding
├── app.js          # Main application file
└── package.json    # Dependencies and scripts
```

### Adding New Features

1. **Create Model**: Add new Mongoose schema in `models/`
2. **Create Controller**: Add business logic in `controllers/`
3. **Create Routes**: Define API endpoints in `routes/`
4. **Add Middleware**: Create custom middleware if needed
5. **Update Validation**: Add input validation rules

## Deployment

### Production Checklist

- [ ] Set `NODE_ENV=production`
- [ ] Use strong JWT secret
- [ ] Enable MongoDB authentication
- [ ] Set up HTTPS
- [ ] Configure CORS properly
- [ ] Set up monitoring and logging
- [ ] Use environment-specific configuration

### Docker Deployment

```dockerfile
FROM node:18-alpine
WORKDIR /app
COPY package*.json ./
RUN npm ci --only=production
COPY . .
EXPOSE 5000
CMD ["npm", "start"]
```

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests if applicable
5. Submit a pull request

## License

This project is licensed under the ISC License.

## Support

For support and questions:
1. Check the [MongoDB Setup Guide](MONGODB_SETUP.md)
2. Review the troubleshooting section
3. Check MongoDB and Node.js documentation 