const mongoose = require('mongoose');

const doctorSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    specialty: {
      type: String,
      required: [true, 'Specialty is required'],
      enum: [
        'General Practice',
        'Cardiology',
        'Dermatology',
        'Neurology',
        'Orthopedics',
        'Pediatrics',
        'Psychiatry',
        'Gynecology',
        'Ophthalmology',
        'Dentistry',
      ],
    },
    bio: {
      type: String,
      maxlength: [500, 'Bio cannot exceed 500 characters'],
    },
    experience: {
      type: Number,
      min: 0,
    },
    consultationFee: {
      type: Number,
      default: 100,
    },
    availableDays: {
      type: [String],
      enum: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'],
      default: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday'],
    },
    availableHours: {
      start: { type: String, default: '09:00' },
      end: { type: String, default: '17:00' },
    },
    rating: {
      type: Number,
      default: 0,
      min: 0,
      max: 5,
    },
    isAvailable: {
      type: Boolean,
      default: true,
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model('Doctor', doctorSchema);
