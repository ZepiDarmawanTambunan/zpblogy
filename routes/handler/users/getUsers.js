const User = require('../../../models/User.js');
const Role = require('../../../models/Role.js');
const { Op } = require('sequelize');

const getUsers = async (req, res) => {
    const { page = 1, limit = 10, status, username } = req.query;

    try {
        let whereConditions = {};

        const trimmedStatus = status ? status.trim() : null;
        const trimmedUsername = username ? username.trim() : null;

        if (trimmedStatus) {
            whereConditions.status = trimmedStatus;
        }

        if (trimmedUsername) {
            whereConditions.username = { [Op.like]: `%${trimmedUsername}%` };
        }

        const users = await User.findAndCountAll({
            where: whereConditions,
            include: [{ model: Role }],
            limit: parseInt(limit),
            offset: (page - 1) * limit
        });

        const totalPages = Math.ceil(users.count / limit);

        return res.status(200).json({
            status: 'success',
            data: users.rows,
            pagination: {
                total: users.count,
                perPage: parseInt(limit),
                currentPage: parseInt(page),
                totalPages: totalPages
            }
        });
    } catch (error) {
        console.error(error);
        return res.status(500).json({ status: 'error', message: 'Internal server error' });
    }
};

module.exports = getUsers;