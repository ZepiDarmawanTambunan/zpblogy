const { Rating } = require('../../../models');

const destroy = async (req, res) => {
    const ratingId = req.params.id;

    try {
        // Find the rating by ID
        const rating = await Rating.findByPk(ratingId);

        if (!rating) {
            return res.status(404).json({ status: 'error', message: 'Rating not found' });
        }

        // Delete the rating by ID
        await Rating.destroy({ where: { id: ratingId } });

        return res.status(200).json({ status: 'success', message: 'Rating deleted successfully' });
    } catch (error) {
        console.error(error);
        return res.status(500).json({ status: 'error', message: 'Internal server error' });
    }
};

module.exports = destroy;