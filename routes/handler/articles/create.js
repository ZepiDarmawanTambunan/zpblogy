// routes/handler/articles/createArticle.js
import Joi from 'joi';
import Article from '../../../models/Article.js';

const create = async (req, res) => {
    const schema = Joi.object({
        title: Joi.string().required(),
        content: Joi.string().required(),
        status: Joi.string().valid('draft', 'published').required(),
        image: Joi.string().allow(null, '')
    });

    try {
        const { error } = schema.validate(req.body);
        if (error) {
            return res.status(400).json({ status: 'error', message: error.details[0].message });
        }

        const newArticle = await Article.create({
            title: req.body.title,
            content: req.body.content,
            status: req.body.status,
            image: req.body.image || null,
            userId: req.user.id, // Misalkan req.user.id adalah ID dari user yang sedang membuat artikel
        });

        return res.status(201).json({ status: 'success', data: newArticle });
    } catch (error) {
        console.error(error);
        return res.status(500).json({ status: 'error', message: 'Internal server error' });
    }
};

export default create;