
const express = require('express');
const Application = require('../models/Application');
const Profile = require('../models/Profile');
const Job = require('../models/Job'); // Import Job model
const { protect } = require('../middleware/authMiddleware');
const router = express.Router();

// Apply for a job
router.post('/:jobId', protect, async (req, res) => {
  try {
    const profile = await Profile.findOne({ userId: req.user._id });
    if (!profile) return res.status(400).json({ message: 'Complete profile before applying' });

    const exists = await Application.findOne({ jobId: req.params.jobId, candidateId: profile._id });
    if (exists) return res.status(400).json({ message: 'Already applied' });

    // Mock AI Scoring
    const score = Math.floor(Math.random() * (98 - 60) + 60);

    const application = await Application.create({
      jobId: req.params.jobId,
      candidateId: profile._id,
      matchScore: score
    });

    res.status(201).json(application);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Get applications for a company's job
router.get('/job/:jobId', protect, async (req, res) => {
    // Check if the user owns the job
    const job = await Job.findById(req.params.jobId);
    if (!job) return res.status(404).json({ message: 'Job not found' });
    if (job.companyId.toString() !== req.user._id.toString()) {
        return res.status(403).json({ message: 'Not authorized' });
    }

    try {
        const applications = await Application.find({ jobId: req.params.jobId })
        .populate('candidateId')
        .sort({ matchScore: -1 });
        res.json(applications);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

// Get applications for a student
router.get('/my-applications', protect, async (req, res) => {
    try {
        const profile = await Profile.findOne({ userId: req.user._id });
        if(!profile) return res.json([]);
        
        const applications = await Application.find({ candidateId: profile._id })
            .populate('jobId');
        res.json(applications);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

module.exports = router;
