const express = require('express');
const app = express();
const experienceModule = require('../controllers/experience-controller');
const bodyParser = require('body-parser');
const cookieParser = require('cookie-parser');
const authorize = require('../middlewares/authorization');
const { retrieveId } = require('../utils/jwt');

app.use(bodyParser.json());
app.use(cookieParser());

app.post('/new-experience', authorize, async (req, res) => {
    const { status, data } = await experienceModule.createExperience(retrieveId(req), req.body);
    res.status(status).json(data);
});

app.put('/update/:experienceId', authorize, async (req, res) => {
    const { status, data } = await experienceModule.editExperience(req.params.experienceId, req.body);
    res.status(status).json(data);
});

app.get('/list', authorize, async (req, res) => {
    const { status, data } = await experienceModule.listExperience(retrieveId(req));
    res.status(status).json(data);
});

app.get('/list-spec/:userId', async (req, res) => {
    const { status, data } = await experienceModule.listExperience(req.params.userId);
    res.status(status).json(data);
});

app.get('/experience-item/:id', async (req, res) => {
    const { status, data } = await experienceModule.getExperience(req.params.id);
    res.status(status).json(data);
});

app.delete('/:id', authorize, async (req, res) => {
    const { status, data } = await experienceModule.deleteExperience(req.params.id);
    res.status(status).json(data);
});

module.exports = app;