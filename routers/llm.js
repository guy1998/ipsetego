const express = require('express');
const app = express();
const llmModule = require('../controllers/llm-interaction');
const bodyParser = require('body-parser');

app.use(bodyParser.json());


app.post('/query', async (req, res) => {
    try {
        const { userId, prompt } = req.body;
        
        if (!userId) {
            return res.status(400).json({ error: 'userId is required' });
        }
        
        if (!prompt) {
            return res.status(400).json({ error: 'prompt is required' });
        }
        
        const response = await llmModule.queryModelAsUser(userId, prompt);
        res.status(200).json(response);
    } catch (error) {
        console.error('Error in /query route:', error.message);
        res.status(500).json({ error: error.message });
    }
});

module.exports = app;