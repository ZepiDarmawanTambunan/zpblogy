'use strict';

const Joi = require('joi');
const { Rating, User, Article, Comment } = require('../../../models');

const create = async (req, res) => {
    const schema = Joi.object({
        rate: Joi.number().integer().min(1).max(5).required(),
        clientId: Joi.string().optional().allow(null),
        userId: Joi.number().integer().optional().allow(null),
        ratingableId: Joi.number().integer().required(),
        ratingableType: Joi.string().valid('article', 'comment').required()
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

        // Check if related entity exists
        let relatedEntity;
        if (value.ratingableType === 'article') {
            relatedEntity = await Article.findByPk(value.ratingableId);
        } else if (value.ratingableType === 'comment') {
            relatedEntity = await Comment.findByPk(value.ratingableId);
        }

        if (!relatedEntity) {
            return res.status(404).json({ status: 'error', message: `${value.ratingableType.charAt(0).toUpperCase() + value.ratingableType.slice(1)} not found` });
        }

        // Ensure that either userId or clientId matches the related entity's userId or clientId
        const isAuthorized = 
            (value.userId && relatedEntity.userId === value.userId) || 
            (value.clientId && relatedEntity.clientId === value.clientId);

        if (!isAuthorized) {
            return res.status(403).json({ status: 'error', message: 'Unauthorized' });
        }

        // Create the rating
        const newRating = await Rating.create(value);

        return res.status(201).json({ status: 'success', data: newRating });
    } catch (error) {
        console.error(error);
        return res.status(500).json({ status: 'error', message: 'Internal server error' });
    }
};

module.exports = create;