const mongoose = require('mongoose');

const JobSchema = new mongoose.Schema({
  companyId: { type: mongoose.Schema.Types.ObjectId, ref: 'Company', required: true },
  title: { type: String, required: true },
  titleLower: { type: String }, // For normalized search
  description: { type: String, required: true },
  skills: [{ type: String }],
  experienceMin: { type: Number },
  experienceMax: { type: Number },
  salaryRange: {
    min: { type: Number },
    max: { type: Number }
  },
  deadline: { type: Date }, // Application deadline
  location: { type: String, required: true },
  employmentType: {
    type: String,
    enum: ['Full-time', 'Part-time', 'Internship', 'Contract', 'Remote', 'Hybrid'],
    required: true
  },
  responsibilities: [{ type: String }],
  requirements: [{ type: String }],
  attachments: [{
    name: { type: String },
    url: { type: String }
  }],
  additionalNotes: { type: String },
  postedBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  status: {
    type: String,
    enum: ['published', 'draft', 'closed'],
    default: 'published'
  },
  createdAt: { type: Date, default: Date.now }
});

// Text index for search functionality
JobSchema.index({ titleLower: 'text', description: 'text', skills: 'text' });
JobSchema.index({ companyId: 1, titleLower: 1 });

module.exports = mongoose.model('Job', JobSchema);
