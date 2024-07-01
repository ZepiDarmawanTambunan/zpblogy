const Joi = require('joi');
const { Comment } = require('../../../models');

const create = async (req, res) => {
    const schema = Joi.object({
        comment: Joi.string().required(),
        clientId: Joi.string().allow(null),
        userId: Joi.number().integer().allow(null),
        commentableId: Joi.number().integer().required(),
        commentableType: Joi.string().valid('article', 'comment').required(),
        parentId: Joi.number().integer().allow(null),
        status: Joi.number().integer().min(0).max(1).default(1)
    });

    try {
        const { error, value } = schema.validate(req.body);
        if (error) {
            return res.status(400).json({ status: 'error', message: error.details[0].message });
        }

        const newComment = await Comment.create(value);
        return res.status(201).json({ status: 'success', data: newComment });
    } catch (error) {
        console.error(error);
        return res.status(500).json({ status: 'error', message: 'Internal server error' });
    }
};

module.exports = create ;