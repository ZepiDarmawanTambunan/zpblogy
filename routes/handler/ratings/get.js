const { Rating } = require('../../../models');

const getById = async (req, res) => {
    const ratingId = req.params.id;

    try {
        const rating = await Rating.findByPk(ratingId);

        if (!rating) {
            return res.status(404).json({ status: 'error', message: 'Rating not found' });
        }

        return res.status(200).json({ status: 'success', data: rating });
    } catch (error) {
        console.error(error);
        return res.status(500).json({ status: 'error', message: 'Internal server error' });
    }
};

module.exports = getById;