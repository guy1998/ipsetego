const express = require('express');
const app = express();
const projectModule = require('../controllers/project-controller');
const bodyParser = require('body-parser');
const cookieParser = require('cookie-parser');
const authorize = require('../middlewares/authorization');
const { retrieveId } = require('../utils/jwt');

app.use(bodyParser.json());
app.use(cookieParser());

app.post('/new-project', authorize(), async (req, res) => {
    const { status, data } = await projectModule.createProject(req.body, retrieveId(req));
    res.status(status).json(data);
});

app.put('/update/:projectId', authorize(), async (req, res) => {
    const { status, data } = await projectModule.editProject(req.params.projectId, req.body);
    res.status(status).json(data);
});

app.get('/list', authorize(), async (req, res) => {
    const { status, data } = await projectModule.listProject(retrieveId(req));
    res.status(status).json(data);
});

app.get('/list-spec/:userId', async (req, res) => {
    const { status, data } = await projectModule.listProject(req.params.userId);
    res.status(status).json(data);
});

app.get('/project-item/:id', async (req, res) => {
    const { status, data } = await projectModule.getProject(req.params.id);
    res.status(status).json(data);
});

app.delete('/:id', authorize, async (req, res) => {
    const { status, data } = await projectModule.deleteProject(req.params.id);
    res.status(status).json(data);
});

module.exports = app;