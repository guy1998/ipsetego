const express = require('express');
const app = express();
const llmModule = require('../controllers/llm-interaction');
const bodyParser = require('body-parser');

app.use(bodyParser.json());

app.post('/query', async (req, res) => {
    try {
        const { publicId, prompt } = req.body;

        if (!publicId) {
            return res.status(400).json({ error: 'publicId is required' });
        }

        if (!prompt) {
            return res.status(400).json({ error: 'prompt is required' });
        }

        const ip =
            (req.headers['x-forwarded-for'] || '').split(',')[0].trim() ||
            req.socket.remoteAddress ||
            'unknown';

        await llmModule.streamModelAsUser(publicId, prompt, ip, res);
    } catch (error) {
        console.error('Error in /query route:', error.message);
        if (!res.headersSent) {
            res.status(500).json({ error: error.message });
        } else {
            res.write(`data: ${JSON.stringify({ error: error.message })}\n\n`);
            res.end();
        }
    }
});

module.exports = app;
