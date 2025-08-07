const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },

  email: {
    type: String,
    required: true,
    unique: true,
  },

  password: {
    type: String,
    required: true,
  },

  role: {
    type: String,
    enum: ['patient', 'doctor', 'admin'],
    default: 'patient',
  },

  verified: {
    type: Boolean,
    default: function () {
      return this.role === 'doctor' ? false : true;
    },
  },

  // Optional additional fields
  gender: String,
  age: Number,
  contact: String,
  address: String,

  // Doctor-specific fields
  specialization: String,
  experience: String,
}, {
  timestamps: true,
});

module.exports = mongoose.model('User', userSchema);
