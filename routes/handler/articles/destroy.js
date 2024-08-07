const fs = require('fs');
const path = require('path');
const { Article, ArticleTag, Image } = require('../../../models');

const destroy = async (req, res) => {
    const { id } = req.params;

    try {
        // Cari artikel berdasarkan ID
        const article = await Article.findByPk(id);
        if (!article) {
            return res.status(404).json({ status: 'error', message: 'Article not found' });
        }

        // Master dan user yang dapat melakukan update
        if (req.user.role !== 'master') {
            if (article.userId != req.user.userId) {
                return res.status(403).json({ status: 'error', message: 'You don\'t have permission' });
            }
        }

        // Hapus asosiasi artikel dengan tag dari tabel perantara
        await ArticleTag.destroy({
            where: { articleId: id }
        });

        // Hapus gambar terkait artikel
        const images = await Image.findAll({
            where: { imageableId: id, imageableType: 'article' }
        });

        await Promise.all(images.map(async (image) => {
            // Hapus file gambar dari sistem file
            const filePath = path.join(__dirname, '../../../public', image.url);

            if (fs.existsSync(filePath)) {
                fs.unlink(filePath, (err) => {
                    if (err) {
                        console.error(`Failed to delete file: ${filePath}`, err);
                    } else {
                        console.log(`File deleted: ${filePath}`);
                    }
                });
            } else {
                console.warn(`File not found: ${filePath}`);
            }

            // Hapus entri gambar dari database
            await image.destroy();
        }));

        // Hapus thumbnail jika ada
        if (article.thumbnail) {
            const thumbnailPath = path.join(__dirname, '../../../public', article.thumbnail);

            if (fs.existsSync(thumbnailPath)) {
                fs.unlink(thumbnailPath, (err) => {
                    if (err) {
                        console.error(`Failed to delete thumbnail file: ${thumbnailPath}`, err);
                    } else {
                        console.log(`Thumbnail file deleted: ${thumbnailPath}`);
                    }
                });
            }
        }

        // Hapus artikel dari database
        await article.destroy();

        return res.status(200).json({ status: 'success', message: 'Article and associated images and thumbnail deleted successfully' });
    } catch (error) {
        console.error(error);
        return res.status(500).json({ status: 'error', message: 'Internal server error' });
    }
};

module.exports = destroy;