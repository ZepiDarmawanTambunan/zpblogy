const Article = require('../../../models/Article.js');
const User = require('../../../models/User.js');
const { Op } = require('sequelize');

const getAll = async (req, res) => {
    const { page = 1, limit = 10, title, status } = req.query;

    try {
        let whereConditions = {};

        if (title) {
            whereConditions.title = { [Op.like]: `%${title.trim()}%` };
        }

        if (status) {
            whereConditions.status = status.trim();
        }

        const articles = await Article.findAndCountAll({
            where: whereConditions,
            include: {
                model: User,
                attributes: ['username', 'email'] // Sertakan atribut yang diinginkan dari tabel User
            },
            limit: parseInt(limit),
            offset: (page - 1) * limit
        });

        const totalPages = Math.ceil(articles.count / limit);

        return res.status(200).json({
            status: 'success',
            data: articles.rows,
            pagination: {
                total: articles.count,
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

module.exports = getAll;