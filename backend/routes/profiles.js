
const express = require('express');
const Profile = require('../models/Profile');
const { protect } = require('../middleware/authMiddleware');
const router = express.Router();

// Get current user profile
router.get('/me', protect, async (req, res) => {
  try {
    const profile = await Profile.findOne({ userId: req.user._id });
    if (!profile) return res.status(404).json({ message: 'Profile not found' });
    res.json(profile);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Create or Update profile
router.post('/', protect, async (req, res) => {
  try {
    const profileFields = { ...req.body, userId: req.user._id };

    // Check for duplicate resume if hash provided
    if (req.body.resumeHash) {
      const existingResume = await Profile.findOne({ resumeHash: req.body.resumeHash, userId: { $ne: req.user._id } });
      if (existingResume) {
        return res.status(400).json({ message: 'This resume has already been uploaded by another user' });
      }
    }

    let profile = await Profile.findOne({ userId: req.user._id });

    if (profile) {
      // Update
      profile = await Profile.findOneAndUpdate(
        { userId: req.user._id },
        { $set: profileFields },
        { new: true }
      );
    } else {
      // Create
      profile = await Profile.create(profileFields);
    }
    res.json(profile);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

module.exports = router;
