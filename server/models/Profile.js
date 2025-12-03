
const mongoose = require('mongoose');

const ProfileSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  fullName: { type: String, required: true },
  headline: { type: String },
  bio: { type: String },
  contact: {
    phone: String,
    location: String
  },
  education: [{
    degree: String,
    institution: String,
    year: String
  }],
  experience: [{
    role: String,
    company: String,
    duration: String,
    description: String
  }],
  skills: [{ type: String }],
  resumeUrl: { type: String },
  videoIntroUrl: { type: String },
  completeness: { type: Number, default: 0 }
});

module.exports = mongoose.model('Profile', ProfileSchema);
