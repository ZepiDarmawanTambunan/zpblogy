const Joi = require('joi');
const { Article, Tag, Image } = require('../../../models');

const create = async (req, res) => {
    const schema = Joi.object({
        title: Joi.string().required(),
        content: Joi.string().required(),
        status: Joi.number().integer().min(0).max(1).default(1),
        tags: Joi.array().items(Joi.string()).optional()
    });

    try {
        const { error, value } = schema.validate(req.body);
        
        if (error) {
            return res.status(400).json({ status: 'error', message: error.details[0].message });
        }

        const { title, content, status, tags } = value;
        
        // Buat artikel baru
        const article = await Article.create({
            title,
            content,
            status,
            userId: req.user.userId
        });

        // Tangani pembuatan tag dan hubungkan dengan artikel
        if (tags) {
            const tagInstances = await Promise.all(tags.map(async (tag) => {
                const [tagInstance, created] = await Tag.findOrCreate({ where: { name: tag } });
                return tagInstance;
            }));
            await article.setTags(tagInstances);
        }

        // Tangani pembuatan gambar terkait artikel
        if (req.files && req.files.length > 0) {
            const imageInstances = await Promise.all(req.files.map(async (file) => {
                return await Image.create({ url: `/uploads/${file.filename}`, imageableId: article.id, imageableType: 'article' });
            }));
        }

        console.log('Files:', req.files);

        return res.status(201).json({ status: 'success', data: article });
    } catch (error) {
        console.error(error);
        return res.status(500).json({ status: 'error', message: 'Internal server error' });
    }
};

module.exports = create;