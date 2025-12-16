const express = require('express');
const router = express.Router();
const Job = require('../models/Job');

// @route GET /api/analytics/trending-skills
// @desc Get trending skills based on recent job postings
// @access Public
router.get('/trending-skills', async (req, res) => {
    try {
        const { limit = 10, period = '30d' } = req.query;

        // Parse period (e.g., '30d', '7d', '90d')
        const periodMatch = period.match(/(\d+)d/);
        const days = periodMatch ? parseInt(periodMatch[1]) : 30;

        // Calculate date from period
        const periodStart = new Date();
        periodStart.setDate(periodStart.getDate() - days);

        // MongoDB aggregation pipeline
        const trendingSkills = await Job.aggregate([
            {
                $match: {
                    status: 'published',
                    createdAt: { $gte: periodStart }
                }
            },
            { $unwind: '$skills' },
            {
                $group: {
                    _id: '$skills',
                    count: { $sum: 1 }
                }
            },
            { $sort: { count: -1 } },
            { $limit: parseInt(limit) },
            {
                $project: {
                    skill: '$_id',
                    count: 1,
                    _id: 0
                }
            }
        ]);

        res.json({
            status: 'success',
            data: trendingSkills,
            meta: {
                period: period,
                periodDays: days,
                limit: parseInt(limit)
            }
        });
    } catch (error) {
        console.error('Trending skills error:', error);
        res.status(500).json({
            status: 'error',
            message: error.message
        });
    }
});

// @route GET /api/analytics/job-stats
// @desc Get job posting statistics
// @access Public
router.get('/job-stats', async (req, res) => {
    try {
        const totalJobs = await Job.countDocuments({ status: 'published' });
        const last30Days = new Date();
        last30Days.setDate(last30Days.getDate() - 30);

        const recentJobs = await Job.countDocuments({
            status: 'published',
            createdAt: { $gte: last30Days }
        });

        // Jobs by employment type
        const jobsByType = await Job.aggregate([
            { $match: { status: 'published' } },
            { $group: { _id: '$employmentType', count: { $sum: 1 } } },
            { $sort: { count: -1 } }
        ]);

        res.json({
            status: 'success',
            data: {
                totalJobs,
                recentJobs,
                jobsByType
            }
        });
    } catch (error) {
        res.status(500).json({
            status: 'error',
            message: error.message
        });
    }
});

module.exports = router;
