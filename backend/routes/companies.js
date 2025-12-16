const express = require('express');
const router = express.Router();
const Company = require('../models/Company');
const Job = require('../models/Job');
const Application = require('../models/Application');
const { protect, authorize } = require('../middleware/authMiddleware');
const multer = require('multer');
const path = require('path');

// Configure Multer for logo upload
const storage = multer.diskStorage({
    destination(req, file, cb) {
        cb(null, 'uploads/');
    },
    filename(req, file, cb) {
        cb(null, `company-${Date.now()}${path.extname(file.originalname)}`);
    },
});

const upload = multer({
    storage,
    fileFilter: function (req, file, cb) {
        const filetypes = /jpeg|jpg|png|webp/;
        const extname = filetypes.test(path.extname(file.originalname).toLowerCase());
        const mimetype = filetypes.test(file.mimetype);

        if (extname && mimetype) {
            return cb(null, true);
        } else {
            cb(new Error('Images only!'));
        }
    },
});

// @route GET /api/companies/:companyId
// @desc Get company profile
// @access Public (or Protected based on requirement, usually public)
router.get('/:companyId', async (req, res) => {
    try {
        const company = await Company.findById(req.params.companyId);
        if (!company) {
            return res.status(404).json({ status: "error", message: "Company not found" });
        }
        res.json({ status: "success", data: company });
    } catch (error) {
        res.status(500).json({ status: "error", message: error.message });
    }
});

// @route PUT /api/companies/:companyId
// @desc Update company profile
// @access Private (Company Admin)
router.put('/:companyId', protect, authorize('company'), async (req, res) => {
    try {
        let company = await Company.findById(req.params.companyId);
        if (!company) {
            return res.status(404).json({ status: "error", message: "Company not found" });
        }

        // Check ownership/permission
        const isCreator = company.createdByUserId && company.createdByUserId.toString() === req.user._id.toString();
        const isAdmin = company.team && company.team.some(m => m.userId && m.userId.toString() === req.user._id.toString() && m.role === 'admin');

        if (!isCreator && !isAdmin) {
            return res.status(403).json({ status: "error", message: "Not authorized to update this company" });
        }

        company = await Company.findByIdAndUpdate(req.params.companyId, req.body, {
            new: true,
            runValidators: true
        });

        res.json({ status: "success", data: company });
    } catch (error) {
        res.status(500).json({ status: "error", message: error.message });
    }
});

// @route POST /api/companies/:companyId/logo
// @desc Upload company logo
// @access Private (Company Admin)
router.post('/:companyId/logo', protect, authorize('company'), upload.single('logo'), async (req, res) => {
    try {
        const company = await Company.findById(req.params.companyId);
        if (!company) {
            return res.status(404).json({ status: "error", message: "Company not found" });
        }

        // Authorization check
        const isCreator = company.createdByUserId && company.createdByUserId.toString() === req.user._id.toString();
        if (!isCreator) {
            return res.status(403).json({ status: "error", message: "Not authorized" });
        }

        const logoUrl = `/${req.file.path.replace(/\\/g, '/')}`;
        company.logoUrl = logoUrl;
        await company.save();

        res.json({ status: "success", data: { logoUrl } });
    } catch (error) {
        res.status(500).json({ status: "error", message: error.message });
    }
});

// @route POST /api/companies/:companyId/jobs
// @desc Create a job
// @access Private (Company Admin)
const { body, validationResult } = require('express-validator');
const rateLimit = require('express-rate-limit');

const jobLimiter = rateLimit({
    windowMs: 60 * 60 * 1000, // 1 hour
    max: 10, // limit each IP to 10 job posts per hour
    message: 'Too many jobs posted from this IP, please try again later'
});

// @route POST /api/companies/:companyId/jobs
// @desc Create a job
// @access Private (Company Admin)
router.post('/:companyId/jobs', protect, authorize('company'), jobLimiter, [
    body('title').trim().isLength({ min: 3, max: 100 }).withMessage('Title must be between 3 and 100 characters'),
    body('description').trim().isLength({ min: 10 }).withMessage('Description must be at least 10 characters'),
    body('experienceMin').isInt({ min: 0 }).withMessage('Experience Min must be a positive integer'),
    body('experienceMax').isInt({ min: 0 }).withMessage('Experience Max must be a positive integer'),
    // Add more validations as needed
], async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ status: "error", errors: errors.array() });
    }
    try {
        // Verify company exists and user belongs to it
        const company = await Company.findById(req.params.companyId);
        if (!company) {
            return res.status(404).json({ status: "error", message: "Company not found" });
        }

        // Debug logging
        console.log('=== Job Creation Authorization Debug ===');
        console.log('Company ID:', req.params.companyId);
        console.log('User ID:', req.user._id.toString());
        console.log('Company createdByUserId:', company.createdByUserId?.toString());
        console.log('Company team:', company.team);

        const isCreator = company.createdByUserId && company.createdByUserId.toString() === req.user._id.toString();
        const isAdmin = company.team && company.team.some(m => m.userId && m.userId.toString() === req.user._id.toString() && m.role === 'admin');

        console.log('isCreator:', isCreator);
        console.log('isAdmin:', isAdmin);
        console.log('========================================');

        if (!isCreator && !isAdmin) {
            return res.status(403).json({ status: "error", message: "Not authorized to post jobs for this company" });
        }

        const { title, description, skills, experienceMin, experienceMax, salaryRange, location, employmentType, responsibilities, requirements, status } = req.body;

        const job = await Job.create({
            companyId: req.params.companyId,
            title,
            titleLower: title.toLowerCase(),
            description,
            skills,
            experienceMin,
            experienceMax,
            salaryRange,
            location,
            employmentType,
            responsibilities,
            requirements,
            status: status || 'published',
            postedBy: req.user._id
        });

        res.status(201).json({ status: "success", data: job });
    } catch (error) {
        res.status(500).json({ status: "error", message: error.message });
    }
});

// @route PUT /api/companies/:companyId/jobs/:jobId
// @desc Update a job
// @access Private (Company Admin)
router.put('/:companyId/jobs/:jobId', protect, authorize('company'), [
    body('title').optional().trim().isLength({ min: 3, max: 100 }).withMessage('Title must be between 3 and 100 characters'),
    body('description').optional().trim().isLength({ min: 10 }).withMessage('Description must be at least 10 characters'),
    body('experienceMin').optional().isInt({ min: 0 }).withMessage('Experience Min must be a positive integer'),
    body('experienceMax').optional().isInt({ min: 0 }).withMessage('Experience Max must be a positive integer'),
], async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ status: "error", errors: errors.array() });
    }

    try {
        const job = await Job.findOne({ _id: req.params.jobId, companyId: req.params.companyId });
        if (!job) {
            return res.status(404).json({ status: "error", message: "Job not found" });
        }

        // Verify company ownership
        const company = await Company.findById(req.params.companyId);
        if (!company) {
            return res.status(404).json({ status: "error", message: "Company not found" });
        }

        const isCreator = company.createdByUserId && company.createdByUserId.toString() === req.user._id.toString();
        const isAdmin = company.team && company.team.some(m => m.userId && m.userId.toString() === req.user._id.toString() && m.role === 'admin');

        if (!isCreator && !isAdmin) {
            return res.status(403).json({ status: "error", message: "Not authorized to update this job" });
        }

        // Update allowed fields
        const allowedUpdates = ['title', 'description', 'skills', 'experienceMin', 'experienceMax', 'salaryRange', 'location', 'employmentType', 'responsibilities', 'requirements', 'status'];
        Object.keys(req.body).forEach(key => {
            if (allowedUpdates.includes(key)) {
                job[key] = req.body[key];
            }
        });

        // Update titleLower if title changed
        if (req.body.title) {
            job.titleLower = req.body.title.toLowerCase();
        }

        await job.save();
        res.json({ status: "success", data: job });
    } catch (error) {
        res.status(500).json({ status: "error", message: error.message });
    }
});

// @route DELETE /api/companies/:companyId/jobs/:jobId
// @desc Delete a job
// @access Private (Company Admin)
router.delete('/:companyId/jobs/:jobId', protect, authorize('company'), async (req, res) => {
    try {
        const job = await Job.findOne({ _id: req.params.jobId, companyId: req.params.companyId });
        if (!job) {
            return res.status(404).json({ status: "error", message: "Job not found" });
        }

        // Verify company ownership
        const company = await Company.findById(req.params.companyId);
        if (!company) {
            return res.status(404).json({ status: "error", message: "Company not found" });
        }

        const isCreator = company.createdByUserId && company.createdByUserId.toString() === req.user._id.toString();
        const isAdmin = company.team && company.team.some(m => m.userId && m.userId.toString() === req.user._id.toString() && m.role === 'admin');

        if (!isCreator && !isAdmin) {
            return res.status(403).json({ status: "error", message: "Not authorized to delete this job" });
        }

        await Job.deleteOne({ _id: req.params.jobId });
        res.json({ status: "success", message: "Job deleted successfully" });
    } catch (error) {
        res.status(500).json({ status: "error", message: error.message });
    }
});

// @route GET /api/companies/:companyId/jobs
// @desc List company jobs
// @access Public (or Private? Requirement says "list company jobs (drafts & published)", usually public sees published, company sees all)
router.get('/:companyId/jobs', async (req, res) => {
    try {
        // If user is the company admin, show all. Else show only published.
        // This requires optional auth. For now, let's just return all and filter in frontend or add logic.
        // Let's assume this is the public view for now, or we check token manually if present.

        const jobs = await Job.find({ companyId: req.params.companyId }).sort({ createdAt: -1 });
        res.json({ status: "success", data: jobs });
    } catch (error) {
        res.status(500).json({ status: "error", message: error.message });
    }
});

// @route GET /api/companies/:companyId/jobs/:jobId/applications
// @desc Company view of applicants
// @access Private (Company Admin)
router.get('/:companyId/jobs/:jobId/applications', protect, authorize('company'), async (req, res) => {
    try {
        // Verify ownership
        const job = await Job.findOne({ _id: req.params.jobId, companyId: req.params.companyId });
        if (!job) {
            return res.status(404).json({ status: "error", message: "Job not found or does not belong to this company" });
        }

        // Pagination & Filters
        const page = parseInt(req.query.page) || 1;
        const limit = parseInt(req.query.limit) || 10;
        const skip = (page - 1) * limit;
        const status = req.query.status;

        let query = { jobId: req.params.jobId };

        // RPO Visibility Rule: Company only sees applications forwarded by HR
        // Exclude 'pending_hr' and 'hr_rejected'
        if (status) {
            query.status = status;
        } else {
            // Default view: Show visible applications only
            query.status = { $nin: ['pending_hr', 'hr_rejected'] };
        }

        const applications = await Application.find(query)
            .populate('studentUserId', 'email') // Populate basic user info
            .populate('profileId') // Populate profile details
            .skip(skip)
            .limit(limit)
            .sort({ appliedAt: -1 });

        const total = await Application.countDocuments(query);

        res.json({
            status: "success",
            data: applications,
            pagination: {
                page,
                limit,
                total,
                pages: Math.ceil(total / limit)
            }
        });

    } catch (error) {
        res.status(500).json({ status: "error", message: error.message });
    }
});

// @route GET /api/companies/:companyId/stats/applications
// @desc Get application statistics for dashboard charts
// @access Private (Company Admin)
router.get('/:companyId/stats/applications', protect, authorize('company'), async (req, res) => {
    try {
        const company = await Company.findById(req.params.companyId);
        if (!company) {
            return res.status(404).json({ status: "error", message: "Company not found" });
        }

        // Get all jobs for this company
        const jobs = await Job.find({ companyId: req.params.companyId });
        const jobIds = jobs.map(j => j._id);

        // Get applications for the last 7 days
        const sevenDaysAgo = new Date();
        sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);

        const applications = await Application.find({
            jobId: { $in: jobIds },
            appliedAt: { $gte: sevenDaysAgo }
        });

        // Group by day
        const dayNames = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
        const stats = {};

        // Initialize last 7 days
        for (let i = 6; i >= 0; i--) {
            const date = new Date();
            date.setDate(date.getDate() - i);
            const dayName = dayNames[date.getDay()];
            stats[dayName] = 0;
        }

        // Count applications per day
        applications.forEach(app => {
            const dayName = dayNames[new Date(app.appliedAt).getDay()];
            if (stats[dayName] !== undefined) {
                stats[dayName]++;
            }
        });

        // Convert to array format for chart
        const chartData = Object.entries(stats).map(([name, applicants]) => ({
            name,
            applicants
        }));

        res.json({ status: "success", data: chartData });
    } catch (error) {
        res.status(500).json({ status: "error", message: error.message });
    }
});

module.exports = router;
