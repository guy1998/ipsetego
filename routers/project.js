const express = require('express');
const app = express();
const projectModule = require('../controllers/project-controller');
const bodyParser = require('body-parser');
const cookieParser = require('cookie-parser');
const authorize = require('../middlewares/authorization');
const { retrieveId } = require('../utils/jwt');
const multer = require('multer');

// Configure multer for memory storage
const storage = multer.memoryStorage();
const upload = multer({ storage });

app.use(bodyParser.json());

app.post('/new-project', authorize(), async (req, res) => {
    const { status, data } = await projectModule.createProject(req.body, retrieveId(req));
    res.status(status).json(data);
});

app.put('/update/:projectId', authorize(), async (req, res) => {
    const { status, data } = await projectModule.editProject(req.params.projectId, req.body);
    res.status(status).json(data);
});

app.post('/upload-image/:projectId', authorize(), upload.single('projectImage'), async (req, res) => {
    const file = req.file;
    if (!file) {
        return res.status(400).json({ success: false, message: 'No file uploaded' });
    }

    const { status, data } = await projectModule.uploadProjectImage(req.params.projectId, file.buffer, file.originalname);
    res.status(status).json(data);
});

app.post('/update-image/:projectId', authorize(), upload.single('projectImage'), async (req, res) => {
    const file = req.file;
    if (!file) {
        return res.status(400).json({ success: false, message: 'No file uploaded' });
    }

    const { status, data } = await projectModule.updateProjectImage(req.params.projectId, file.buffer, file.originalname);
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

app.get('/list-public/:publicId', async (req, res) => {
    const { status, data } = await projectModule.listProjectByPublicId(req.params.publicId);
    res.status(status).json(data);
});

app.get('/project-item/:id', async (req, res) => {
    const { status, data } = await projectModule.getProject(req.params.id);
    res.status(status).json(data);
});

app.delete('/:id', authorize(), async (req, res) => {
    const { status, data } = await projectModule.deleteProject(req.params.id);
    res.status(status).json(data);
});

module.exports = app;