const Joi = require('joi');
const Article = require('../../../models/Article');
const Tag = require('../../../models/Tag');

const update = async (req, res) => {
    const { id } = req.params;

    // Skema validasi menggunakan Joi
    const schema = Joi.object({
        title: Joi.string().optional(),
        content: Joi.string().optional(),
        status: Joi.string().optional(),
        image: Joi.string().optional(),
        tags: Joi.array().items(Joi.string()).optional() // Validasi untuk array tags
    });

    try {
        // Validasi input
        const { error } = schema.validate(req.body);
        if (error) {
            return res.status(400).json({ status: 'error', message: error.details[0].message });
        }

        // Cari artikel berdasarkan ID
        const article = await Article.findByPk(id);
        if (!article) {
            return res.status(404).json({ status: 'error', message: 'Article not found' });
        }

        // Perbarui artikel
        await article.update(req.body);

        // Tangani perubahan tag jika ada
        if (req.body.tags && req.body.tags.length > 0) {
            // Temukan atau buat tag yang baru
            const tagPromises = req.body.tags.map(async (tagName) => {
                let tag = await Tag.findOne({ where: { name: tagName } });

                if (!tag) {
                    tag = await Tag.create({ name: tagName });
                }

                return tag;
            });

            const tagInstances = await Promise.all(tagPromises);

            // Set ulang asosiasi tag dengan artikel
            await article.setTags(tagInstances);
        } else if (req.body.tags && req.body.tags.length === 0) {
            // Hapus semua asosiasi tag jika array tags kosong
            await article.setTags([]);
        }

        return res.status(200).json({ status: 'success', data: article });
    } catch (error) {
        console.error(error);
        return res.status(500).json({ status: 'error', message: 'Internal server error' });
    }
};

module.exports = update;