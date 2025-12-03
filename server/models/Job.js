
const mongoose = require('mongoose');

const JobSchema = new mongoose.Schema({
  companyId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  title: { type: String, required: true },
  companyName: { type: String, required: true }, // Denormalized for easier query
  description: { type: String, required: true },
  location: { type: String, required: true },
  type: { type: String, enum: ['Full-time', 'Part-time', 'Contract', 'Remote', 'Hybrid'], required: true },
  salaryRange: { type: String },
  skills: [{ type: String }],
  postedAt: { type: Date, default: Date.now },
  status: { type: String, enum: ['open', 'closed'], default: 'open' },
});

// Text index for search functionality
JobSchema.index({ title: 'text', description: 'text', skills: 'text' });

module.exports = mongoose.model('Job', JobSchema);
