'use strict';

const Joi = require('joi');
const { Rating, User, Article, Comment } = require('../../../models');

const destroy = async (req, res) => {
    const ratingId = req.params.id;
    const { userId, clientId } = req.body; // Ambil userId dan clientId dari body request

    // Validasi menggunakan Joi
    const schema = Joi.object({
        userId: Joi.number().integer().optional(),
        clientId: Joi.string().optional()
    }).or('userId', 'clientId'); // Pastikan salah satu dari userId atau clientId harus ada

    try {
        const { error, value } = schema.validate(req.body);
        if (error) {
            return res.status(400).json({ status: 'error', message: error.details[0].message });
        }

        // Cari rating berdasarkan ID yang diberikan
        const rating = await Rating.findByPk(ratingId);
        if (!rating) {
            return res.status(404).json({ status: 'error', message: 'Rating not found' });
        }

        // Jika userId ada, verifikasi bahwa user tersebut ada di database
        if (userId) {
            const user = await User.findByPk(userId);
            if (!user) {
                return res.status(404).json({ status: 'error', message: 'User not found' });
            }
        }

        // Temukan entitas terkait berdasarkan ratingableId dan ratingableType
        const relatedEntity = await Rating.findOne({
            where: { id: ratingId },
            include: [{
                model: Article,
                attributes: ['userId'] // Jika ada relasi antara Rating dan Article
            }, {
                model: Comment,
                attributes: ['userId'] // Jika ada relasi antara Rating dan Comment
            }]
        });

        if (!relatedEntity) {
            return res.status(404).json({ status: 'error', message: 'Related entity not found' });
        }

        // Cek apakah userId atau clientId cocok dengan yang ada di database
        const isAuthorized = 
            (userId && relatedEntity.userId === userId) || 
            (clientId && relatedEntity.clientId === clientId);

        if (!isAuthorized) {
            return res.status(403).json({ status: 'error', message: 'Unauthorized' });
        }

        // Hapus rating
        await Rating.destroy({ where: { id: ratingId } });

        return res.status(200).json({ status: 'success', message: 'Rating deleted successfully' });
    } catch (error) {
        console.error(error);
        return res.status(500).json({ status: 'error', message: 'Internal server error' });
    }
};

module.exports = destroy;