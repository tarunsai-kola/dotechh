
const express = require('express');
const router = express.Router();
const Skill = require('../models/Skill');
const Profile = require('../models/Profile');
const { protect } = require('../middleware/authMiddleware');

// Helper to slugify (preserves C++, C#, .NET)
const slugify = (text) => {
    const lower = text.toString().toLowerCase().trim();
    if (lower === 'c++') return 'cpp';
    if (lower === 'c#') return 'csharp';
    if (lower === '.net') return 'dotnet';

    return lower
        .replace(/\s+/g, '-')           // Replace spaces with -
        .replace(/[^\w\-]+/g, '')       // Remove all non-word chars
        .replace(/\-\-+/g, '-')         // Replace multiple - with single -
        .replace(/^-+/, '')             // Trim - from start of text
        .replace(/-+$/, '');            // Trim - from end of text
};

const SKILL_MASTER = [
    { name: 'React', slug: 'react' },
    { name: 'Node.js', slug: 'node-js' },
    { name: 'JavaScript', slug: 'javascript' },
    { name: 'TypeScript', slug: 'typescript' },
    { name: 'Python', slug: 'python' },
    { name: 'Java', slug: 'java' },
    { name: 'C++', slug: 'cpp' },
    { name: 'C#', slug: 'csharp' },
    { name: 'MongoDB', slug: 'mongodb' },
    { name: 'PostgreSQL', slug: 'postgresql' },
    { name: 'AWS', slug: 'aws' },
    { name: 'Docker', slug: 'docker' },
    { name: 'Git', slug: 'git' }
];

// @route GET /api/skills/suggestions?q=react
router.get('/suggestions', async (req, res) => {
    const { q } = req.query;
    if (!q) return res.json([]);

    try {
        const regex = new RegExp(`^${q}`, 'i'); // Starts with
        const regexInclude = new RegExp(q, 'i'); // Includes

        let skills = await Skill.find({
            $or: [{ name: regex }, { slug: regexInclude }]
        })
            .sort({ popularity: -1 })
            .limit(10);

        // Fallback to master list if no DB results
        if (skills.length === 0) {
            const normalizedQ = q.toLowerCase();
            skills = SKILL_MASTER.filter(s =>
                s.name.toLowerCase().startsWith(normalizedQ) ||
                s.name.toLowerCase().includes(normalizedQ)
            ).slice(0, 10);
        }

        res.json(skills);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

// @route POST /api/skills/profile/add
// Add skill to current user's profile
router.post('/profile/add', protect, async (req, res) => {
    const { name } = req.body;
    if (!name) return res.status(400).json({ message: 'Skill name is required' });

    try {
        const profile = await Profile.findOne({ userId: req.user._id });
        if (!profile) return res.status(404).json({ message: 'Profile not found' });

        const slug = slugify(name);

        // Check if skill already exists in profile
        if (profile.skills.some(s => s.slug === slug)) {
            return res.status(400).json({ message: 'Skill already added' });
        }

        const newSkill = {
            name,
            slug,
            source: 'user'
        };

        profile.skills.push(newSkill);
        await profile.save();

        // Update or create in Master Skill list (increment popularity)
        await Skill.findOneAndUpdate(
            { slug },
            { $set: { name, slug }, $inc: { popularity: 1 } },
            { upsert: true, new: true }
        );

        res.json(profile.skills);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

// @route DELETE /api/skills/profile/:slug
// Remove skill from profile
router.delete('/profile/:slug', protect, async (req, res) => {
    try {
        const profile = await Profile.findOne({ userId: req.user._id });
        if (!profile) return res.status(404).json({ message: 'Profile not found' });

        profile.skills = profile.skills.filter(s => s.slug !== req.params.slug);
        await profile.save();

        res.json(profile.skills);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

module.exports = router;
