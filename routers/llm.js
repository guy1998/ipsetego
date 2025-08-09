const express = require('express');
const app = express();
const llmModule = require('../controllers/llm-interaction');
const bodyParser = require('body-parser');

app.use(bodyParser.json());


app.post('/query', async (req, res) => {
    const response = await llmModule.queryTheModel(req.body.prompt);
    res.status(200).json(response);
});

module.exports = app;