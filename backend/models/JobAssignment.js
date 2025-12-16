const mongoose = require('mongoose');

const JobAssignmentSchema = new mongoose.Schema({
    jobId: { type: mongoose.Schema.Types.ObjectId, ref: 'Job', required: true },
    hrUserId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    assignedBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true }, // Admin
    isActive: { type: Boolean, default: true },
    assignedAt: { type: Date, default: Date.now },
    updatedAt: { type: Date, default: Date.now }
});

// Prevent duplicate active assignments
JobAssignmentSchema.index({ jobId: 1, hrUserId: 1 }, { unique: true });

module.exports = mongoose.model('JobAssignment', JobAssignmentSchema);
