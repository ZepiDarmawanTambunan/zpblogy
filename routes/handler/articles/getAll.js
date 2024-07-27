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

        console.log("Where Conditions:", whereConditions);

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
                    attributes: ['id', 'name', 'status'],
                    through: { attributes: [] } // Menghindari pengambilan kolom dari tabel penghubung yaitu article tag
                },
                {
                    model: Image,
                    attributes: ['url']
                }
            ],
            distinct: true, // misal ada 2 data jika tidak pakai distinct dia menjadi 8 krn tag dan image
            limit: parseInt(limit),
            offset: (page - 1) * limit
        });

        console.log("Total Articles in DB:", articles.count);
        console.log("Articles on Current Page:", articles.rows.length);
        console.log("Articles Data:", articles.rows);

        // Hitung total halaman
        const totalPages = Math.ceil(articles.count / limit);

        // Respon sukses
        return res.status(200).json({
            status: 'success',
            data: articles.rows,
            pagination: {
                total: articles.count,     // Total number of articles
                perPage: parseInt(limit),  // Number of articles per page
                currentPage: parseInt(page),// Current page number
                totalPages: totalPages      // Total number of pages
            }
        });
    } catch (error) {
        console.error(error);
        return res.status(500).json({ status: 'error', message: 'Internal server error' });
    }
};

module.exports = getAll;