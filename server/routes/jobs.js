
const express = require('express');
const Job = require('../models/Job');
const { protect } = require('../middleware/authMiddleware');
const router = express.Router();

// Get all jobs (with optional search)
router.get('/', async (req, res) => {
  const { search, type, category } = req.query;
  let query = { status: 'open' };

  if (search) {
    query.$text = { $search: search };
  }
  if (type && type !== 'All') {
    query.type = type;
  }
  
  // Future implementation: category filtering

  try {
    const jobs = await Job.find(query).sort({ postedAt: -1 });
    res.json(jobs);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Create a job (Company only)
router.post('/', protect, async (req, res) => {
  if (req.user.role !== 'company') {
    return res.status(403).json({ message: 'Only companies can post jobs' });
  }

  try {
    const job = await Job.create({
      ...req.body,
      companyId: req.user._id,
      companyName: 'My Company' // Ideally fetched from Company Profile
    });
    res.status(201).json(job);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

module.exports = router;
