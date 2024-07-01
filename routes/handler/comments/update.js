const Joi = require('joi');
const { Comment } = require('../../../models');

const update = async (req, res) => {
    const schema = Joi.object({
        comment: Joi.string(),
        clientId: Joi.string().allow(null),
        userId: Joi.number().integer().allow(null),
        commentableId: Joi.number().integer(),
        commentableType: Joi.string().valid('article', 'comment'),
        parentId: Joi.number().integer().allow(null),
        status: Joi.number().integer().min(0).max(1)
    }).min(1); // At least one field must be present

    try {
        const { error, value } = schema.validate(req.body);
        if (error) {
            return res.status(400).json({ status: 'error', message: error.details[0].message });
        }

        const comment = await Comment.findByPk(req.params.id);
        if (!comment) {
            return res.status(404).json({ status: 'error', message: 'Comment not found' });
        }

        await comment.update(value);
        return res.status(200).json({ status: 'success', data: comment });
    } catch (error) {
        console.error(error);
        return res.status(500).json({ status: 'error', message: 'Internal server error' });
    }
};

module.exports = update;