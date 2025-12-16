const mongoose = require('mongoose');

const userSessionSchema = new mongoose.Schema({
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    loginTime: {
        type: Date,
        default: Date.now
    },
    lastHeartbeat: {
        type: Date,
        default: Date.now
    },
    ipAddress: String,
    deviceInfo: String,
    isActive: {
        type: Boolean,
        default: true
    }
}, { timestamps: true });

// Auto-expire sessions that haven't heartbeat in 5 minutes
userSessionSchema.index({ lastHeartbeat: 1 }, { expireAfterSeconds: 300 });

module.exports = mongoose.model('UserSession', userSessionSchema);
