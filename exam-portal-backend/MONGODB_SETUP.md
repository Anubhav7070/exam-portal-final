# MongoDB Setup Guide for Exam Portal

This guide will help you set up MongoDB for the Exam Portal backend.

## Prerequisites

- Node.js (v14 or higher)
- npm or yarn
- MongoDB (local installation or MongoDB Atlas account)

## Installation Options

### Option 1: Local MongoDB Installation

1. **Download MongoDB Community Server**
   - Visit: https://www.mongodb.com/try/download/community
   - Download the appropriate version for your OS
   - Follow the installation instructions

2. **Start MongoDB Service**
   - **Windows**: MongoDB should start as a service automatically
   - **macOS**: `brew services start mongodb-community`
   - **Linux**: `sudo systemctl start mongod`

3. **Verify Installation**
   ```bash
   mongosh
   # or
   mongo
   ```

### Option 2: MongoDB Atlas (Cloud)

1. **Create MongoDB Atlas Account**
   - Visit: https://www.mongodb.com/cloud/atlas
   - Sign up for a free account

2. **Create a Cluster**
   - Choose the free tier (M0)
   - Select your preferred cloud provider and region
   - Create the cluster

3. **Get Connection String**
   - Click "Connect" on your cluster
   - Choose "Connect your application"
   - Copy the connection string

## Setup Steps

### 1. Install Dependencies

```bash
cd exam-portal-backend
npm install
```

### 2. Configure Environment Variables

Run the setup script to create a `.env` file:

```bash
npm run setup
```

Or manually create a `.env` file with the following content:

```env
# MongoDB Configuration
MONGODB_URI=mongodb://localhost:27017/exam-portal

# JWT Configuration
JWT_SECRET=your-super-secret-jwt-key-here-change-this-in-production
JWT_EXPIRE=24h

# Server Configuration
PORT=5000
NODE_ENV=development
```

**For MongoDB Atlas, use your connection string:**
```env
MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/exam-portal?retryWrites=true&w=majority
```

### 3. Seed the Database

Populate the database with sample data:

```bash
npm run seed
```

This will create:
- 1 Admin user (admin@examportal.com / admin123)
- 3 Student users (john@example.com, jane@example.com, mike@example.com / password123)
- 2 Sample exams (JavaScript Fundamentals, React Basics)
- 2 Sample results

### 4. Start the Server

```bash
npm run dev
```

The server will start on `http://localhost:5000`

## Database Schema

### Collections

1. **users** - User accounts (students and admins)
2. **exams** - Exam definitions with questions
3. **results** - Student exam results and answers

### Key Features

- **User Authentication**: JWT-based authentication with bcrypt password hashing
- **Role-based Access**: Admin and student roles
- **Exam Management**: Create, update, and manage exams with multiple-choice questions
- **Result Tracking**: Detailed exam results with analytics
- **Data Validation**: Comprehensive validation using Mongoose schemas
- **Indexing**: Optimized database queries with proper indexing

## API Endpoints

The backend provides the following API endpoints:

- `POST /auth/register` - User registration
- `POST /auth/login` - User login
- `GET /auth/profile` - Get user profile
- `GET /exams` - List available exams
- `POST /exams` - Create new exam (admin only)
- `GET /exams/:id` - Get exam details
- `POST /results` - Submit exam results
- `GET /results` - Get user results

## Troubleshooting

### Connection Issues

1. **Check MongoDB Service**
   ```bash
   # Windows
   services.msc
   # Look for "MongoDB" service
   
   # macOS/Linux
   sudo systemctl status mongod
   ```

2. **Check Connection String**
   - Ensure the MongoDB URI is correct
   - For Atlas, make sure username/password are URL-encoded
   - Check if the database name is correct

3. **Network Issues**
   - For Atlas, ensure your IP is whitelisted
   - Check firewall settings

### Common Errors

- **ECONNREFUSED**: MongoDB service not running
- **Authentication failed**: Wrong username/password
- **Network timeout**: Check internet connection (for Atlas)

## Security Considerations

1. **Environment Variables**: Never commit `.env` files to version control
2. **JWT Secret**: Use a strong, random secret in production
3. **MongoDB Security**: Enable authentication for production deployments
4. **Input Validation**: All user inputs are validated using express-validator

## Production Deployment

For production deployment:

1. Use MongoDB Atlas or a managed MongoDB service
2. Set up proper authentication and authorization
3. Use environment-specific configuration
4. Enable MongoDB security features
5. Set up monitoring and logging
6. Use HTTPS for all communications

## Support

If you encounter issues:

1. Check the MongoDB logs
2. Verify your connection string
3. Ensure all dependencies are installed
4. Check the Node.js version compatibility 