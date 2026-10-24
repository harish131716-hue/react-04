
const mongoose = require('mongoose');

const applicationSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, 'Student name is required'],
      trim: true,
      minlength: [2, 'Name must contain at least 2 characters']
    },
    email: {
      type: String,
      required: [true, 'Email is required'],
      trim: true,
      lowercase: true,
      match: [
        /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
        'Please enter a valid email address'
      ]
    },
    rollNumber: {
      type: String,
      required: [true, 'Roll number is required'],
      trim: true
    },
    internshipId: {
      type: String,
      required: [true, 'Internship ID is required']
    },
    internshipTitle: {
      type: String,
      required: [true, 'Internship title is required']
    },
    company: {
      type: String,
      required: [true, 'Company name is required']
    }
  },
  { timestamps: true }
);

module.exports = mongoose.model('Application', applicationSchema);
