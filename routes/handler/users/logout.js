const Joi = require('joi');
const { RefreshToken, User } = require('../../../models');

const logout = async (req, res) => {
    // Skema validasi menggunakan Joi
    const schema = Joi.object({
        refreshToken: Joi.string().required()
    });

    try {
        // Validasi input
        const { error } = schema.validate(req.body);
        if (error) {
            return res.status(400).json({ status: 'error', message: error.details[0].message });
        }

        // Cari user berdasarkan ID
        const user = await User.findByPk(req.user.userId);
        if (!user) {
            return res.status(404).json({ status: 'error', message: 'User not found' });
        }

        const { refreshToken } = req.body;

        // Cari refresh token berdasarkan user ID dan token
        const tokenInstance = await RefreshToken.findOne({ where: { token: refreshToken, userId: user.id } });

        if (!tokenInstance) {
            return res.status(404).json({ status: 'error', message: 'Refresh token not found or does not belong to the user' });
        }

        // Hapus refresh token dari database
        await tokenInstance.destroy();

        return res.status(200).json({ status: 'success', message: 'Logged out successfully' });
    } catch (error) {
        console.error(error);
        return res.status(500).json({ status: 'error', message: 'Internal server error' });
    }
};

module.exports = logout;