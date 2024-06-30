const { Rating, User, Op } = require('../../../models');

const getAll = async (req, res) => {
    const { articleId, commentId } = req.params;

    try {
        let ratings;

        if (articleId) {
            // Fetch ratings for an article including User
            ratings = await Rating.findAll({
                where: {
                    ratingableId: articleId,
                    ratingableType: 'article'
                },
                include: {
                    model: User,
                    attributes: ['id', 'username', 'email'] // Specify user attributes to include
                }
            });
        } else if (commentId) {
            // Fetch ratings for a comment including User
            ratings = await Rating.findAll({
                where: {
                    ratingableId: commentId,
                    ratingableType: 'comment'
                },
                include: {
                    model: User,
                    attributes: ['id', 'username', 'email'] // Specify user attributes to include
                }
            });
        } else {
            // If neither articleId nor commentId is provided, return an error
            return res.status(400).json({ status: 'error', message: 'Missing articleId or commentId' });
        }

        return res.status(200).json({ status: 'success', data: ratings });
    } catch (error) {
        console.error(error);
        return res.status(500).json({ status: 'error', message: 'Internal server error' });
    }
};

module.exports = getAll;