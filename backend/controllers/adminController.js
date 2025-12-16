const asyncHandler = require('express-async-handler');
const User = require('../models/User');
const JobAssignment = require('../models/JobAssignment');
const ActivityLog = require('../models/ActivityLog');
const Job = require('../models/Job');

// @desc    Assign HR to Job
// @route   POST /api/admin/assign
// @access  Private/Admin
const assignHR = asyncHandler(async (req, res) => {
    const { hrId, jobId } = req.body;

    const hrUser = await User.findById(hrId);
    if (!hrUser || hrUser.role !== 'hr') {
        res.status(400);
        throw new Error('Invalid HR User ID');
    }

    const job = await Job.findById(jobId);
    if (!job) {
        res.status(404);
        throw new Error('Job not found');
    }

    const assignment = await JobAssignment.create({
        jobId,
        hrUserId: hrId,
        assignedBy: req.user._id
    });

    // Log Activity
    await ActivityLog.create({
        actorId: req.user._id,
        actionType: 'ASSIGN_HR',
        targetEntity: 'Job',
        targetId: jobId,
        changes: { hrId, assigned: true }
    });

    res.status(201).json(assignment);
});

// @desc    Get All Activity Logs
// @route   GET /api/admin/logs
// @access  Private/Admin
const getLogs = asyncHandler(async (req, res) => {
    const logs = await ActivityLog.find()
        .populate('actorId', 'email role')
        .sort({ timestamp: -1 })
        .limit(100);
    res.json(logs);
});

module.exports = { assignHR, getLogs };
