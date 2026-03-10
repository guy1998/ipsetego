const express = require('express');
const app = express();
const userModule = require('../controllers/user-controller');
const bodyParser = require('body-parser');
const cookieParser = require('cookie-parser');
const authorize = require('../middlewares/authorization');
const { retrieveId } = require('../utils/jwt');
const multer = require('multer');

// Configure multer for memory storage
const storage = multer.memoryStorage();
const upload = multer({ storage });

app.use(bodyParser.json());
app.use(cookieParser());

app.get('/list', authorize('admin'), async (req, res) => {
    const { status, data } = await userModule.listUsers();
    res.status(status).json(data);
});

app.get('/retrieve/:id', authorize('admin'), async (req, res) => {
    const { status, data } = await userModule.getUser(req.params.id);
    res.status(status).json(data);
});

app.get('/profile', authorize(), async (req, res) => {
    const { status, data } = await userModule.getCurrentUser(req);
    res.status(status).json(data);
});

app.put('/:id/update', authorize('admin'), async (req, res) => {
    const { status, data } = await userModule.editUser(req.params.id, req.body);
    res.status(status).json(data);
});

app.put('/update/self', authorize(), async (req, res) => {
    const { status, data } = await userModule.editUser(retrieveId(req), req.body);
    res.status(status).json(data);
})

app.put('/:id/update-password', authorize(), async (req, res) => {
    const { oldPassword, newPassword } = req.body
    const { status, data } = await userModule.editPassword(req.params.id, oldPassword, newPassword);
    res.status(status).json(data);
});

app.put('/update-password/self', authorize(), async (req, res) => {
    const { oldPassword, newPassword } = req.body
    const { status, data } = await userModule.editPassword(retrieveId(req), oldPassword, newPassword);
    res.status(status).json(data);
});

app.delete('/delete/:id', authorize('admin'), async (req, res) => {
    const { status, data } = await userModule.deleteUser(req.params.id);
    res.status(status).json(data);
});

app.post('/create', (req, res, next) => authorize(req, res, next, 'admin'), async (req, res) => {
    const { status, data } = await userModule.createUser(req.body);
    res.status(status).json(data);
});

//TODO: remove this when hosting online
app.post('/create-dev', async (req, res) => {
    const { status, data } = await userModule.createUser(req.body);
    res.status(status).json(data);
});

app.post('/upload-profile-picture', authorize(), upload.single('profilePicture'), async (req, res) => {
    const file = req.file;
    if (!file) {
        return res.status(400).json({ success: false, message: 'No file uploaded' });
    }

    const userId = retrieveId(req);
    const { status, data } = await userModule.uploadProfilePicture(userId, file.buffer, file.originalname);
    res.status(status).json(data);
});

module.exports = app;