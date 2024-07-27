'use strict';

const Joi = require('joi');
const { Rating, User, Article, Comment } = require('../../../models');

const update = async (req, res) => {
    const schema = Joi.object({
        rate: Joi.number().integer().min(1).max(5),
        clientId: Joi.string().allow(null).optional(),
        userId: Joi.number().integer().allow(null).optional(),
        ratingableId: Joi.number().integer(),
        ratingableType: Joi.string().valid('article', 'comment')
    }).min(1); // At least one field must be present for update

    try {
        const { error, value } = schema.validate(req.body);
        if (error) {
            return res.status(400).json({ status: 'error', message: error.details[0].message });
        }

        // Find the rating by ID
        const rating = await Rating.findByPk(req.params.id);
        if (!rating) {
            return res.status(404).json({ status: 'error', message: 'Rating not found' });
        }

        // If userId is provided, verify the user exists in the database
        if (value.userId) {
            const user = await User.findByPk(value.userId);
            if (!user) {
                return res.status(404).json({ status: 'error', message: 'User not found' });
            }
        }

        // Find the related entity based on ratingableId and ratingableType
        let relatedEntity;
        if (value.ratingableType === 'article') {
            relatedEntity = await Article.findByPk(value.ratingableId);
        } else if (value.ratingableType === 'comment') {
            relatedEntity = await Comment.findByPk(value.ratingableId);
        }

        if (!relatedEntity) {
            return res.status(404).json({ status: 'error', message: `${value.ratingableType.charAt(0).toUpperCase() + value.ratingableType.slice(1)} not found` });
        }

        // Check if userId or clientId matches with the userId or clientId of the related entity
        const isAuthorized =
            (value.userId && relatedEntity.userId === value.userId) ||
            (value.clientId && relatedEntity.clientId === value.clientId);

        if (!isAuthorized) {
            return res.status(403).json({ status: 'error', message: 'Unauthorized' });
        }

        // Perform the update operation
        await Rating.update(value, {
            where: { id: req.params.id }
        });

        // Fetch the updated rating data from the database
        const updatedRating = await Rating.findByPk(req.params.id);

        return res.status(200).json({ status: 'success', data: updatedRating });
    } catch (error) {
        console.error(error);
        return res.status(500).json({ status: 'error', message: 'Internal server error' });
    }
};

module.exports = update;