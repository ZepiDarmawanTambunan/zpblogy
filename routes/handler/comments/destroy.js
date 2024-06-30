const { Comment, Rating } = require('../../../models');

const destroy = async (req, res) => {
    const commentId = req.params.id;

    try {
        // Cari komentar berdasarkan ID yang diberikan
        const comment = await Comment.findByPk(commentId);

        if (!comment) {
            return res.status(404).json({ status: 'error', message: 'Comment not found' });
        }

        // Hapus semua rating terkait dengan komentar
        await Rating.destroy({
            where: {
                ratingableId: commentId,
                ratingableType: 'comment'
            }
        });

        // Cari semua komentar anak dan hapus mereka juga
        const childComments = await Comment.findAll({
            where: {
                parentId: commentId
            }
        });

        for (const childComment of childComments) {
            // Hapus rating terkait dengan komentar anak
            await Rating.destroy({
                where: {
                    ratingableId: childComment.id,
                    ratingableType: 'comment'
                }
            });

            // Hapus komentar anak
            await Comment.destroy({ where: { id: childComment.id } });
        }

        // Hapus komentar
        await Comment.destroy({ where: { id: commentId } });

        return res.status(200).json({ status: 'success', message: 'Comment and its child comments deleted successfully' });
    } catch (error) {
        console.error(error);
        return res.status(500).json({ status: 'error', message: 'Internal server error' });
    }
};

module.exports = { destroy };