import Joi from 'joi';
import RefreshToken from '../../../models/RefreshToken.js';

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

        const { refreshToken } = req.body;

        // Cari dan hapus refresh token dari database
        const deletedCount = await RefreshToken.destroy({ where: { token: refreshToken } });

        if (deletedCount === 0) {
            return res.status(404).json({ status: 'error', message: 'Refresh token not found' });
        }

        return res.status(200).json({ status: 'success', message: 'Logged out successfully' });
    } catch (error) {
        console.error(error);
        return res.status(500).json({ status: 'error', message: 'Internal server error' });
    }
};

export default logout;