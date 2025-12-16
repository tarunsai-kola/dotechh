const mongoose = require('mongoose');

const HRProfileSchema = new mongoose.Schema({
    userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true, unique: true },
    employeeCode: { type: String, required: true },
    department: { type: String },
    specialization: [{ type: String }], // e.g., "Technical", "Sales"
    stats: {
        applicationsReviewed: { type: Number, default: 0 },
        candidatesForwarded: { type: Number, default: 0 }
    },
    createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('HRProfile', HRProfileSchema);
