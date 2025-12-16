const express = require('express');
const router = express.Router();
const Notification = require('../models/Notification');
const { protect } = require('../middleware/authMiddleware');

// @route GET /api/notifications
// @desc Get user notifications
// @access Private
router.get('/', protect, async (req, res) => {
    try {
        const notifications = await Notification.find({ userId: req.user._id })
            .sort({ createdAt: -1 })
            .limit(20);

        // Count unread
        const unreadCount = await Notification.countDocuments({ userId: req.user._id, read: false });

        res.json({ status: "success", data: notifications, unreadCount });
    } catch (error) {
        res.status(500).json({ status: "error", message: error.message });
    }
});

// @route PUT /api/notifications/:id/read
// @desc Mark notification as read
// @access Private
router.put('/:id/read', protect, async (req, res) => {
    try {
        const notification = await Notification.findOne({ _id: req.params.id, userId: req.user._id });
        if (!notification) {
            return res.status(404).json({ status: "error", message: "Notification not found" });
        }

        notification.read = true;
        await notification.save();

        res.json({ status: "success", data: notification });
    } catch (error) {
        res.status(500).json({ status: "error", message: error.message });
    }
});

// @route PUT /api/notifications/read-all
// @desc Mark all notifications as read
// @access Private
router.put('/read-all', protect, async (req, res) => {
    try {
        await Notification.updateMany({ userId: req.user._id, read: false }, { read: true });
        res.json({ status: "success", message: "All marked as read" });
    } catch (error) {
        res.status(500).json({ status: "error", message: error.message });
    }
});

module.exports = router;
