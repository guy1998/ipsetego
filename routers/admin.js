const express = require('express');
const app = express();
const bodyParser = require('body-parser');
const adminAuthModule = require('../controllers/admin-auth-controller');
const adminModule = require('../controllers/admin-controller');
const adminAuthorize = require('../middlewares/admin-authorization');
const { loginLimiter, otpLimiter } = require('../middlewares/rate-limit');

app.use(bodyParser.json());

// Auth routes (no middleware)
app.post('/login', loginLimiter, adminAuthModule.adminLogin);
app.post('/verify-otp', otpLimiter, adminAuthModule.verifyAdminOtp);
app.post('/logout', adminAuthModule.adminLogout);
app.get('/authorize', adminAuthorize(), (req, res) => res.status(200).json({ message: 'Session valid!' }));

// Admin-only routes
app.get('/users', adminAuthorize(), adminModule.getUsers);
app.get('/users/:id', adminAuthorize(), adminModule.getUserById);
app.put('/users/:id/ban', adminAuthorize(), adminModule.banUser);
app.get('/users/:id/interactions', adminAuthorize(), adminModule.getUserInteractions);

module.exports = app;
