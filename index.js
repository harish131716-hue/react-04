
const express = require('express');
const mongoose = require('mongoose');
const path = require('path');
const cors = require('cors');
require('dotenv').config();

const routes = require('./routes/api');
const app = express();

const port = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(express.json());

// MongoDB connection
mongoose
  .connect(process.env.MONGO_DB_URI)
  .then(() => {
    console.log('Database connected successfully');
  })
  .catch((error) => {
    console.error('MongoDB connection failed:', error.message);
  });

// API routes
app.use('/api', routes);

// Health-check endpoint
app.get('/api/health', (req, res) => {
  res.status(200).json({
    message: 'Internship Portal API is running'
  });
});

// Serve React production build
const frontendPath = path.join(__dirname, 'client', 'dist');

app.use(express.static(frontendPath));

// Handle React routes
app.get('*', (req, res, next) => {
  if (req.path.startsWith('/api/')) {
    return res.status(404).json({
      message: 'API endpoint not found'
    });
  }

  res.sendFile(
    path.join(frontendPath, 'index.html'),
    (error) => {
      if (error) next(error);
    }
  );
});

// Error handler
app.use((error, req, res, next) => {
  console.error(error);

  if (res.headersSent) {
    return next(error);
  }

  res.status(500).json({
    message: 'Internal server error'
  });
});

// Start server
app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});
