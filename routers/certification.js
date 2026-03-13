const express = require('express');
const app = express();
const certificationModule = require('../controllers/certification-controller');
const bodyParser = require('body-parser');
const authorize = require('../middlewares/authorization');
const { retrieveId } = require('../utils/jwt');

app.use(bodyParser.json());

app.post('/new-certification', authorize(), async (req, res) => {
    const { status, data } = await certificationModule.createCertification(retrieveId(req), req.body);
    res.status(status).json(data);
});

app.put('/update/:certificationId', authorize(), async (req, res) => {
    const { status, data } = await certificationModule.editCertification(req.params.certificationId, req.body);
    res.status(status).json(data);
});

app.get('/list', authorize(), async (req, res) => {
    const { status, data } = await certificationModule.listCertifications(retrieveId(req));
    res.status(status).json(data);
});

app.get('/list-public/:publicId', async (req, res) => {
    const { status, data } = await certificationModule.listCertificationsByPublicId(req.params.publicId);
    res.status(status).json(data);
});

app.get('/certification-item/:id', async (req, res) => {
    const { status, data } = await certificationModule.getCertification(req.params.id);
    res.status(status).json(data);
});

app.delete('/:id', authorize(), async (req, res) => {
    const { status, data } = await certificationModule.deleteCertification(req.params.id);
    res.status(status).json(data);
});

module.exports = app;
