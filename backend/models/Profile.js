
const mongoose = require('mongoose');

const ProfileSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true, unique: true },
  fullName: { type: String, required: true },
  headline: { type: String },
  bio: { type: String },
  photoUrl: { type: String },
  resumeUrl: { type: String },
  location: {
    city: { type: String },
    country: { type: String }
  },
  mobile: { type: String },
  skills: [{
    name: { type: String, required: true },
    slug: { type: String },
    proficiency: { type: String, enum: ['Beginner', 'Intermediate', 'Advanced', 'Expert'] },
    years: { type: Number }
  }],
  experience: [{
    company: { type: String },
    position: { type: String },
    Role: { type: String },
    startDate: { type: String },
    endDate: { type: String },
    currentlyWorking: { type: Boolean, default: false },
    description: { type: String },
    location: { type: String }
  }],
  education: [{
    institution: { type: String },
    degree: { type: String },
    field: { type: String },
    startDate: { type: String },
    endDate: { type: String },
    grade: { type: String },
    description: { type: String }
  }],
  profileCompleteness: { type: Number, default: 0 },
  onboardingStep: { type: Number, default: 1 }, // Track wizard step
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Profile', ProfileSchema);
