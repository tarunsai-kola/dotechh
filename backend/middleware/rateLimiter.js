const rateLimit = require('express-rate-limit');

const loginLimiter = rateLimit({
    windowMs: 15 * 60 * 1000,
    max: 10000, // Effectively disabled for testing
    message: { status: "error", message: "Too many login attempts, please try again after 15 minutes" },
    standardHeaders: true,
    legacyHeaders: false,
});

const otpLimiter = rateLimit({
    windowMs: 60 * 60 * 1000,
    max: 10000, // Effectively disabled for testing
    message: { status: "error", message: "Too many OTP requests, please try again after an hour" },
    standardHeaders: true,
    legacyHeaders: false,
});

const createAccountLimiter = rateLimit({
    windowMs: 60 * 60 * 1000, // 1 hour
    max: 5, // Limit each IP to 5 account creations per hour
    message: {
        status: "error",
        message: "Too many accounts created from this IP, please try again after an hour"
    }
});

module.exports = {
    loginLimiter,
    otpLimiter,
    createAccountLimiter
};
