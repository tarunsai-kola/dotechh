const mongoose = require('mongoose');

const notificationSchema = new mongoose.Schema({
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    type: {
        type: String,
        enum: ['new_application', 'status_change'],
        required: true
    },
    data: {
        jobId: { type: mongoose.Schema.Types.ObjectId, ref: 'Job' },
        applicationId: { type: mongoose.Schema.Types.ObjectId, ref: 'Application' },
        studentName: String,
        newStatus: String,
        companyName: String
    },
    read: {
        type: Boolean,
        default: false
    },
    createdAt: {
        type: Date,
        default: Date.now
    }
});

module.exports = mongoose.model('Notification', notificationSchema);
