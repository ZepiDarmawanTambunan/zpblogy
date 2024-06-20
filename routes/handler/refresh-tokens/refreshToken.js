const jwt = require('jsonwebtoken');
const { User, RefreshToken } = require('../../../models');
const Joi = require('joi');

const refreshToken = async (req, res) => {
    // Skema validasi menggunakan Joi
    const schema = Joi.object({
        refreshToken: Joi.string().required(),
        email: Joi.string().email().required()
    });

    try {
        // Validasi input
        const { error } = schema.validate(req.body);
        if (error) {
            return res.status(400).json({ status: 'error', message: error.details[0].message });
        }

        const { refreshToken, email } = req.body;

        // Cek apakah refresh token ada di database
        const storedToken = await RefreshToken.findOne({ where: { token: refreshToken } });
        if (!storedToken) {
            return res.status(403).json({ status: 'error', message: 'Invalid refresh token' });
        }

        // Verify refresh token
        jwt.verify(refreshToken, process.env.JWT_SECRET_REFRESH_TOKEN, async (err, decoded) => {
            if (err) {
                return res.status(403).json({ status: 'error', message: err.message });
            }

            // Cek apakah email yang menggunakan refresh token ini sama
            if (email !== decoded.email) {
                return res.status(403).json({ status: 'error', message: 'Email is not valid' });
            }

            // Generate new access token
            const newAccessToken = jwt.sign(
                { userId: decoded.userId, email: decoded.email },
                process.env.JWT_SECRET,
                { expiresIn: process.env.JWT_ACCESS_TOKEN_EXPIRED }
            );

            return res.json({
                status: 'success',
                data: {
                    token: newAccessToken
                }
            });
        });
    } catch (error) {
        console.error(error);
        return res.status(500).json({ status: 'error', message: 'Internal server error' });
    }
};

module.exports = refreshToken;