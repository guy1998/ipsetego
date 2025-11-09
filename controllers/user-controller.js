const NodeCache = require('node-cache');
const cache = new NodeCache({ stdTTL: 600 }); // Using 10 minutes as default ttl
const { internalServerError, dataLessResponse, responseWithData } = require('../common/reused-responses');
const { User } = require('../models');
const { retrieveId } = require('../utils/jwt');
const { sendOtp } = require('../utils/mailer');
const { generateOtp, sanitizeInput, passwordVerifier, passwordHasher } = require('../utils/security');
let uuidv4;
import('uuid').then(module => {
  uuidv4 = module.v4;
}).catch(err => {
  console.error('Failed to import uuid:', err);
});

const sanitizeData = (data) => {
    const sanitizedData = {};
    for (const key in data) {
        if (key === 'birthday') {
            sanitizedData[key] = data[key];
        } else {
            sanitizedData[key] = sanitizeInput(data[key]);
        }
    }
    return sanitizedData;
};

const storeData = (otp, data) => {
    cache.set(otp, data);
};

const checkUniqueness = async (email) => {
    try {
        const user = await User.findOne({ where: { email } });
        return user === null;
    } catch(error) {
        return false;
    }
};

const cacheUserForConfirmation = async (userData) => {
    try {
        const sanitizedData = sanitizeData(userData);
        const unique = await checkUniqueness(sanitizedData.email);
        if(!unique) {
            return dataLessResponse(400, "User with this email already exists!")
        }
        const personalSlug = `${userData.name}-${userData.lastname}-${uuidv4()}`;
        const otp = generateOtp();
        const emailResult = await sendOtp(sanitizedData.email, otp);
        if (emailResult) {
            storeData(otp, { ...sanitizedData, personalSlug });
            return dataLessResponse(200, "Email sent waiting for confirmation!")
        } else {
            return dataLessResponse(400, "Email couldn't be sent! Please check the email address!")
        }
    } catch (error) {
        return internalServerError();
    }
};

const retrieveCache = (otp) => {
    return cache.get(otp);
};

const createUser = async (userData) => {
    try {
        const newUser = await User.create(userData);
        return responseWithData(200, "User created successfully!", newUser);
    } catch (error) {
        console.log(error);
        return internalServerError()
    }
};

const editUser = async (userId, newData) => {
    try {
        if ("password" in newData) {
            delete newData.password;
        }
        const [updatedCount, updatedUsers] = await User.update(
            newData,
            { where: { id: userId }, returning: true }
        );
        return updatedCount ? responseWithData(200, "User updated successfully!", updatedUsers) : dataLessResponse(404, "User not found!");
    } catch (error) {
        return internalServerError()
    }
};

const editPassword = async (userId, oldPassword, newPassword) => {
    try {
        const user = await User.findOne({ where: { id: userId } });
        if (!user) {
            return dataLessResponse(404, "User not found!");
        } else if (!passwordVerifier(oldPassword, user.password)) {
            return dataLessResponse(400, "The current password does not match!");
        } else if (oldPassword === newPassword) {
            return dataLessResponse(400, "New password cannot be the same as old password!");
        }
        const updatedUsers = await User.update(
            { password: passwordHasher(newPassword) },
            { where: { id: userId }, returning: true }
        );
        return responseWithData(200, "User updated successfully!", updatedUsers);
    } catch (error) {
        return internalServerError()
    }
};

const deleteUser = async (userId) => {
    try {
        await User.destroy({ where: { id: userId } });
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
        const user = await User.findOne({ where: { id: userId } });
        return responseWithData(200, "User retrieved!", user);
    } catch (error) {
        return internalServerError()
    }
};

const getCurrentUser = async (req) => {
    try {
        const userId = retrieveId(req);
        const user = await User.findOne({ where: { id: userId } });
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
    getCurrentUser,
    cacheUserForConfirmation,
    retrieveCache
}