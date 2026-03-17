const NodeCache = require('node-cache');
const adminOtpCache = new NodeCache({ stdTTL: 600 }); // 10-minute TTL
const { sendOtp, sendAdminAlert } = require('../utils/mailer');
const { generateOtp } = require('../utils/security');
const { tokenIssuing } = require('../utils/jwt');
require('dotenv').config();

const getAdminWhitelist = () => {
    const raw = process.env.ADMIN_WHITELIST || '';
    return raw.split(',').map(e => e.trim().toLowerCase()).filter(Boolean);
};

const adminLogin = async (req, res) => {
    try {
        const { email } = req.body;
        if (!email) {
            return res.status(400).json({ message: 'Email is required!' });
        }

        const normalizedEmail = email.trim().toLowerCase();
        const whitelist = getAdminWhitelist();

        if (!whitelist.includes(normalizedEmail)) {
            // Alert all admins about unauthorized attempt
            await sendAdminAlert(whitelist, email);
            return res.status(403).json({ message: 'Access denied. This incident has been reported.' });
        }

        const otp = generateOtp();
        adminOtpCache.set(otp, normalizedEmail);
        const sent = await sendOtp(normalizedEmail, otp);

        if (!sent) {
            return res.status(500).json({ message: 'Failed to send OTP. Please try again.' });
        }

        return res.status(200).json({ message: 'OTP sent to your email.' });
    } catch (error) {
        console.error(error);
        return res.status(503).json({ message: 'Internal server error!' });
    }
};

const verifyAdminOtp = async (req, res) => {
    try {
        const { otp } = req.body;
        if (!otp) {
            return res.status(400).json({ message: 'OTP is required!' });
        }

        const email = adminOtpCache.get(otp);
        if (!email) {
            return res.status(401).json({ message: 'Invalid or expired OTP!' });
        }

        adminOtpCache.del(otp);

        const tokenObj = tokenIssuing({ adminEmail: email, role: 'admin' });
        res.cookie('adminTokenCookie', { ...tokenObj }, {
            maxAge: 3600000,
            httpOnly: true,
            secure: true,
            sameSite: 'none',
        });

        return res.status(200).json({ message: 'Authentication successful!' });
    } catch (error) {
        console.error(error);
        return res.status(503).json({ message: 'Internal server error!' });
    }
};

const adminLogout = (req, res) => {
    res.cookie('adminTokenCookie', '', {
        expires: new Date(0),
        httpOnly: true,
        secure: true,
        sameSite: 'none',
    });
    return res.status(200).json({ message: 'Logged out successfully.' });
};

module.exports = {
    adminLogin,
    verifyAdminOtp,
    adminLogout,
};
