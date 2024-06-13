import bcrypt from 'bcrypt';
import Joi from 'joi';
import User from '../../../models/User.js';

const register = async (req, res) => {
    // Skema validasi menggunakan Joi
    const schema = Joi.object({
        username: Joi.string().required(),
        email: Joi.string().email().required(),
        password: Joi.string().min(6).required(),
        profession: Joi.string().optional()
    });

    try {
        // Validasi input
        const { error } = schema.validate(req.body);
        if (error) {
            return res.status(400).json({ status: 'error', message: error.details[0].message });
        }

        // Cek apakah email sudah terdaftar
        const existingUser = await User.findOne({ where: { email: req.body.email } });
        if (existingUser) {
            return res.status(409).json({ status: 'error', message: 'Email already exists' });
        }

        // Hash password
        const hashedPassword = await bcrypt.hash(req.body.password, 10);

        // Data user yang akan dibuat
        const userData = {
            username: req.body.username,
            email: req.body.email,
            password: hashedPassword,
            profession: req.body.profession,
        };

        // Buat user baru
        const newUser = await User.create(userData);

        return res.status(201).json({ status: 'success', data: { id: newUser.id } });
    } catch (error) {
        console.error(error);
        return res.status(500).json({ status: 'error', message: 'Internal server error' });
    }
};

export default register;