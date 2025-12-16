const express = require('express');
const router = express.Router();
const { getAssignedJobs, updateApplicationStatus } = require('../controllers/hrController');
const { protect, requireRole, requireAssignment } = require('../middleware/rbacMiddleware');

router.use(protect);
router.use(requireRole('hr'));

router.get('/jobs', getAssignedJobs);
router.patch('/applications/:id/status', requireAssignment, updateApplicationStatus);

module.exports = router;
