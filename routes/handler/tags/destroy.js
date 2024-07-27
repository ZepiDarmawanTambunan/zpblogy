    'use strict';

const { Tag, ArticleTag } = require('../../../models');

const destroy = async (req, res) => {
    const { id } = req.params;

    try {
        // Cari tag berdasarkan ID
        const tag = await Tag.findByPk(id);
        if (!tag) {
            return res.status(404).json({ status: 'error', message: 'Tag not found' });
        }

        // Hapus entri di ArticleTag yang terkait dengan Tag ini
        await ArticleTag.destroy({ where: { tagId: id } });

        // Hapus Tag
        await tag.destroy();

        return res.status(200).json({ status: 'success', message: 'Tag and related article tags deleted successfully' });
    } catch (error) {
        console.error(error);
        return res.status(500).json({ status: 'error', message: 'Internal server error' });
    }
};

module.exports = destroy;