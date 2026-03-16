const { internalServerError, responseWithData, dataLessResponse } = require("../common/reused-responses");
const { User, Certification } = require('../models');

const listCertificationsByPublicId = async (publicId) => {
    try {
        const user = await User.findOne({ where: { publicId } });
        if (!user) {
            return dataLessResponse(404, "Portfolio not found!");
        }
        const certifications = await Certification.findAll({
            where: { userId: user.id },
            order: [['year', 'DESC']]
        });
        return responseWithData(200, "Data retrieved!", certifications);
    } catch (error) {
        return internalServerError();
    }
};

const createCertification = async (userId, certificationInfo) => {
    try {
        const user = await User.findByPk(userId);
        const newCertification = await user.createCertification({ ...certificationInfo });
        return responseWithData(200, "Certification added successfully!", newCertification);
    } catch (error) {
        return internalServerError();
    }
};

const editCertification = async (certificationId, newInfo) => {
    try {
        const certification = await Certification.findByPk(certificationId);
        if (!certification) return dataLessResponse(404, "Certification not found!");
        certification.set(newInfo);
        await certification.save();
        return responseWithData(200, "Certification edited successfully!", certification);
    } catch (error) {
        return internalServerError();
    }
};

const deleteCertification = async (certificationId) => {
    try {
        await Certification.destroy({ where: { id: certificationId } });
        return dataLessResponse(200, "Certification deleted successfully!");
    } catch (error) {
        return internalServerError();
    }
};

const listCertifications = async (userId) => {
    try {
        const certifications = await Certification.findAll({
            where: { userId },
            order: [['year', 'DESC']]
        });
        return responseWithData(200, "Data retrieved!", certifications);
    } catch (error) {
        return internalServerError();
    }
};

const getCertification = async (certificationId) => {
    try {
        const certification = await Certification.findByPk(certificationId);
        return responseWithData(200, "Data retrieved!", certification);
    } catch (error) {
        return internalServerError();
    }
};

module.exports = {
    createCertification,
    editCertification,
    deleteCertification,
    listCertifications,
    listCertificationsByPublicId,
    getCertification
};
