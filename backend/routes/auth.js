const express = require('express');
const router = express.Router();
const {
  signup,
  registerCompany,
  login,
  refreshToken,
  logout,
  sendOtp,
  verifyOtp,
  heartbeat
} = require('../controllers/authController');
const { protect } = require('../middleware/authMiddleware');
const { loginLimiter, otpLimiter, createAccountLimiter } = require('../middleware/rateLimiter');

// Public Routes
router.post('/signup', createAccountLimiter, signup);
router.post('/register-company', createAccountLimiter, registerCompany);
router.post('/login', loginLimiter, login);
router.post('/refresh-token', refreshToken);
router.post('/logout', logout);

// OTP Routes
router.post('/send-otp', otpLimiter, sendOtp);
router.post('/verify-otp', otpLimiter, verifyOtp);

// Protected Routes
router.post('/heartbeat', protect, heartbeat);

// Protected Test Route (Optional, keep if needed for frontend checks)
router.get('/me', protect, (req, res) => {
  res.json({
    status: 'success',
    user: {
      id: req.user._id,
      email: req.user.email,
      role: req.user.role,
      companyId: req.user.companyId
    }
  });
});

module.exports = router;
