const mongoose = require('mongoose');

const CompanySchema = new mongoose.Schema({
    name: { type: String, required: true },
    domain: { type: String },
    logoUrl: { type: String },
    description: { type: String },
    locations: [{ type: String }],
    website: { type: String },
    phone: { type: String },
    email: { type: String }, // Kept for backward compatibility/auth
    createdByUserId: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },  // Will be set after user creation
    team: [{
        userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
        role: { type: String, enum: ['admin', 'recruiter', 'member'], default: 'member' }
    }],
    isVerified: { type: Boolean, default: false },
    createdAt: { type: Date, default: Date.now },
    updatedAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Company', CompanySchema);
