const { Comment, User } = require('../../../models');

const get = async (req, res) => {
    try {
        const comment = await Comment.findByPk(req.params.id, {
            include: [
                {
                    model: User,
                    attributes: ['id', 'username']
                },
                {
                    model: Rating,
                    attributes: ['id', 'rate', 'clientId', 'userId', 'status', 'createdAt', 'updatedAt']
                }
            ]
        });

        if (!comment) {
            return res.status(404).json({ status: 'error', message: 'Comment not found' });
        }

        return res.status(200).json({ status: 'success', data: comment });
    } catch (error) {
        console.error(error);
        return res.status(500).json({ status: 'error', message: 'Internal server error' });
    }
};

module.exports = { get };