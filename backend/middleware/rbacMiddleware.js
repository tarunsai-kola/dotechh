const jwt = require('jsonwebtoken');
const asyncHandler = require('express-async-handler');
const User = require('../models/User');
const JobAssignment = require('../models/JobAssignment');
const Application = require('../models/Application');

const protect = asyncHandler(async (req, res, next) => {
    let token;
    if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
        try {
            token = req.headers.authorization.split('')[1];
            const decoded = jwt.verify(token, process.env.JWT_SECRET);
            req.user = await User.findById(decoded.id).select('-passwordHash');
            next();
        } catch (error) {
            console.error(error);
            res.status(401).json({ message: 'Not authorized, token failed' });
        }
    } else {
        res.status(401).json({ message: 'Not authorized, no token' });
    }
});

// Middleware to check specific role
const requireRole = (...roles) => {
    return (req, res, next) => {
        if (!req.user) {
            return res.status(401).json({ message: 'Not authorized' });
        }
        if (!roles.includes(req.user.role)) {
            return res.status(403).json({
                message: `User role ${req.user.role} is not authorized to access this route`
            });
        }
        next();
    };
};

// Middleware: Check if HR is assigned to the Job
const requireAssignment = asyncHandler(async (req, res, next) => {
    if (req.user.role === 'admin') return next(); // Admin overrides

    const jobId = req.params.jobId || req.body.jobId;
    if (!jobId) {
        // If getting application, find job first
        if (req.params.id) { // Application ID
            const app = await Application.findById(req.params.id);
            if (!app) return res.status(404).json({ message: 'Application not found' });

            // Re-check assignment with found jobId
            const assignment = await JobAssignment.findOne({
                jobId: app.jobId,
                hrUserId: req.user._id,
                isActive: true
            });
            if (!assignment) return res.status(403).json({ message: 'Not assigned to this application' });
            return next();
        }
        return next();
    }

    const assignment = await JobAssignment.findOne({
        jobId: jobId,
        hrUserId: req.user._id,
        isActive: true
    });

    if (!assignment) {
        return res.status(403).json({ message: 'You are not assigned to this job' });
    }
    next();
});

module.exports = { protect, requireRole, requireAssignment };
