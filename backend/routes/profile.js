const express = require('express');
const router = express.Router();
const Profile = require('../models/Profile');
const { protect } = require('../middleware/authMiddleware');

// @route GET /api/profile/me
router.get('/me', protect, async (req, res) => {
    try {
        const profile = await Profile.findOne({ userId: req.user._id }).populate('userId', 'email');
        if (!profile) {
            return res.status(404).json({ status: "error", message: "Profile not found" });
        }
        res.json({ status: "success", profile });
    } catch (error) {
        res.status(500).json({ status: "error", message: error.message });
    }
});


// @route POST /api/profile
// @desc Create or Update Profile (Upsert)
router.post('/', protect, async (req, res) => {
    const { fullName, displayName, headline, bio, about, photoUrl, avatarUrl, resumeUrl, skills, onboardingStep, location, mobile } = req.body;

    try {
        let profile = await Profile.findOne({ userId: req.user._id });

        // Normalize skills if provided
        let normalizedSkills = undefined;
        if (skills && Array.isArray(skills)) {
            normalizedSkills = skills.map(skill => ({
                name: skill.name ? skill.name.trim() : '',
                slug: skill.slug || (skill.name ? skill.name.toLowerCase().replace(/\s+/g, '-') : ''),
                proficiency: skill.proficiency || skill.level,
                years: skill.years
            }));
        }

        if (!profile) {
            // Create new profile
            profile = new Profile({
                userId: req.user._id,
                fullName: fullName || displayName || 'User',
                headline,
                bio: bio || about,
                photoUrl: photoUrl || avatarUrl,
                resumeUrl,
                skills: normalizedSkills || [],
                profileCompleteness: 50,
                onboardingStep: onboardingStep || 1,
                location: location || {},
                mobile
            });
            console.log('✅ Creating new profile for user:', req.user.email);
        } else {
            // Update existing profile fields
            if (fullName || displayName) profile.fullName = fullName || displayName;
            if (headline) profile.headline = headline;
            if (bio || about) profile.bio = bio || about;
            if (photoUrl || avatarUrl) profile.photoUrl = photoUrl || avatarUrl;
            if (resumeUrl) profile.resumeUrl = resumeUrl;
            if (mobile) profile.mobile = mobile;
            if (normalizedSkills) profile.skills = normalizedSkills;
            if (onboardingStep) profile.onboardingStep = onboardingStep;
            if (location) profile.location = location;

            // Calculate completeness


            console.log('✅ Updating profile for user:', req.user.email);
        }

        profile.updatedAt = Date.now();
        await profile.save();

        res.json({ status: "success", message: "Profile saved", profile });
    } catch (error) {
        console.error('Profile update error:', error);
        res.status(500).json({ status: "error", message: error.message });
    }
});

// @route GET /api/profile/experience
// @desc Get user's experience
router.get('/experience', protect, async (req, res) => {
    try {
        const profile = await Profile.findOne({ userId: req.user._id });

        if (!profile) {
            return res.json({ status: "success", data: [] }); // Return empty array if no profile
        }

        res.json({ status: "success", data: profile.experience || [] });
    } catch (error) {
        console.error('Experience fetch error:', error);
        res.status(500).json({ status: "error", message: error.message });
    }
});

// @route POST /api/profile/experience
// @desc Add or update experience
router.post('/experience', protect, async (req, res) => {
    try {
        let profile = await Profile.findOne({ userId: req.user._id });

        if (!profile) {
            return res.status(404).json({ status: "error", message: "Profile not found. Please create profile first." });
        }

        const experienceData = req.body;

        // Add to experience array
        if (!profile.experience) {
            profile.experience = [];
        }
        profile.experience.push(experienceData);

        await profile.save();
        res.json({ status: "success", message: "Experience added", profile });
    } catch (error) {
        console.error('Experience add error:', error);
        res.status(500).json({ status: "error", message: error.message });
    }
});

// @route GET /api/profile/education
// @desc Get user's education
router.get('/education', protect, async (req, res) => {
    try {
        const profile = await Profile.findOne({ userId: req.user._id });

        if (!profile) {
            return res.json({ status: "success", data: [] }); // Return empty array if no profile
        }

        res.json({ status: "success", data: profile.education || [] });
    } catch (error) {
        console.error('Education fetch error:', error);
        res.status(500).json({ status: "error", message: error.message });
    }
});

// @route POST /api/profile/education  
// @desc Add or update education
router.post('/education', protect, async (req, res) => {
    try {
        let profile = await Profile.findOne({ userId: req.user._id });

        if (!profile) {
            return res.status(404).json({ status: "error", message: "Profile not found. Please create profile first." });
        }

        const educationData = req.body;

        // Add to education array
        if (!profile.education) {
            profile.education = [];
        }
        profile.education.push(educationData);

        await profile.save();
        res.json({ status: "success", message: "Education added", profile });
    } catch (error) {
        console.error('Education add error:', error);
        res.status(500).json({ status: "error", message: error.message });
    }
});

// @route PUT /api/profile/experience/:exp_id
// @desc Update specific experience
router.put('/experience/:exp_id', protect, async (req, res) => {
    try {
        const profile = await Profile.findOne({ userId: req.user._id });

        if (!profile) {
            return res.status(404).json({ status: "error", message: "Profile not found" });
        }

        const expIndex = profile.experience.findIndex(item => item._id.toString() === req.params.exp_id);

        if (expIndex === -1) {
            return res.status(404).json({ status: "error", message: "Experience item not found" });
        }

        // Update fields
        const { company, position, Role, startDate, endDate, description, location, currentlyWorking } = req.body;

        if (company) profile.experience[expIndex].company = company;
        if (position) profile.experience[expIndex].position = position;
        if (Role) profile.experience[expIndex].Role = Role;
        if (startDate) profile.experience[expIndex].startDate = startDate;
        if (endDate) profile.experience[expIndex].endDate = endDate;
        if (description) profile.experience[expIndex].description = description;
        if (location) profile.experience[expIndex].location = location;
        if (currentlyWorking !== undefined) profile.experience[expIndex].currentlyWorking = currentlyWorking;

        await profile.save();
        res.json({ status: "success", message: "Experience updated", profile });
    } catch (error) {
        console.error('Experience update error:', error);
        res.status(500).json({ status: "error", message: error.message });
    }
});

// @route PUT /api/profile/education/:edu_id
// @desc Update specific education
router.put('/education/:edu_id', protect, async (req, res) => {
    try {
        const profile = await Profile.findOne({ userId: req.user._id });

        if (!profile) {
            return res.status(404).json({ status: "error", message: "Profile not found" });
        }

        const eduIndex = profile.education.findIndex(item => item._id.toString() === req.params.edu_id);

        if (eduIndex === -1) {
            return res.status(404).json({ status: "error", message: "Education item not found" });
        }

        // Update fields
        const { institution, degree, field, startDate, endDate, description } = req.body;

        if (institution) profile.education[eduIndex].institution = institution;
        if (degree) profile.education[eduIndex].degree = degree;
        if (field) profile.education[eduIndex].field = field;
        if (startDate) profile.education[eduIndex].startDate = startDate;
        if (endDate) profile.education[eduIndex].endDate = endDate;
        if (description) profile.education[eduIndex].description = description;

        await profile.save();
        res.json({ status: "success", message: "Education updated", profile });
    } catch (error) {
        console.error('Education update error:', error);
        res.status(500).json({ status: "error", message: error.message });
    }
});

// @route DELETE /api/profile/experience/:exp_id
// @desc Delete experience from profile
router.delete('/experience/:exp_id', protect, async (req, res) => {
    try {
        const profile = await Profile.findOne({ userId: req.user._id });

        if (!profile) {
            return res.status(404).json({ status: "error", message: "Profile not found" });
        }

        // Get remove index
        const removeIndex = profile.experience.findIndex(
            item => item._id.toString() === req.params.exp_id
        );

        if (removeIndex === -1) {
            return res.status(404).json({ status: "error", message: "Experience not found" });
        }

        profile.experience.splice(removeIndex, 1);
        await profile.save();

        res.json({ status: "success", message: "Experience deleted", profile });
    } catch (error) {
        console.error('Experience delete error:', error);
        res.status(500).json({ status: "error", message: error.message });
    }
});

// @route DELETE /api/profile/education/:edu_id
// @desc Delete education from profile
router.delete('/education/:edu_id', protect, async (req, res) => {
    try {
        const profile = await Profile.findOne({ userId: req.user._id });

        if (!profile) {
            return res.status(404).json({ status: "error", message: "Profile not found" });
        }

        // Get remove index
        const removeIndex = profile.education.findIndex(
            item => item._id.toString() === req.params.edu_id
        );

        if (removeIndex === -1) {
            return res.status(404).json({ status: "error", message: "Education not found" });
        }

        profile.education.splice(removeIndex, 1);
        await profile.save();

        res.json({ status: "success", message: "Education deleted", profile });
    } catch (error) {
        console.error('Education delete error:', error);
        res.status(500).json({ status: "error", message: error.message });
    }
});

// @route POST /api/profile/skills
// @desc Add a skill
router.post('/skills', protect, async (req, res) => {
    try {
        let profile = await Profile.findOne({ userId: req.user._id });

        if (!profile) {
            return res.status(404).json({ status: "error", message: "Profile not found" });
        }

        const { name, proficiency } = req.body;
        const newSkill = {
            name: name.trim(),
            slug: name.trim().toLowerCase().replace(/\s+/g, '-'),
            proficiency: proficiency || 'Intermediate'
        };

        if (!profile.skills) profile.skills = [];
        profile.skills.push(newSkill);

        await profile.save();
        res.json({ status: "success", message: "Skill added", profile });
    } catch (error) {
        console.error('Skill add error:', error);
        res.status(500).json({ status: "error", message: error.message });
    }
});

// @route PUT /api/profile/skills/:skill_id
// @desc Update specific skill
router.put('/skills/:skill_id', protect, async (req, res) => {
    try {
        const profile = await Profile.findOne({ userId: req.user._id });

        if (!profile) {
            return res.status(404).json({ status: "error", message: "Profile not found" });
        }

        const skillIndex = profile.skills.findIndex(
            item => item._id.toString() === req.params.skill_id
        );

        if (skillIndex === -1) {
            return res.status(404).json({ status: "error", message: "Skill not found" });
        }

        const { name, proficiency } = req.body;
        if (name) {
            profile.skills[skillIndex].name = name.trim();
            profile.skills[skillIndex].slug = name.trim().toLowerCase().replace(/\s+/g, '-');
        }
        if (proficiency) profile.skills[skillIndex].proficiency = proficiency;

        await profile.save();
        res.json({ status: "success", message: "Skill updated", profile });
    } catch (error) {
        console.error('Skill update error:', error);
        res.status(500).json({ status: "error", message: error.message });
    }
});

// @route DELETE /api/profile/skills/:skill_id
// @desc Delete skill from profile
router.delete('/skills/:skill_id', protect, async (req, res) => {
    try {
        const profile = await Profile.findOne({ userId: req.user._id });

        if (!profile) {
            return res.status(404).json({ status: "error", message: "Profile not found" });
        }

        const removeIndex = profile.skills.findIndex(
            item => item._id.toString() === req.params.skill_id
        );

        if (removeIndex === -1) {
            return res.status(404).json({ status: "error", message: "Skill not found" });
        }

        profile.skills.splice(removeIndex, 1);
        await profile.save();

        res.json({ status: "success", message: "Skill deleted", profile });
    } catch (error) {
        console.error('Skill delete error:', error);
        res.status(500).json({ status: "error", message: error.message });
    }
});

module.exports = router;
