const rateLimit = require('express-rate-limit');

// Login/admin-login: guards against password/whitelist brute-forcing.
const loginLimiter = rateLimit({
    windowMs: 15 * 60 * 1000,
    limit: 10,
    standardHeaders: true,
    legacyHeaders: false,
    message: { message: 'Too many attempts. Please try again later.' },
});

// OTP verification: 6-digit numeric codes have a small keyspace, so this
// needs to be tight enough to make brute-forcing impractical within the
// code's 10-minute TTL.
const otpLimiter = rateLimit({
    windowMs: 10 * 60 * 1000,
    limit: 10,
    standardHeaders: true,
    legacyHeaders: false,
    message: { message: 'Too many attempts. Please try again later.' },
});

// Registration: limits OTP-email spam / account-creation abuse.
const registerLimiter = rateLimit({
    windowMs: 60 * 60 * 1000,
    limit: 10,
    standardHeaders: true,
    legacyHeaders: false,
    message: { message: 'Too many attempts. Please try again later.' },
});

module.exports = { loginLimiter, otpLimiter, registerLimiter };
