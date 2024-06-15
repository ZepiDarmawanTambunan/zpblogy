const Role = require('../../../models/Role.js');
const { Op } = require('sequelize');

const paginate = async (req, res) => {
    const { page = 1, limit = 10, status, name } = req.query;

    try {
        let whereConditions = {};

        const trimmedStatus = status ? status.trim() : null;
        const trimmedName = name ? name.trim() : null;

        if (trimmedStatus) {
            whereConditions.status = trimmedStatus;
        }

        if (trimmedName) {
            whereConditions.name = { [Op.like]: `%${trimmedName}%` };
        }

        const roles = await Role.findAndCountAll({
            where: whereConditions,
            limit: parseInt(limit),
            offset: (page - 1) * limit
        });

        const totalPages = Math.ceil(roles.count / limit);

        return res.status(200).json({ 
            status: 'success', 
            data: roles.rows, 
            pagination: {
                total: roles.count,
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

module.exports = paginate;