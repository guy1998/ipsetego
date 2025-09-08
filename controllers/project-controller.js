const { internalServerError, responseWithData, dataLessResponse } = require("../common/reused-responses");
const { User, Project } = require('../models');

const createProject = async (projectInfo) => {
    try {
        const user = await User.findByPk(userId);
        const newProject = user.createProject({ ...projectInfo });
        return responseWithData(200, "Project added successfully!", newProject);
    } catch (error) {
        return internalServerError();
    }
};

const editProject = async (projectId, newINfo) => {
    try {
        const editedProject = await Project.update(
            { ...newINfo },
            { where: { id: projectId }, returning: true }
        );
        return responseWithData(200, "Project edited successfully!", editedProject);
    } catch (error) {
        return internalServerError();
    }
};

const deleteProject = async (projectId) => {
    try {
        await Project.destroy({ where: { id: projectId } });
        return dataLessResponse(200, "Project deleted successfully!");
    } catch (error) {
        return internalServerError();
    }
};

const listProject = async (userId) => {
    try {
        const projects = await Project.findAll({
            where: { userId },
            order: [['date', 'DESC']]
        });
        return responseWithData(200, "Data retrieved!", projects);
    } catch (error) {
        return internalServerError();
    }
};

const getProject = async (projectId) => {
    try {
        const project = await Project.findByPk(projectId);
        return responseWithData(200, "Data retrieved!", project);
    } catch (error) {
        return internalServerError();
    }
};

module.exports = {
    createProject,
    editProject,
    deleteProject,
    listProject,
    getProject
}