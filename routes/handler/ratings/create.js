const Joi = require('joi');
const { Rating } = require('../../../models');

const create = async (req, res) => {
    const schema = Joi.object({
        rate: Joi.number().integer().min(1).max(5).required(),
        clientId: Joi.string().optional().allow(null),
        userId: Joi.number().integer().optional().allow(null),
        ratingableId: Joi.number().integer().required(),
        ratingableType: Joi.string().valid('article', 'comment').required()
    });

    try {
        const { error } = schema.validate(req.body);
        if (error) {
            return res.status(400).json({ status: 'error', message: error.details[0].message });
        }

        const newRating = await Rating.create(req.body);

        return res.status(201).json({ status: 'success', data: newRating });
    } catch (error) {
        console.error(error);
        return res.status(500).json({ status: 'error', message: 'Internal server error' });
    }
};

module.exports = create;