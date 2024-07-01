// controllers/commentController.js
const { Comment, User, Rating } = require('../../../models');

const getByParentId = async (req, res) => {
    const parentId = req.params.parentId;

    try {
        const comments = await Comment.findAll({
            where: { parentId },
            include: [
                {
                    model: User,
                    attributes: ['id', 'username'] // Sesuaikan dengan atribut yang ingin Anda tampilkan
                },
                {
                    model: Rating,
                    attributes: ['id', 'rate', 'clientId', 'userId', 'status', 'createdAt', 'updatedAt']
                }
            ]
        });

        return res.status(200).json({ status: 'success', data: comments });
    } catch (error) {
        console.error(error);
        return res.status(500).json({ status: 'error', message: 'Internal server error' });
    }
};

module.exports = getByParentId;