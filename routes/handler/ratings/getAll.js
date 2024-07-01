const { Rating, User } = require('../../../models');

const getAll = async (req, res) => {
    const { articleId, commentId } = req.query;

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
            // Fetch all ratings including User
            ratings = await Rating.findAll({
                include: {
                    model: User,
                    attributes: ['id', 'username', 'email'] // Specify user attributes to include
                }
            });
        }

        return res.status(200).json({ status: 'success', data: ratings });
    } catch (error) {
        console.error(error);
        return res.status(500).json({ status: 'error', message: 'Internal server error' });
    }
};

module.exports = getAll;