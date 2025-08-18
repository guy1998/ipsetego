const { internalServerError, dataLessResponse, responseWithData } = require('../common/reused-responses');
const { User } = require('../models');
const { retrieveId } = require('../utils/jwt');
const { passwordHasher } = require('../utils/security');

const createUser = async (userData) => {
    try {

    } catch (error) {
        return internalServerError()
    }
};

const editUser = async (userId, newData) => {
    try {

    } catch (error) {
        return internalServerError()
    }
};

const editPassword = async (userId, oldPassword, newPassword) => {
    try {

    } catch (error) {
        return internalServerError()
    }
};

const deleteUser = async (userId) => {
    try {
        await User.destroy({ where: { id: userId }});
        return dataLessResponse(200, "User deleted successfully!");
    } catch (error) {
        return internalServerError()
    }
};

const listUsers = async () => {
    try {
        const users = await User.findAll();
        return responseWithData(200, "Users retrieved!", users);
    } catch (error) {
        return internalServerError()
    }
};

const getUser = async (userId) => {
    try {
        const user = await User.findOne({ where: { id: userId }});
        return responseWithData(200, "User retrieved!", user);
    } catch (error) {
        return internalServerError()
    }
};

const getCurrentUser = async (req) => {
    try {
        const userId = retrieveId(req);
        const user = await User.findOne({ where: { id: userId }});
        return responseWithData(200, "User retrieved!", user);
    } catch (error) {
        return internalServerError()
    }
};

module.exports = {
    createUser,
    editPassword,
    editUser,
    deleteUser,
    listUsers,
    getUser,
    getCurrentUser
}