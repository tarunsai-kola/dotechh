
const express = require('express');
const mongoose = require('mongoose');
const Application = require('../models/Application');
const Profile = require('../models/Profile');
const Job = require('../models/Job'); // Import Job model
const { protect, authorize } = require('../middleware/authMiddleware');
const router = express.Router();

// @route POST /api/applications/:jobId
// @desc Apply to a job
// @access Private (Student)
router.post('/:jobId', protect, authorize('student'), async (req, res) => {
  try {
    const { jobId } = req.params;

    console.log('=== APPLICATION REQUEST START ===');
    console.log('Job ID:', jobId);
    console.log('User:', req.user?.email, 'ID:', req.user?._id);

    // Check if job exists
    const job = await Job.findById(jobId);
    if (!job) {
      console.log('❌ Job not found:', jobId);
      return res.status(404).json({ status: "error", message: "Job not found" });
    }
    console.log('✅ Job found:', job.title);

    // Check if user already applied
    const existingApplication = await Application.findOne({
      jobId,
      studentUserId: req.user._id
    });

    if (existingApplication) {
      console.log('⚠️  Already applied');
      return res.status(409).json({ status: "error", message: "You have already applied to this job" });
    }
    console.log('✅ No existing application');

    // Get student profile
    const profile = await Profile.findOne({ userId: req.user._id });
    if (!profile) {
      console.log('❌ No profile found for user:', req.user._id);
      return res.status(400).json({ status: "error", message: "Please complete your profile before applying" });
    }
    console.log('✅ Profile found:', profile.fullName, '- Profile ID:', profile._id);

    // Create application
    console.log('Creating application with data:', {
      jobId,
      profileId: profile._id,
      studentUserId: req.user._id,
      status: 'applied'
    });

    const application = await Application.create({
      jobId,
      profileId: profile._id,
      studentUserId: req.user._id,
      status: 'applied',
      resumeUrl: profile.resumeUrl, // Copy resumeUrl from profile
      appliedAt: new Date(),
      history: [{
        status: 'applied',
        actorId: req.user._id,
        note: 'Application submitted'
      }]
    });

    console.log('✅ Application created successfully! ID:', application._id);
    console.log('=== APPLICATION REQUEST END ===');

    res.status(201).json({ status: "success", data: application });
  } catch (error) {
    console.error('❌❌❌ APPLICATION ERROR ❌❌❌');
    console.error('Error message:', error.message);
    console.error('Error stack:', error.stack);
    console.error('Error code:', error.code);
    console.error('Full error:', JSON.stringify(error, null, 2));
    console.error('=== APPLICATION REQUEST FAILED ===');
    res.status(500).json({ status: "error", message: error.message });
  }
});

// @route GET /api/applications/check/:jobId
// @desc Check if user has applied to a job
// @access Private (Student)
router.get('/check/:jobId', protect, authorize('student'), async (req, res) => {
  try {
    const { jobId } = req.params;
    const application = await Application.findOne({
      jobId,
      studentUserId: req.user._id
    });

    res.json({
      status: "success",
      hasApplied: !!application,
      applicationId: application?._id,
      appliedAt: application?.appliedAt
    });
  } catch (error) {
    console.error('Check application status error:', error);
    res.status(500).json({ status: "error", message: error.message });
  }
});

// @route GET /api/applications/my-applications
// @desc Get current user's applications
// @access Private (Student)
router.get('/my-applications', protect, authorize('student'), async (req, res) => {
  try {
    console.log('=== FETCHING MY APPLICATIONS ===');
    console.log('User ID from token:', req.user._id);

    // Explicitly cast to ObjectId
    const query = { studentUserId: new mongoose.Types.ObjectId(req.user._id) };
    console.log('Query:', JSON.stringify(query));

    const applications = await Application.find(query)
      .populate({
        path: 'jobId',
        select: 'title companyId location type salary',
        populate: {
          path: 'companyId',
          select: 'name logoUrl'
        }
      })
      .sort({ appliedAt: -1 });

    console.log(`Found ${applications.length} applications`);
    if (applications.length > 0) {
      console.log('First app sample:', JSON.stringify(applications[0], null, 2));
    }

    res.json({ status: "success", data: applications });
  } catch (error) {
    console.error('Fetch applications error:', error);
    res.status(500).json({ status: "error", message: error.message });
  }
});

// @route PUT /api/applications/:applicationId/status
// @desc Update application status
// @access Private (Company Admin)
router.put('/:applicationId/status', protect, authorize('company'), async (req, res) => {
  try {
    const { status, note } = req.body;
    const application = await Application.findById(req.params.applicationId).populate('jobId');

    if (!application) {
      return res.status(404).json({ status: "error", message: "Application not found" });
    }

    // Verify ownership via Job -> Company
    // We need to check if the logged in company user owns the job
    // This requires looking up the Job and checking companyId against req.user.companyId
    // Since we populated jobId, we can check application.jobId.companyId
    // Note: jobId is populated, but we need to ensure it's fully populated or just the ID. 
    // Mongoose populate replaces the ID with the object.
    // However, Job schema has companyId as ObjectId.

    // Let's re-fetch job to be safe and check companyId
    const job = await Job.findById(application.jobId._id);
    if (job.companyId.toString() !== req.user.companyId.toString()) { // Assuming req.user.companyId is set
      return res.status(403).json({ status: "error", message: "Not authorized to update this application" });
    }

    application.status = status;
    application.history.push({
      status,
      actorId: req.user._id,
      note: note || `Status updated to ${status}`
    });

    await application.save();

    // Notify Student
    const Notification = require('../models/Notification');
    // Find company name for better notification
    const companyName = job.companyId.name || "A Company"; // Need to populate companyId in job if not already or fetch it.
    // In previous step we fetched job: const job = await Job.findById(application.jobId._id);
    // Job schema has companyId ref Company. We might need to populate it to get name.
    // Let's assume we just say "Your application status updated".

    await Notification.create({
      userId: application.studentUserId, // Assuming application has studentUserId from schema update
      type: 'status_change',
      data: {
        jobId: job._id,
        applicationId: application._id,
        newStatus: status,
        companyName: "the company" // Placeholder or fetch real name
      }
    });

    // Send Email to Student
    const User = require('../models/User');
    const studentUser = await User.findById(application.studentUserId);

    if (studentUser && studentUser.email) {
      const sendEmail = require('../utils/emailService');
      await sendEmail({
        to: studentUser.email,
        subject: `Application Status Update: ${job.title}`,
        text: `Your application for ${job.title} has been updated to: ${status}.`,
        html: `<p>Your application for <strong>${job.title}</strong> has been updated to: <strong>${status}</strong>.</p><p><a href="${process.env.FRONTEND_URL || 'http://localhost:5173'}/#/student/applications">View Status</a></p>`
      });
    }

    res.json({ status: "success", data: application });
  } catch (error) {
    res.status(500).json({ status: "error", message: error.message });
  }
});

module.exports = router;
