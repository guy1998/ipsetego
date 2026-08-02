const { internalServerError, responseWithData, dataLessResponse } = require("../common/reused-responses");
const { User, Experience } = require('../models');

const listExperienceByPublicId = async (publicId) => {
    try {
        const user = await User.findOne({ where: { publicId } });
        if (!user) {
            return dataLessResponse(404, "Portfolio not found!");
        }
        const experiences = await Experience.findAll({
            where: { userId: user.id, isFeatured: true },
            order: [['createdAt', 'DESC']]
        });
        return responseWithData(200, "Data retrieved!", experiences);
    } catch (error) {
        return internalServerError();
    }
};

const createExperience = async (userId, experienceInfo) => {
    try {
        const user = await User.findByPk(userId);
        const newExperience = user.createExperience({ ...experienceInfo });
        return responseWithData(200, "Experience added successfully!", newExperience);
    } catch (error) {
        return internalServerError();
    }
};

const editExperience = async (experienceId, newInfo, requestingUserId) => {
    try {
        const experience = await Experience.findByPk(experienceId);
        if (!experience) return dataLessResponse(404, "Experience not found!");
        if (String(experience.userId) !== String(requestingUserId)) {
            return dataLessResponse(403, "You do not have permission to modify this experience!");
        }
        experience.set(newInfo);
        await experience.save();
        return responseWithData(200, "Experience edited successfully!", experience);
    } catch (error) {
        return internalServerError();
    }
};

const deleteExperience = async (experienceId, requestingUserId) => {
    try {
        const experience = await Experience.findByPk(experienceId);
        if (!experience) return dataLessResponse(404, "Experience not found!");
        if (String(experience.userId) !== String(requestingUserId)) {
            return dataLessResponse(403, "You do not have permission to delete this experience!");
        }
        await experience.destroy();
        return dataLessResponse(200, "Experience deleted successfully!");
    } catch (error) {
        return internalServerError();
    }
};

const listExperience = async (userId) => {
    try {
        const experiences = await Experience.findAll({
            where: { userId },
            order: [['createdAt', 'DESC']]
        });
        return responseWithData(200, "Data retrieved!", experiences);
    } catch (error) {
        return internalServerError();
    }
};

const getExperience = async (experienceId) => {
    try {
        const experience = await Experience.findByPk(experienceId);
        return responseWithData(200, "Data retrieved!", experience);
    } catch (error) {
        return internalServerError();
    }
};

module.exports = {
    createExperience,
    editExperience,
    deleteExperience,
    listExperience,
    listExperienceByPublicId,
    getExperience
}