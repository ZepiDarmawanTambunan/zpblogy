const bcrypt = require('bcrypt');
const Joi = require('joi');
const { User, Op } = require('../../../models');

const register = async (req, res) => {
    // Skema validasi menggunakan Joi
    const schema = Joi.object({
        username: Joi.string().required(),
        email: Joi.string().email().required(),
        password: Joi.string().min(6).required()
    });

    try {
        // Validasi input
        const { error } = schema.validate(req.body);
        if (error) {
            return res.status(400).json({ status: 'error', message: error.details[0].message });
        }

        // Cek apakah email atau username sudah terdaftar
        const existingUser = await User.findOne({
            where: {
                [Op.or]: [
                    { email: req.body.email },
                    { username: req.body.username }
                ]
            }
        });

        if (existingUser) {
            return res.status(409).json({ status: 'error', message: 'Email or username already exists' });
        }

        // Hash password
        const hashedPassword = await bcrypt.hash(req.body.password, 10);

        // Data user yang akan dibuat
        const userData = {
            username: req.body.username,
            email: req.body.email,
            password: hashedPassword,
        };

        // Buat user baru
        const newUser = await User.create(userData);

        return res.status(201).json({ status: 'success', data: { id: newUser.id } });
    } catch (error) {
        console.error(error);
        return res.status(500).json({ status: 'error', message: 'Internal server error' });
    }
};

module.exports = register;