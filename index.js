require('dotenv').config();

const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');

const routes = require('./routes/api');
const app = express();

const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(express.json());

// Health-check endpoint
app.get('/api/health', (req, res) => {
  res.status(200).json({
    message: 'Internship Portal API is running'
  });
});

// API routes
app.use('/api', routes);

// Handle unknown API endpoints
app.use('/api/*', (req, res) => {
  res.status(404).json({
    message: 'API endpoint not found'
  });
});

// Error handler
app.use((error, req, res, next) => {
  console.error('Server error:', error.message);

  if (res.headersSent) {
    return next(error);
  }

  res.status(500).json({
    message: 'Internal server error'
  });
});

// Connect to MongoDB and start server
async function startServer() {
  try {
    if (!process.env.MONGO_DB_URI) {
      throw new Error('MONGO_URI is missing from environment variables');
    }

    await mongoose.connect(process.env.MONGO_URI);

    console.log('Database connected successfully');

    app.listen(PORT, () => {
      console.log(`Server running on port ${PORT}`);
    });
  } catch (error) {
    console.error('Application startup failed:', error.message);
    process.exit(1);
  }
}

startServer();