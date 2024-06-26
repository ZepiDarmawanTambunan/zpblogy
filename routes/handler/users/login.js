const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const Joi = require('joi');
const { User, Role, RefreshToken } = require('../../../models');

const login = async (req, res) => {
    // Skema validasi menggunakan Joi
    const schema = Joi.object({
        email: Joi.string().email().required(),
        password: Joi.string().required()
    });

    try {
        // Validasi input
        const { error } = schema.validate(req.body);
        if (error) {
            return res.status(400).json({ status: 'error', message: error.details[0].message });
        }

        // Cari user berdasarkan email
        const user = await User.findOne({
            where: { email: req.body.email },
            include: {
                model: Role,
                attributes: ['name']
            }
        });
        if (!user) {
            return res.status(404).json({ status: 'error', message: 'User not found' });
        }

        // Verifikasi password
        const passwordMatch = await bcrypt.compare(req.body.password, user.password);
        if (!passwordMatch) {
            return res.status(401).json({ status: 'error', message: 'Invalid credentials' });
        }

        // Hapus semua refresh token sebelumnya yang terkait dengan user ini
        await RefreshToken.destroy({ where: { userId: user.id } });

        const token = jwt.sign(
            { userId: user.id, email: user.email, role: user.Role.name },
            process.env.JWT_SECRET,
            { expiresIn: process.env.JWT_ACCESS_TOKEN_EXPIRED }
        );
        
        const refreshToken = jwt.sign(
            { userId: user.id, email: user.email, role: user.Role.name },
            process.env.JWT_SECRET_REFRESH_TOKEN,
            { expiresIn: process.env.JWT_REFRESH_TOKEN_EXPIRED }
        );

        // Simpan refresh token di database
        await RefreshToken.create({ token: refreshToken, userId: user.id });

        return res.json({
            status: 'success',
            data: { token, refreshToken }
        });
    } catch (error) {
        console.error(error);
        return res.status(500).json({ status: 'error', message: 'Internal server error' });
    }
};

module.exports = login;