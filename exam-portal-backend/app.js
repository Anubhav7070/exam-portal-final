require('dotenv').config();
const express = require('express');
const cors = require('cors');
const { connectDB } = require('./db/mongodb');

const app = express();

// Connect to MongoDB
connectDB();

app.use(cors({ origin: '*' }));
app.use(express.json());

// Import routes (to be implemented)
const authRoutes = require('./routes/auth');
const examRoutes = require('./routes/exams');
const resultRoutes = require('./routes/results');
app.use('/auth', authRoutes);
app.use('/exams', examRoutes);
app.use('/results', resultRoutes);

// Basic error handler
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(err.status || 500).json({ error: err.message || 'Internal Server Error' });
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
}); 