const express = require('express');
const router = express.Router();
const { assignHR, getLogs } = require('../controllers/adminController');
const { protect, requireRole } = require('../middleware/rbacMiddleware');

router.use(protect);
router.use(requireRole('admin'));

router.post('/assign', assignHR);
router.get('/logs', getLogs);

module.exports = router;
