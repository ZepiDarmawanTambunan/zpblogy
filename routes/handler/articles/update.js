const Joi = require('joi');
const fs = require('fs');
const path = require('path');
const { Article, Tag, Image } = require('../../../models');

const update = async (req, res) => {
    const { id } = req.params;

    // Skema validasi menggunakan Joi
    const schema = Joi.object({
        title: Joi.string().optional(),
        content: Joi.string().optional(),
        status: Joi.number().integer().min(0).max(1).optional(),
        tags: Joi.array().items(Joi.string()).optional(),
        thumbnail: Joi.string().optional().allow(null)
    });

    try {
        // Validasi input
        const { error, value } = schema.validate(req.body);
        if (error) {
            return res.status(400).json({ status: 'error', message: error.details[0].message });
        }

        const { title, content, status, tags, thumbnail } = value;

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

        // Perbarui artikel
        await article.update({ title, content, status, thumbnail });

        // Tangani perubahan tag jika ada
        if (tags) {
            const tagInstances = await Promise.all(tags.map(async (tag) => {
                const [tagInstance, created] = await Tag.findOrCreate({ where: { name: tag } });
                return tagInstance;
            }));
            await article.setTags(tagInstances);
        } else if (tags && tags.length === 0) {
            // Hapus semua asosiasi tag jika array tags kosong
            await article.setTags([]);
        }

        // Tangani pembaruan thumbnail jika ada
        if (req.files && req.files.thumbnail) {
            const newThumbnailPath = `/uploads/${req.files.thumbnail[0].filename}`;
            
            // Hapus thumbnail lama dari sistem file dan database
            if (article.thumbnail) {
                const oldFilePath = path.join(__dirname, '../../../public', article.thumbnail);
                if (fs.existsSync(oldFilePath)) {
                    fs.unlink(oldFilePath, (err) => {
                        if (err) {
                            console.error(`Failed to delete file: ${oldFilePath}`, err);
                        } else {
                            console.log(`File deleted: ${oldFilePath}`);
                        }
                    });
                }
            }

            // Perbarui path thumbnail di artikel
            await article.update({ thumbnail: newThumbnailPath });
        }

        // Tangani pembaruan gambar terkait artikel
        if (req.files && req.files.images) {
            // Hapus gambar lama
            const images = await Image.findAll({
                where: { imageableId: article.id, imageableType: 'article' }
            });

            await Promise.all(images.map(async (image) => {
                const filePath = path.join(__dirname, '../../../public', image.url);
                if (fs.existsSync(filePath)) {
                    fs.unlink(filePath, (err) => {
                        if (err) {
                            console.error(`Failed to delete file: ${filePath}`, err);
                        } else {
                            console.log(`File deleted: ${filePath}`);
                        }
                    });
                }
                await image.destroy();
            }));

            // Tambahkan gambar baru
            await Promise.all(req.files.images.map(async (file) => {
                await Image.create({ url: `/uploads/${file.filename}`, imageableId: article.id, imageableType: 'article' });
            }));
        }
        
        // Ambil data artikel setelah diperbarui (termasuk tag dan gambar terkait)
        const updatedArticle = await Article.findByPk(id, {
            include: [
                {
                    model: Tag,
                    attributes: ['id', 'name', 'status']
                },
                {
                    model: Image,
                    attributes: ['url']
                }
            ]
        });

        return res.status(200).json({ status: 'success', data: updatedArticle });
    } catch (error) {
        console.error(error);
        return res.status(500).json({ status: 'error', message: 'Internal server error' });
    }
};

module.exports = update;