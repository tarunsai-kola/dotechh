const jwt = require('jsonwebtoken');

const generateAccessAndRefreshTokens = (userId) => {
    const accessToken = jwt.sign(
        { id: userId },
        process.env.JWT_SECRET || 'secret123',
        { expiresIn: '15m' }
    );

    const refreshToken = jwt.sign(
        { id: userId },
        process.env.JWT_REFRESH_SECRET || 'refreshSecret123',
        { expiresIn: '7d' }
    );

    return { accessToken, refreshToken };
};

module.exports = generateAccessAndRefreshTokens;
