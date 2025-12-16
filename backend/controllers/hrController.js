const asyncHandler = require('express-async-handler');
const JobAssignment = require('../models/JobAssignment');
const Application = require('../models/Application');
const Job = require('../models/Job');
const ActivityLog = require('../models/ActivityLog');

// @desc    Get Jobs Assigned to Current HR
// @route   GET /api/hr/jobs
// @access  Private/HR
const getAssignedJobs = asyncHandler(async (req, res) => {
    // 1. Find all assignment records for this HR user
    const assignments = await JobAssignment.find({
        hrUserId: req.user._id,
        isActive: true
    });

    const jobIds = assignments.map(a => a.jobId);

    // 2. Fetch the actual Job details
    const jobs = await Job.find({ _id: { $in: jobIds } });

    res.json(jobs);
});

// @desc    Verify/Move Application Status (Gatekeeper)
// @route   PATCH /api/hr/applications/:id/status
// @access  Private/HR (Assigned)
const updateApplicationStatus = asyncHandler(async (req, res) => {
    const { status, note } = req.body;
    const { id } = req.params;

    const application = await Application.findById(id);

    if (!application) {
        res.status(404);
        throw new Error('Application not found');
    }

    // Capture old status for log
    const oldStatus = application.status;

    // Rules
    // Only HR can move from 'pending_hr' -> 'forwarded_to_company' or 'hr_rejected'
    if (status === 'forwarded_to_company' || status === 'hr_rejected') {
        application.status = status;
        if (note) application.hrInternalNotes = note;

        await application.save();

        // Log
        await ActivityLog.create({
            actorId: req.user._id,
            actionType: 'STATUS_CHANGE',
            targetEntity: 'Application',
            targetId: id,
            changes: { oldStatus, newStatus: status, note }
        });

        res.json(application);
    } else {
        res.status(400);
        throw new Error('Invalid status transition for HR');
    }
});

module.exports = { getAssignedJobs, updateApplicationStatus };
