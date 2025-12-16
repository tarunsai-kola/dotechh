const mongoose = require('mongoose');

const ActivityLogSchema = new mongoose.Schema({
    actorId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    actionType: { type: String, required: true }, // e.g., 'LOGIN', 'ASSIGN_HR', 'UPDATE_STATUS'
    targetEntity: { type: String, required: true }, // 'Application', 'Job', 'User'
    targetId: { type: mongoose.Schema.Types.ObjectId, required: true },
    changes: { type: mongoose.Schema.Types.Mixed }, // JSON of before/after
    ipAddress: { type: String },
    userAgent: { type: String },
    timestamp: { type: Date, default: Date.now }
});

module.exports = mongoose.model('ActivityLog', ActivityLogSchema);
