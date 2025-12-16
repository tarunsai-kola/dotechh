
const express = require('express');
const Job = require('../models/Job');
const { protect } = require('../middleware/authMiddleware');
const router = express.Router();

const Application = require('../models/Application');
const Profile = require('../models/Profile');

// @route GET /api/jobs
// @desc Search jobs
// @access Public
router.get('/', async (req, res) => {
  const { q, skills, location, companyId, employmentType, minExp, page = 1, limit = 10 } = req.query;
  let query = { status: 'published' };

  if (q) {
    query.$text = { $search: q };
  }
  if (skills) {
    query.skills = { $in: skills.split(',') };
  }
  if (location) {
    query.location = { $regex: location, $options: 'i' };
  }
  if (companyId) {
    query.companyId = companyId;
  }
  if (employmentType) {
    query.employmentType = employmentType;
  }
  if (minExp) {
    query.experienceMin = { $lte: parseInt(minExp) };
  }

  try {
    const skip = (parseInt(page) - 1) * parseInt(limit);
    const jobs = await Job.find(query)
      .populate('companyId', 'name logoUrl')
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(parseInt(limit));

    const total = await Job.countDocuments(query);

    res.json({
      status: "success",
      data: jobs,
      pagination: {
        page: parseInt(page),
        limit: parseInt(limit),
        total,
        pages: Math.ceil(total / parseInt(limit))
      }
    });
  } catch (error) {
    res.status(500).json({ status: "error", message: error.message });
  }
});

// @route GET /api/jobs/:jobId
// @desc Get job details
// @access Public
router.get('/:jobId', async (req, res) => {
  try {
    const job = await Job.findById(req.params.jobId).populate('companyId', 'name logoUrl description website');
    if (!job) {
      return res.status(404).json({ status: "error", message: "Job not found" });
    }
    res.json({ status: "success", data: job });
  } catch (error) {
    res.status(500).json({ status: "error", message: error.message });
  }
});

// @route POST /api/jobs/:jobId/apply
// @desc Apply for a job
// @access Private (Student)
const rateLimit = require('express-rate-limit');

const applyLimiter = rateLimit({
  windowMs: 60 * 60 * 1000, // 1 hour
  max: 5, // limit each IP to 5 applications per hour
  message: 'Too many applications from this IP, please try again later'
});

// @route POST /api/jobs/:jobId/apply
// @desc Apply for a job
// @access Private (Student)
router.post('/:jobId/apply', protect, applyLimiter, async (req, res) => {
  if (req.user.role !== 'student') {
    return res.status(403).json({ status: "error", message: "Only students can apply" });
  }

  try {
    const { profileId, resumeUrl, coverNote } = req.body;

    // Verify profile belongs to user
    const profile = await Profile.findOne({ userId: req.user._id });
    if (!profile) return res.status(400).json({ status: "error", message: "Complete profile before applying" });

    // Check if already applied
    const exists = await Application.findOne({ jobId: req.params.jobId, studentUserId: req.user._id });
    if (exists) return res.status(400).json({ status: "error", message: "Already applied" });

    const application = await Application.create({
      jobId: req.params.jobId,
      profileId: profile._id,
      studentUserId: req.user._id,
      resumeUrl: resumeUrl || profile.resumeUrl, // Use provided or profile resume
      coverNote,
      status: 'applied',
      history: [{ status: 'applied', note: 'Application submitted' }]
    });

    // Notify company
    // Notify company
    const job = await Job.findById(req.params.jobId).populate('postedBy', 'email'); // Populate postedBy to get email

    if (job && job.postedBy) {
      const Notification = require('../models/Notification');
      await Notification.create({
        userId: job.postedBy._id,
        type: 'new_application',
        data: {
          jobId: job._id,
          applicationId: application._id,
          studentName: profile.displayName
        }
      });

      // Send Email
      const sendEmail = require('../utils/emailService');
      await sendEmail({
        to: job.postedBy.email,
        subject: `New Application for ${job.title}`,
        text: `You have received a new application from ${profile.displayName} for the position of ${job.title}. Check your dashboard to review.`,
        html: `<p>You have received a new application from <strong>${profile.displayName}</strong> for the position of <strong>${job.title}</strong>.</p><p><a href="${process.env.FRONTEND_URL || 'http://localhost:5173'}/#/company/applicants">View Application</a></p>`
      });
    }

    res.status(201).json({ status: "success", data: application });
  } catch (error) {
    res.status(500).json({ status: "error", message: error.message });
  }
});

module.exports = router;
