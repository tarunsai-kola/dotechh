const User = require('../models/User');
const Company = require('../models/Company');
const Otp = require('../models/Otp');
const generateAccessAndRefreshTokens = require('../utils/generateToken');
const sendEmail = require('../utils/sendEmail');
const crypto = require('crypto');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

// Helper to send token response
const sendTokenResponse = (user, statusCode, res, profileExists = false) => {
    const { accessToken, refreshToken } = generateAccessAndRefreshTokens(user._id);

    // Cookie options
    const cookieOptions = {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production', // true in production
        sameSite: 'strict',
        maxAge: 7 * 24 * 60 * 60 * 1000 // 7 days
    };

    const accessCookieOptions = {
        ...cookieOptions,
        maxAge: 15 * 60 * 1000 // 15 mins
    };

    // Set Cookies
    res.cookie('accessToken', accessToken, accessCookieOptions);
    res.cookie('refreshToken', refreshToken, { ...cookieOptions, path: '/api/auth/refresh-token' });

    // Response (Keep tokens in body for Mobile App usage)
    res.status(statusCode).json({
        status: "success",
        message: "Authentication successful",
        accessToken,
        refreshToken,
        userId: user._id,
        profileExists,
        role: user.role,
        user: {
            id: user._id,
            email: user.email,
            role: user.role,
            companyId: user.companyId
        }
    });
};

// @desc    Register Student
// @route   POST /api/auth/signup
exports.signup = async (req, res) => {
    try {
        const { email, password, role } = req.body;

        if (!email || !password || password.length < 8) {
            return res.status(400).json({ status: "error", message: "Invalid email or password (min 8 chars)" });
        }

        const userExists = await User.findOne({ email: email.toLowerCase() });
        if (userExists) return res.status(409).json({ status: "error", message: 'User already exists' });

        // Allow 'student', 'hr', 'admin' to be created via this endpoint for now
        // In production, 'admin' creation should be restricted
        const userRole = ['student', 'hr', 'admin'].includes(role) ? role : 'student';

        const user = await User.create({
            email: email.toLowerCase(),
            passwordHash: password,
            role: userRole
        });

        sendTokenResponse(user, 201, res, false);
    } catch (error) {
        res.status(500).json({ status: "error", message: error.message });
    }
};

// @desc    Register Company
// @route   POST /api/auth/register-company
exports.registerCompany = async (req, res) => {
    try {
        const { email, password, companyName, phone } = req.body;

        if (!email || !password || password.length < 8 || !companyName) {
            return res.status(400).json({ status: "error", message: "All fields are required and password must be at least 8 chars" });
        }

        const userExists = await User.findOne({ email: email.toLowerCase() });
        if (userExists) return res.status(409).json({ status: "error", message: 'User already exists' });

        const company = await Company.create({
            name: companyName,
            email: email.toLowerCase(),
            phone,
            createdByUserId: null,
            team: []
        });

        const user = await User.create({
            email: email.toLowerCase(),
            passwordHash: password,
            role: 'company',
            companyId: company._id
        });

        company.createdByUserId = user._id;
        company.team = [{ userId: user._id, role: 'admin' }];
        await company.save();

        sendTokenResponse(user, 201, res, false);
    } catch (error) {
        res.status(500).json({ status: "error", message: error.message });
    }
};

// @desc    Login User
// @route   POST /api/auth/login
exports.login = async (req, res) => {
    try {
        const { email, password } = req.body;

        if (!email || !password) {
            return res.status(400).json({ status: "error", message: 'Please provide email and password' });
        }

        const user = await User.findOne({ email: email.toLowerCase() });

        if (!user || !(await user.matchPassword(password))) {
            return res.status(401).json({ status: "error", message: 'Invalid email or password' });
        }

        let profileExists = false;
        if (user.role === 'student') {
            const Profile = require('../models/Profile');
            profileExists = !!(await Profile.findOne({ userId: user._id }));
        }

        sendTokenResponse(user, 200, res, profileExists);
    } catch (error) {
        res.status(500).json({ status: "error", message: error.message });
    }
};

// @desc    Refresh Token
// @route   POST /api/auth/refresh-token
exports.refreshToken = async (req, res) => {
    const refreshToken = req.cookies.refreshToken || req.body.refreshToken;

    if (!refreshToken) {
        return res.status(401).json({ status: "error", message: "No refresh token found" });
    }

    try {
        const decoded = jwt.verify(refreshToken, process.env.JWT_REFRESH_SECRET || 'refreshSecret123');

        const user = await User.findById(decoded.id);
        if (!user) {
            return res.status(401).json({ status: "error", message: "User not found" });
        }

        sendTokenResponse(user, 200, res); // Rotates tokens
    } catch (error) {
        return res.status(403).json({ status: "error", message: "Invalid refresh token" });
    }
};

// @desc    Send OTP
// @route   POST /api/auth/send-otp
exports.sendOtp = async (req, res) => {
    try {
        const { email } = req.body;
        if (!email) return res.status(400).json({ status: "error", message: "Email is required" });

        // Generate random 6 digit OTP
        const otp = crypto.randomInt(100000, 999999).toString();

        // Hash OTP
        const salt = await bcrypt.genSalt(10);
        const otpHash = await bcrypt.hash(otp, salt);

        // Create OTP Document
        await Otp.create({
            email: email.toLowerCase(),
            otpHash
        });

        // Send Email
        const message = `
      <div style="font-family: Arial, sans-serif; padding: 20px;">
        <h2>🔐 Your Security Code</h2>
        <p>Please use the following OTP to complete your verification:</p>
        <h1 style="color: #4CAF50; letter-spacing: 5px;">${otp}</h1>
        <p>This code is valid for <strong>5 minutes</strong>.</p>
        <p>If you didn't request this code, please ignore this email.</p>
      </div>
    `;

        await sendEmail({
            email: email,
            subject: 'Doltec OTP Verification',
            message
        });

        res.status(200).json({ status: "success", message: "OTP sent to email" });
    } catch (error) {
        console.error(error);
        res.status(500).json({ status: "error", message: "Email could not be sent" });
    }
};

// @desc    Verify OTP
// @route   POST /api/auth/verify-otp
exports.verifyOtp = async (req, res) => {
    try {
        const { email, otp } = req.body;

        if (!email || !otp) {
            return res.status(400).json({ status: "error", message: "Email and OTP are required" });
        }

        // Find the most recent OTP for this email
        const otpRecord = await Otp.findOne({ email: email.toLowerCase() }).sort({ createdAt: -1 });

        if (!otpRecord) {
            return res.status(400).json({ status: "error", message: "Invalid or expired OTP" });
        }

        const isMatch = await otpRecord.matchOtp(otp);

        if (!isMatch) {
            return res.status(400).json({ status: "error", message: "Invalid OTP CODE" });
        }

        // Determine what to do next? Usually this is part of 2FA or Password Reset.
        // For now, we just return success. If this was a login flow, we'd issue tokens here.

        // OPTIONAL: Delete used OTP to prevent replay
        await Otp.deleteOne({ _id: otpRecord._id });

        res.status(200).json({ status: "success", message: "OTP Verified Successfully" });
    } catch (error) {
        res.status(500).json({ status: "error", message: error.message });
    }
};

// @desc    Logout
// @route   POST /api/auth/logout
exports.logout = (req, res) => {
    res.cookie('accessToken', 'none', {
        expires: new Date(Date.now() + 10 * 1000),
        httpOnly: true,
    });
    res.cookie('refreshToken', 'none', {
        expires: new Date(Date.now() + 10 * 1000),
        httpOnly: true,
    });

    res.status(200).json({ status: "success", message: "Logged out successfully" });
};

// @desc    Session Heartbeat (Update Online Status)
// @route   POST /api/auth/heartbeat
exports.heartbeat = async (req, res) => {
    try {
        const UserSession = require('../models/UserSession');
        const userId = req.user._id;

        // Find or create session
        let session = await UserSession.findOne({ userId });

        if (session) {
            session.lastHeartbeat = Date.now();
            session.isActive = true;
            await session.save();
        } else {
            // Should usually be created on login, but lazy create here just in case
            await UserSession.create({
                userId,
                lastHeartbeat: Date.now(),
                ipAddress: req.ip,
                isActive: true
            });
        }

        res.status(200).json({ status: "success" });
    } catch (error) {
        // Silent fail for heartbeat, just log it
        console.error("Heartbeat Error:", error.message);
        res.status(500).json({ status: "error" });
    }
};
