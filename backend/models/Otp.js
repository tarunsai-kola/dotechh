const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const otpSchema = new mongoose.Schema({
    email: {
        type: String,
        required: true,
    },
    otpHash: {
        type: String,
        required: true,
    },
    createdAt: {
        type: Date,
        default: Date.now,
        expires: 300, // Document automatically removed after 300 seconds (5 minutes)
    },
});

// Method to verify OTP
otpSchema.methods.matchOtp = async function (enteredOtp) {
    return await bcrypt.compare(enteredOtp, this.otpHash);
};

module.exports = mongoose.model('Otp', otpSchema);
