const Joi = require('joi');
const Article = require('../../../models/Article');
const Tag = require('../../../models/Tag');

const create = async (req, res) => {
    const schema = Joi.object({
        title: Joi.string().required(),
        content: Joi.string().required(),
        status: Joi.string().required(),
        image: Joi.string().allow(null, ''),
        tags: Joi.array().items(Joi.string()) // Validasi untuk array tags
    });

    try {
        const { error } = schema.validate(req.body);
        if (error) {
            return res.status(400).json({ status: 'error', message: error.details[0].message });
        }

        // Buat artikel baru
        const newArticle = await Article.create({
            title: req.body.title,
            content: req.body.content,
            status: req.body.status,
            image: req.body.image || null,
            userId: req.user.id // Misalkan req.user.id adalah ID dari user yang sedang membuat artikel
        });

        // Tangani pembuatan tag dan hubungkan dengan artikel
        if (req.body.tags && req.body.tags.length > 0) {
            const tagPromises = req.body.tags.map(async (tagName) => {
                let tag = await Tag.findOne({ where: { name: tagName } });

                if (!tag) {
                    tag = await Tag.create({ name: tagName });
                }

                return tag;
            });

            const tagInstances = await Promise.all(tagPromises);

            await newArticle.setTags(tagInstances);
        }

        return res.status(201).json({ status: 'success', data: newArticle });
    } catch (error) {
        console.error(error);
        return res.status(500).json({ status: 'error', message: 'Internal server error' });
    }
};

module.exports = create;