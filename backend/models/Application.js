const mongoose = require('mongoose');

const ApplicationSchema = new mongoose.Schema({
  jobId: { type: mongoose.Schema.Types.ObjectId, ref: 'Job', required: true },
  profileId: { type: mongoose.Schema.Types.ObjectId, ref: 'Profile', required: true },
  studentUserId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  status: {
    type: String,
    enum: ['pending_hr', 'hr_rejected', 'forwarded_to_company', 'company_accepted', 'company_rejected', 'offer_extended'],
    default: 'pending_hr'
  },
  hrInternalNotes: { type: String }, // Private notes by HR
  companyFeedback: { type: String }, // Raw feedback from Company
  studentVisibleFeedback: { type: String }, // Sanitized feedback for Student
  resumeUrl: { type: String },
  coverNote: { type: String },
  history: [{
    status: { type: String },
    at: { type: Date, default: Date.now },
    actorId: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    note: { type: String }
  }],
  appliedAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now }
});

// Create unique index to prevent duplicate applications
ApplicationSchema.index({ profileId: 1, jobId: 1 }, { unique: true });

module.exports = mongoose.model('Application', ApplicationSchema);
