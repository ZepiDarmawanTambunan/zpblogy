const Joi = require('joi');
const { Comment, Rating, User, Role } = require('../../../models');

const destroy = async (req, res) => {
    const commentId = req.params.id;
    const { userId, clientId } = req.body; // Ambil userId dan clientId dari body request

    // Validasi menggunakan Joi
    const schema = Joi.object({
        userId: Joi.number().integer().optional(),
        clientId: Joi.string().optional()
    }).or('userId', 'clientId'); // Pastikan salah satu dari userId atau clientId harus ada

    try {
        const { error } = schema.validate(req.body);
        if (error) {
            return res.status(400).json({ status: 'error', message: error.details[0].message });
        }

        // Cari komentar berdasarkan ID yang diberikan
        const comment = await Comment.findByPk(commentId);
        if (!comment) {
            return res.status(404).json({ status: 'error', message: 'Comment not found' });
        }

        let isAuthorized = false;

        // Jika userId ada, verifikasi bahwa user tersebut ada di database
        if (userId) {
            const user = await User.findByPk(userId, {
                include: [{ model: Role, attributes: ['name'] }] // Sertakan role dalam query
            });
            if (!user) {
                return res.status(404).json({ status: 'error', message: 'User not found' });
            }

            // Cek apakah role user adalah 'master'
            if (user.Role && user.Role.name === 'master') {
                isAuthorized = true;
            } else {
                // Jika tidak 'master', periksa otorisasi berdasarkan userId dan comment.userId
                isAuthorized = comment.userId === userId;
            }
        } else if (clientId) {
            // Cek apakah clientId cocok dengan yang ada di database
            isAuthorized = comment.clientId === clientId;
        }

        if (!isAuthorized) {
            return res.status(403).json({ status: 'error', message: 'Unauthorized' });
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
                commentableId: commentId,
                commentableType: 'comment'
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

module.exports = destroy;