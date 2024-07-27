'use strict';

const { Comment, User, Rating } = require('../../../models');

const getAll = async (req, res) => {
    const { articleId, commentId } = req.query;
    let { limit = 10, offset = 0 } = req.query;

    // Validasi dan parsing limit dan offset
    limit = parseInt(limit, 10);
    offset = parseInt(offset, 10);

    if (isNaN(limit) || limit <= 0) {
        limit = 10;
    }

    if (isNaN(offset) || offset < 0) {
        offset = 0;
    }

    try {
        let comments;

        if (articleId) {
            // Fetch comments for a specific article including User and Ratings
            comments = await Comment.findAll({
                where: {
                    commentableId: articleId,
                    commentableType: 'article'
                },
                include: [
                    {
                        model: User,
                        attributes: ['id', 'username', 'email'] // Specify user attributes to include
                    },
                    {
                        model: Rating,
                        attributes: ['id', 'rate', 'clientId', 'userId', 'status', 'createdAt', 'updatedAt']
                    }
                ],
                limit,
                offset
            });
        } else if (commentId) {
            // Fetch replies for a specific comment including User and Ratings
            comments = await Comment.findAll({
                where: {
                    commentableId: commentId,
                    commentableType: 'comment'
                },
                include: [
                    {
                        model: User,
                        attributes: ['id', 'username', 'email'] // Specify user attributes to include
                    },
                    {
                        model: Rating,
                        attributes: ['id', 'rate', 'clientId', 'userId', 'status', 'createdAt', 'updatedAt']
                    }
                ],
                limit,
                offset
            });
        } else {
            // Fetch all comments including User and Ratings
            comments = await Comment.findAll({
                include: [
                    {
                        model: User,
                        attributes: ['id', 'username', 'email'] // Specify user attributes to include
                    },
                    {
                        model: Rating,
                        attributes: ['id', 'rate', 'clientId', 'userId', 'status', 'createdAt', 'updatedAt']
                    }
                ],
                limit,
                offset
            });
        }

        return res.status(200).json({ status: 'success', data: comments });
    } catch (error) {
        console.error(error);
        return res.status(500).json({ status: 'error', message: 'Internal server error' });
    }
};

module.exports = getAll;