const { Article, User, Tag, Image, Op } = require('../../../models');

const getAll = async (req, res) => {
    const { page = 1, limit = 10, title, status } = req.query;

    try {
        // Validasi dan persiapan kondisi pencarian
        let whereConditions = {};

        if (title) {
            whereConditions.title = { [Op.like]: `%${title.trim()}%` };
        }

        if (status) {
            whereConditions.status = status.trim();
        }

        // Pencarian artikel dengan paginasi dan include model User dan Tag
        const articles = await Article.findAndCountAll({
            where: whereConditions,
            include: [
                {
                    model: User,
                    attributes: ['username', 'email']
                },
                {
                    model: Tag,
                    attributes: ['id', 'name', 'status']
                },
                {
                    model: Image,
                    attributes: ['url']
                }
            ],
            limit: parseInt(limit),
            offset: (page - 1) * limit
        });

        // Hitung total halaman
        const totalPages = Math.ceil(articles.count / limit);

        // Respon sukses
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