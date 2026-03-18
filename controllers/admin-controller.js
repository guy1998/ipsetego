const { User, ModelInteraction } = require('../models');
const { internalServerError, dataLessResponse, responseWithData } = require('../common/reused-responses');

const getUsers = async (req, res) => {
    try {
        const page = Math.max(1, parseInt(req.query.page) || 1);
        const limit = Math.min(100, Math.max(1, parseInt(req.query.limit) || 10));
        const offset = (page - 1) * limit;

        const { count, rows } = await User.findAndCountAll({
            attributes: ['id', 'name', 'lastname', 'email', 'role', 'isActive', 'personalSlug', 'publicId', 'pictureId', 'createdAt'],
            limit,
            offset,
            order: [['createdAt', 'DESC']],
        });

        return res.status(200).json({
            message: 'Users retrieved!',
            data: {
                total: count,
                page,
                limit,
                totalPages: Math.ceil(count / limit),
                users: rows,
            },
        });
    } catch (error) {
        console.error(error);
        return res.status(503).json({ message: 'Internal server error!' });
    }
};

const getUserById = async (req, res) => {
    try {
        const { id } = req.params;
        const user = await User.findByPk(id, {
            attributes: { exclude: ['password'] },
        });

        if (!user) {
            return res.status(404).json({ message: 'User not found!' });
        }

        return res.status(200).json({ message: 'User retrieved!', data: user });
    } catch (error) {
        console.error(error);
        return res.status(503).json({ message: 'Internal server error!' });
    }
};

const banUser = async (req, res) => {
    try {
        const { id } = req.params;
        const user = await User.findByPk(id);

        if (!user) {
            return res.status(404).json({ message: 'User not found!' });
        }

        await user.update({ isActive: !user.isActive });

        const action = user.isActive ? 'unbanned' : 'banned';
        return res.status(200).json({ message: `User ${action} successfully.`, data: { isActive: user.isActive } });
    } catch (error) {
        console.error(error);
        return res.status(503).json({ message: 'Internal server error!' });
    }
};

const getUserInteractions = async (req, res) => {
    try {
        const { id } = req.params;
        const page = Math.max(1, parseInt(req.query.page) || 1);
        const limit = Math.min(100, Math.max(1, parseInt(req.query.limit) || 20));
        const offset = (page - 1) * limit;

        const { count, rows } = await ModelInteraction.findAndCountAll({
            where: { userId: id },
            order: [['questionAt', 'DESC']],
            limit,
            offset,
        });

        return res.status(200).json({
            message: 'Interactions retrieved!',
            data: {
                total: count,
                page,
                limit,
                totalPages: Math.ceil(count / limit),
                interactions: rows,
            },
        });
    } catch (error) {
        console.error(error);
        return res.status(503).json({ message: 'Internal server error!' });
    }
};

module.exports = {
    getUsers,
    getUserById,
    banUser,
    getUserInteractions,
};
