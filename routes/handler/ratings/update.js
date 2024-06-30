const Joi = require('joi');
const { Rating } = require('../../../models');

const update = async (req, res) => {
    const schema = Joi.object({
        rate: Joi.number().integer().min(1).max(5),
        clientId: Joi.string().allow(null).optional(),
        userId: Joi.number().integer().allow(null).optional(),
        ratingableId: Joi.number().integer(),
        ratingableType: Joi.string().valid('article', 'comment')
    }).min(1); // At least one field must be present for update

    try {
        const { error } = schema.validate(req.body);
        if (error) {
            return res.status(400).json({ status: 'error', message: error.details[0].message });
        }

        // Check if the rating with the given ID exists in the database
        const existingRating = await Rating.findByPk(req.params.id);
        if (!existingRating) {
            return res.status(404).json({ status: 'error', message: 'Rating not found' });
        }

        // Perform the update operation on the rating
        await Rating.update(req.body, {
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