
const mongoose = require('mongoose');

const ApplicationSchema = new mongoose.Schema({
  jobId: { type: mongoose.Schema.Types.ObjectId, ref: 'Job', required: true },
  candidateId: { type: mongoose.Schema.Types.ObjectId, ref: 'Profile', required: true },
  status: { 
    type: String, 
    enum: ['Applied', 'Viewed', 'Shortlisted', 'Rejected', 'Interview'], 
    default: 'Applied' 
  },
  appliedAt: { type: Date, default: Date.now },
  matchScore: { type: Number, default: 0 }, // AI calculated score
});

module.exports = mongoose.model('Application', ApplicationSchema);
