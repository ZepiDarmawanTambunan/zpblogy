'use strict';

const Joi = require('joi');
const { Comment, Article, User } = require('../../../models');

const update = async (req, res) => {
    const schema = Joi.object({
        comment: Joi.string(),
        clientId: Joi.string().allow(null),
        userId: Joi.number().integer().allow(null),
        commentableId: Joi.number().integer(),
        commentableType: Joi.string().valid('article', 'comment'),
        status: Joi.number().integer().min(0).max(1)
    }).min(1); // At least one field must be present

    try {
        const { error, value } = schema.validate(req.body);
        if (error) {
            return res.status(400).json({ status: 'error', message: error.details[0].message });
        }

        // Find the comment to update
        const comment = await Comment.findByPk(req.params.id);
        if (!comment) {
            return res.status(404).json({ status: 'error', message: 'Comment not found' });
        }

        // Find the related entity
        let relatedEntity;
        if (value.commentableType === 'article') {
            relatedEntity = await Article.findByPk(value.commentableId);
        } else if (value.commentableType === 'comment') {
            relatedEntity = await Comment.findByPk(value.commentableId);
        }

        if (!relatedEntity) {
            return res.status(404).json({ status: 'error', message: `${value.commentableType.charAt(0).toUpperCase() + value.commentableType.slice(1)} not found` });
        }

        // Check if userId or clientId matches the related entity's userId or clientId
        const isAuthorized = 
            (value.userId && relatedEntity.userId === value.userId) || 
            (value.clientId && relatedEntity.clientId === value.clientId);

        if (!isAuthorized) {
            return res.status(403).json({ status: 'error', message: 'Unauthorized' });
        }

        // Update the comment with the new values
        await comment.update(value);

        // Return the updated comment
        return res.status(200).json({ status: 'success', data: comment });
    } catch (error) {
        console.error(error);
        return res.status(500).json({ status: 'error', message: 'Internal server error' });
    }
};

module.exports = update;