const Article = require('../../../models/Article.js');

const destroy = async (req, res) => {
    const { id } = req.params;

    try {
        // Cari artikel berdasarkan ID
        const article = await Article.findByPk(id);
        if (!article) {
            return res.status(404).json({ status: 'error', message: 'Article not found' });
        }

        // Hapus artikel
        await article.destroy();

        return res.status(200).json({ status: 'success', message: 'Article deleted successfully' });
    } catch (error) {
        console.error(error);
        return res.status(500).json({ status: 'error', message: 'Internal server error' });
    }
};

module.exports = destroy;