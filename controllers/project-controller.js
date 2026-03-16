const { internalServerError, responseWithData, dataLessResponse } = require("../common/reused-responses");
const { User, Project } = require('../models');
const { uploadFile, deleteFile } = require('../utils/supabase');

const listProjectByPublicId = async (publicId) => {
    try {
        const user = await User.findOne({ where: { publicId } });
        if (!user) {
            return dataLessResponse(404, "Portfolio not found!");
        }
        const projects = await Project.findAll({ where: { userId: user.id, isFeatured: true } });
        return responseWithData(200, "Data retrieved!", projects);
    } catch (error) {
        return internalServerError();
    }
};

const createProject = async (projectInfo, userId) => {
    try {
        const user = await User.findByPk(userId);
        const newProject = await user.createProject({ ...projectInfo });
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
        const project = await Project.findByPk(projectId);
        if (!project) {
            return dataLessResponse(404, "Project not found!");
        }
        if (project.imageId) {
            try {
                await deleteFile(process.env.SUPABASE_BUCKET_NAME, project.imageId);
            } catch (error) {
                console.log(`Warning: Could not delete old project image: ${error.message}`);
            }
        }
        await Project.destroy({ where: { id: projectId } });
        return dataLessResponse(200, "Project deleted successfully!");
    } catch (error) {
        return internalServerError();
    }
};

const listProject = async (userId) => {
    try {
        const projects = await Project.findAll({
            where: { userId }
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

const uploadProjectImage = async (projectId, fileBuffer, fileName) => {
    try {
        const BUCKET_NAME = process.env.SUPABASE_BUCKET_NAME;
        const project = await Project.findByPk(projectId);
        if (!project) {
            return dataLessResponse(404, "Project not found!");
        }

        // Delete old project image if it exists
        if (project.imageId) {
            try {
                await deleteFile(BUCKET_NAME, project.imageId);
            } catch (error) {
                console.log(`Warning: Could not delete old project image: ${error.message}`);
            }
        }

        // Generate new file path
        const fileExtension = fileName.split('.').pop();
        const newImageId = `projects-${projectId}-${Date.now()}.${fileExtension}`;

        // Upload new project image
        await uploadFile(BUCKET_NAME, newImageId, fileBuffer, `image/${fileExtension}`);

        // Update project's imageId
        const [updatedCount, updatedProjects] = await Project.update(
            { imageId: newImageId },
            { where: { id: projectId }, returning: true }
        );

        return updatedCount 
            ? responseWithData(200, "Project image uploaded successfully!", { imageId: newImageId, project: updatedProjects[0] })
            : dataLessResponse(404, "Project not found!");
    } catch (error) {
        console.log(error);
        return internalServerError();
    }
};

const updateProjectImage = async (projectId, fileBuffer, fileName) => {
    try {
        const BUCKET_NAME = process.env.SUPABASE_BUCKET_NAME;
        const project = await Project.findByPk(projectId);
        if (!project) {
            return dataLessResponse(404, "Project not found!");
        }

        // Delete old project image if it exists
        if (project.imageId) {
            try {
                await deleteFile(BUCKET_NAME, project.imageId);
            } catch (error) {
                console.log(`Warning: Could not delete old project image: ${error.message}`);
            }
        }

        // Generate new file path
        const fileExtension = fileName.split('.').pop();
        const newImageId = `projects-${projectId}-${Date.now()}.${fileExtension}`;

        // Upload new project image
        await uploadFile(BUCKET_NAME, newImageId, fileBuffer, `image/${fileExtension}`);

        // Update project's imageId
        const [updatedCount, updatedProjects] = await Project.update(
            { imageId: newImageId },
            { where: { id: projectId }, returning: true }
        );

        return updatedCount 
            ? responseWithData(200, "Project image updated successfully!", { imageId: newImageId, project: updatedProjects[0] })
            : dataLessResponse(404, "Project not found!");
    } catch (error) {
        console.log(error);
        return internalServerError();
    }
};

module.exports = {
    createProject,
    editProject,
    deleteProject,
    listProject,
    listProjectByPublicId,
    getProject,
    uploadProjectImage,
    updateProjectImage
}