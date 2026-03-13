const express = require('express');
const app = express();
const authModule = require('../controllers/auth-controller.js');
const bodyParser = require('body-parser');
const cookieParser = require('cookie-parser');
const authorize = require('../middlewares/authorization.js');

app.use(bodyParser.json());

app.post('/login', authModule.login);

app.post('/logout', authModule.logout);

app.post('/register', authModule.register);

app.post('/confirm', authModule.confirmRegistration);

app.get('/authorize', authorize(), (req, res) => res.status(200).json({ message: "Session valid!" }));

module.exports = app;