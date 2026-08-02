const express = require('express');
const app = express();
const authModule = require('../controllers/auth-controller.js');
const bodyParser = require('body-parser');
const cookieParser = require('cookie-parser');
const authorize = require('../middlewares/authorization.js');
const { loginLimiter, otpLimiter, registerLimiter } = require('../middlewares/rate-limit');

app.use(bodyParser.json());

// Public self-signup can be turned off via .env (SIGNUPS_ENABLED=false) —
// e.g. for a single-user portfolio deployment that shouldn't accept new accounts.
const requireSignupsEnabled = (req, res, next) => {
    if (process.env.SIGNUPS_ENABLED === 'false') {
        return res.status(403).json({ message: 'Sign-ups are currently disabled.' });
    }
    next();
};

app.post('/login', loginLimiter, authModule.login);

app.post('/logout', authModule.logout);

app.post('/register', requireSignupsEnabled, registerLimiter, authModule.register);

app.post('/confirm', requireSignupsEnabled, otpLimiter, authModule.confirmRegistration);

app.get('/authorize', authorize(), (req, res) => res.status(200).json({ message: "Session valid!" }));

module.exports = app;