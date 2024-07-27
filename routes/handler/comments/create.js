'use strict';

const Joi = require('joi');
const { Comment, User, Article } = require('../../../models'); // Pastikan Anda telah mengimpor model Article

const create = async (req, res) => {
    const schema = Joi.object({
        comment: Joi.string().required(),
        clientId: Joi.string().allow(null),
        userId: Joi.number().integer().allow(null),
        commentableId: Joi.number().integer().required(),
        commentableType: Joi.string().valid('article', 'comment').required(),
        status: Joi.number().integer().min(0).max(1).default(1)
    }).or('clientId', 'userId'); // Ensure either 'clientId' or 'userId' is present

    try {
        const { error, value } = schema.validate(req.body);
        if (error) {
            return res.status(400).json({ status: 'error', message: error.details[0].message });
        }

        // Ensure that either userId or clientId is provided
        if (!value.userId && !value.clientId) {
            return res.status(400).json({ status: 'error', message: 'Either userId or clientId is required' });
        }

        // Find the user if userId is provided
        if (value.userId) {
            const user = await User.findByPk(value.userId);
            if (!user) {
                return res.status(404).json({ status: 'error', message: 'User not found' });
            }
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

        // Check that userId does not match the related entity's userId
        if (value.userId && relatedEntity.userId === value.userId) {
            return res.status(400).json({ status: 'error', message: 'User ID cannot be the same as the user ID of the related entity' });
        }

        // Create the comment
        const newComment = await Comment.create(value);

        // Fetch the created comment with associated user details
        const commentWithUser = await Comment.findByPk(newComment.id, {
            include: [{
                model: User,
                attributes: ['username', 'email'] // Include only the necessary attributes
            }]
        });

        return res.status(201).json({ status: 'success', data: commentWithUser });
    } catch (error) {
        console.error(error);
        return res.status(500).json({ status: 'error', message: 'Internal server error' });
    }
};

module.exports = create;