const express = require('express');
const app = express();
const bodyParser = require('body-parser');
const newsletterModule = require('../controllers/newsletter-controller');

app.use(bodyParser.json());

app.post('/subscribe', newsletterModule.subscribe);

module.exports = app;
