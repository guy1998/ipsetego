const NodeCache = require('node-cache');
const cache = new NodeCache({ stdTTL: 600 }); // Using 10 minutes as default ttl
const { internalServerError, dataLessResponse, responseWithData } = require('../common/reused-responses');
const { User } = require('../models');
const { retrieveId } = require('../utils/jwt');
const { sendOtp, sendContactEmail, sendDataRequestEmail, sendAccountDeletionEmail } = require('../utils/mailer');
const { PassThrough } = require('stream');
const { generateOtp, sanitizeInput, passwordVerifier, passwordHasher } = require('../utils/security');
const { encryptDeterministic } = require('../utils/encryption');
const { uploadFile, deleteFile, getPrivateFile } = require('../utils/supabase');
const jwt = require('jsonwebtoken');
const archiver = require('archiver');
const { Project, Experience, Certification } = require('../models');
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
        const user = await User.findOne({ where: { email: encryptDeterministic(email) } });
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
        const publicId = uuidv4();
        const personalSlug = `${userData.name}-${userData.lastname}-${publicId}`;
        const otp = generateOtp();
        const emailResult = await sendOtp(sanitizedData.email, otp);
        if (emailResult) {
            storeData(otp, { ...sanitizedData, personalSlug, publicId, role: 'user' });
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
        const user = await User.findByPk(userId);
        if (!user) return dataLessResponse(404, "User not found!");
        user.set(newData); // triggers setters so all sensitive fields are encrypted
        await user.save();
        return responseWithData(200, "User updated successfully!", user);
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

const getUserByPublicId = async (publicId) => {
    try {
        const user = await User.findOne({
            where: { publicId },
            attributes: ['name', 'lastname', 'email', 'personalSlug', 'publicId', 'pictureId', 'resumeId', 'linkedin', 'github', 'xing', 'twitter', 'instagram', 'youtube', 'tiktok', 'skills', 'languages', 'hobbies']
        });
        if (!user) {
            return dataLessResponse(404, "Portfolio not found!");
        }
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

const uploadProfilePicture = async (userId, fileBuffer, fileName) => {
    try {
        const BUCKET_NAME = process.env.SUPABASE_BUCKET_NAME;
        const user = await User.findOne({ where: { id: userId } });
        if (!user) {
            return dataLessResponse(404, "User not found!");
        }

        // Delete old profile picture if it exists
        if (user.pictureId) {
            try {
                await deleteFile(BUCKET_NAME, user.pictureId);
            } catch (error) {
                console.log(`Warning: Could not delete old profile picture: ${error.message}`);
            }
        }

        // Generate new file path
        const fileExtension = fileName.split('.').pop();
        const newPictureId = `${userId}-${Date.now()}.${fileExtension}`;

        // Upload new profile picture
        await uploadFile(BUCKET_NAME, newPictureId, fileBuffer, `image/${fileExtension}`);

        // Update user's pictureId
        const [updatedCount, updatedUsers] = await User.update(
            { pictureId: newPictureId },
            { where: { id: userId }, returning: true }
        );

        return updatedCount 
            ? responseWithData(200, "Profile picture uploaded successfully!", { pictureId: newPictureId, user: updatedUsers[0] })
            : dataLessResponse(404, "User not found!");
    } catch (error) {
        console.log(error);
        return internalServerError();
    }
};

const uploadCV = async (userId, fileBuffer, fileName) => {
    try {
        const BUCKET_NAME = process.env.SUPABASE_BUCKET_NAME;
        const user = await User.findOne({ where: { id: userId } });
        if (!user) {
            return dataLessResponse(404, "User not found!");
        }

        // Delete old CV if it exists
        if (user.resumeId) {
            try {
                await deleteFile(BUCKET_NAME, user.resumeId);
            } catch (error) {
                console.log(`Warning: Could not delete old CV: ${error.message}`);
            }
        }

        // Generate new file path
        const fileExtension = fileName.split('.').pop().toLowerCase();
        const newResumeId = `cv-${userId}-${Date.now()}.${fileExtension}`;
        const contentType = fileExtension === 'pdf' ? 'application/pdf' : `image/${fileExtension}`;

        // Upload new CV
        await uploadFile(BUCKET_NAME, newResumeId, fileBuffer, contentType);

        // Update user's resumeId
        const [updatedCount, updatedUsers] = await User.update(
            { resumeId: newResumeId },
            { where: { id: userId }, returning: true }
        );

        return updatedCount
            ? responseWithData(200, "CV uploaded successfully!", { resumeId: newResumeId, user: updatedUsers[0] })
            : dataLessResponse(404, "User not found!");
    } catch (error) {
        console.log(error);
        return internalServerError();
    }
};

const contactUser = async (publicId, fromName, fromSurname, fromEmail, subject, content) => {
    try {
        const user = await User.findOne({ where: { publicId }, attributes: ['email'] });
        if (!user) {
            return dataLessResponse(404, "Portfolio not found!");
        }
        const sent = await sendContactEmail(user.email, fromName, fromSurname, fromEmail, subject, content);
        if (!sent) {
            return dataLessResponse(500, "Failed to send message. Please try again later.");
        }
        return dataLessResponse(200, "Message sent successfully!");
    } catch (error) {
        return internalServerError();
    }
};

const requestUserData = async (req) => {
    try {
        const userId = retrieveId(req);
        const user = await User.findOne({ where: { id: userId } });
        if (!user) return dataLessResponse(404, "User not found!");

        const token = jwt.sign(
            { userId, type: 'data-download' },
            process.env.JWT_KEY,
            { expiresIn: '24h' }
        );

        const backendUrl = process.env.BACKEND_URL || 'http://localhost:1989';
        const downloadLink = `${backendUrl}/user/download-data/${token}`;

        const sent = await sendDataRequestEmail(user.email, downloadLink);
        if (!sent) return dataLessResponse(500, "Failed to send email. Please try again later.");

        return dataLessResponse(200, "Data request email sent! Check your inbox.");
    } catch (error) {
        return internalServerError();
    }
};

const downloadUserData = async (token, res) => {
    try {
        let payload;
        try {
            payload = jwt.verify(token, process.env.JWT_KEY);
        } catch {
            return res.status(401).json({ message: "Invalid or expired download link." });
        }

        if (payload.type !== 'data-download') {
            return res.status(401).json({ message: "Invalid token type." });
        }

        const userId = payload.userId;
        const BUCKET = process.env.SUPABASE_BUCKET_NAME;

        const [user, projects, experiences, certifications] = await Promise.all([
            User.findOne({ where: { id: userId } }),
            Project.findAll({ where: { userId } }),
            Experience.findAll({ where: { userId } }),
            Certification.findAll({ where: { userId } }),
        ]);

        if (!user) return res.status(404).json({ message: "User not found." });

        const profileData = {
            name: user.name,
            lastname: user.lastname,
            email: user.email,
            phoneNumber: user.phoneNumber,
            address: user.address,
            birthday: user.birthday,
            linkedin: user.linkedin,
            github: user.github,
            xing: user.xing,
            twitter: user.twitter,
            instagram: user.instagram,
            youtube: user.youtube,
            tiktok: user.tiktok,
            hobbies: user.hobbies,
            languages: user.languages,
            skills: user.skills,
            personalSlug: user.personalSlug,
            createdAt: user.createdAt,
            updatedAt: user.updatedAt,
        };

        res.setHeader('Content-Type', 'application/zip');
        res.setHeader('Content-Disposition', 'attachment; filename="my-ipsetego-data.zip"');

        const archive = archiver('zip', { zlib: { level: 6 } });
        archive.pipe(res);

        archive.append(JSON.stringify(profileData, null, 2), { name: 'profile.json' });
        archive.append(JSON.stringify(projects.map(p => p.toJSON()), null, 2), { name: 'projects.json' });
        archive.append(JSON.stringify(experiences.map(e => e.toJSON()), null, 2), { name: 'experiences.json' });
        archive.append(JSON.stringify(certifications.map(c => c.toJSON()), null, 2), { name: 'certifications.json' });

        for (const project of projects) {
            if (project.imageId) {
                try {
                    const imgBuffer = await getPrivateFile(BUCKET, project.imageId);
                    const ext = project.imageId.split('.').pop() || 'jpg';
                    const safeName = (project.title || `project-${project.id}`).replace(/[^a-z0-9]/gi, '-').toLowerCase();
                    archive.append(imgBuffer, { name: `project-images/${safeName}.${ext}` });
                } catch (err) {
                    console.log(`Warning: Could not include image for project ${project.id}: ${err.message}`);
                }
            }
        }

        if (user.pictureId) {
            try {
                const picBuffer = await getPrivateFile(BUCKET, user.pictureId);
                const ext = user.pictureId.split('.').pop() || 'jpg';
                archive.append(picBuffer, { name: `profile-picture.${ext}` });
            } catch (err) {
                console.log(`Warning: Could not include profile picture: ${err.message}`);
            }
        }

        if (user.resumeId) {
            try {
                const cvBuffer = await getPrivateFile(BUCKET, user.resumeId);
                const ext = user.resumeId.split('.').pop() || 'pdf';
                archive.append(cvBuffer, { name: `cv.${ext}` });
            } catch (err) {
                console.log(`Warning: Could not include CV: ${err.message}`);
            }
        }

        await archive.finalize();
    } catch (error) {
        console.log(error);
        if (!res.headersSent) {
            res.status(500).json({ message: "Failed to generate data export." });
        }
    }
};

const deleteOwnAccount = async (req) => {
    try {
        const userId = retrieveId(req);
        const BUCKET = process.env.SUPABASE_BUCKET_NAME;

        const [user, projects, experiences, certifications] = await Promise.all([
            User.findOne({ where: { id: userId } }),
            Project.findAll({ where: { userId } }),
            Experience.findAll({ where: { userId } }),
            Certification.findAll({ where: { userId } }),
        ]);

        if (!user) return dataLessResponse(404, "User not found!");

        // Build ZIP in memory
        const archive = archiver('zip', { zlib: { level: 6 } });
        const passThrough = new PassThrough();
        const chunks = [];
        passThrough.on('data', (chunk) => chunks.push(chunk));

        const zipReady = new Promise((resolve, reject) => {
            passThrough.on('end', resolve);
            passThrough.on('error', reject);
        });

        archive.pipe(passThrough);

        const profileData = {
            name: user.name,
            lastname: user.lastname,
            email: user.email,
            phoneNumber: user.phoneNumber,
            address: user.address,
            birthday: user.birthday,
            linkedin: user.linkedin,
            github: user.github,
            xing: user.xing,
            twitter: user.twitter,
            instagram: user.instagram,
            youtube: user.youtube,
            tiktok: user.tiktok,
            hobbies: user.hobbies,
            languages: user.languages,
            skills: user.skills,
            personalSlug: user.personalSlug,
            createdAt: user.createdAt,
            updatedAt: user.updatedAt,
        };

        archive.append(JSON.stringify(profileData, null, 2), { name: 'profile.json' });
        archive.append(JSON.stringify(projects.map(p => p.toJSON()), null, 2), { name: 'projects.json' });
        archive.append(JSON.stringify(experiences.map(e => e.toJSON()), null, 2), { name: 'experiences.json' });
        archive.append(JSON.stringify(certifications.map(c => c.toJSON()), null, 2), { name: 'certifications.json' });

        for (const project of projects) {
            if (project.imageId) {
                try {
                    const imgBuffer = await getPrivateFile(BUCKET, project.imageId);
                    const ext = project.imageId.split('.').pop() || 'jpg';
                    const safeName = (project.title || `project-${project.id}`).replace(/[^a-z0-9]/gi, '-').toLowerCase();
                    archive.append(imgBuffer, { name: `project-images/${safeName}.${ext}` });
                } catch (err) {
                    console.log(`Warning: Could not include image for project ${project.id}: ${err.message}`);
                }
            }
        }

        if (user.pictureId) {
            try {
                const picBuffer = await getPrivateFile(BUCKET, user.pictureId);
                const ext = user.pictureId.split('.').pop() || 'jpg';
                archive.append(picBuffer, { name: `profile-picture.${ext}` });
            } catch (err) {
                console.log(`Warning: Could not include profile picture: ${err.message}`);
            }
        }

        if (user.resumeId) {
            try {
                const cvBuffer = await getPrivateFile(BUCKET, user.resumeId);
                const ext = user.resumeId.split('.').pop() || 'pdf';
                archive.append(cvBuffer, { name: `cv.${ext}` });
            } catch (err) {
                console.log(`Warning: Could not include CV: ${err.message}`);
            }
        }

        await archive.finalize();
        await zipReady;

        const zipBuffer = Buffer.concat(chunks);

        // Send data to user before deleting
        const sent = await sendAccountDeletionEmail(user.email, zipBuffer);
        if (!sent) return dataLessResponse(500, "Failed to send data email. Account was not deleted.");

        // Delete all files from Supabase storage
        for (const project of projects) {
            if (project.imageId) {
                try { await deleteFile(BUCKET, project.imageId); } catch (err) {
                    console.log(`Warning: Could not delete project image ${project.imageId}: ${err.message}`);
                }
            }
        }

        if (user.pictureId) {
            try { await deleteFile(BUCKET, user.pictureId); } catch (err) {
                console.log(`Warning: Could not delete profile picture: ${err.message}`);
            }
        }

        if (user.resumeId) {
            try { await deleteFile(BUCKET, user.resumeId); } catch (err) {
                console.log(`Warning: Could not delete CV: ${err.message}`);
            }
        }

        // Delete all database records
        await User.destroy({ where: { id: userId } });

        return dataLessResponse(200, "Account permanently deleted. Your data has been sent to your email.");
    } catch (error) {
        console.log(error);
        return internalServerError();
    }
};

module.exports = {
    createUser,
    editPassword,
    editUser,
    deleteUser,
    deleteOwnAccount,
    listUsers,
    getUser,
    getUserByPublicId,
    getCurrentUser,
    uploadProfilePicture,
    uploadCV,
    cacheUserForConfirmation,
    retrieveCache,
    contactUser,
    requestUserData,
    downloadUserData,
}