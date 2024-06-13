import Joi from 'joi';
import bcrypt from 'bcrypt';
import User from '../../../models/User.js';

const updateUser = async (req, res) => {
    const { id } = req.params;

    // Skema validasi menggunakan Joi
    const schema = Joi.object({
        email: Joi.string().email(),
        username: Joi.string(),
        password: Joi.string().min(6),
        role_id: Joi.number().integer(),
        status: Joi.number().integer().min(0).max(1)
    });

    try {
        // Validasi input
        const { error } = schema.validate(req.body);
        if (error) {
            return res.status(400).json({ status: 'error', message: error.details[0].message });
        }

        // Cari user berdasarkan ID
        const user = await User.findByPk(id);
        if (!user) {
            return res.status(404).json({ status: 'error', message: 'User not found' });
        }

        // Hash password jika ada dalam request body
        if (req.body.password) {
            req.body.password = await bcrypt.hash(req.body.password, 10);
        }

        // Perbarui data user
        await user.update(req.body);

        return res.status(200).json({ status: 'success', data: user });
    } catch (error) {
        console.error(error);
        return res.status(500).json({ status: 'error', message: 'Internal server error' });
    }
};

export default updateUser;