import Joi from 'joi';
import Role from '../../../models/Role.js';

// Fungsi untuk mengupdate data role
const update = async (req, res) => {
    const schema = Joi.object({
        name: Joi.string(),
        status: Joi.number().integer().min(0).max(1)
    }).min(1); // Setidaknya satu field harus ada untuk update

    try {
        const { error } = schema.validate(req.body);
        if (error) {
            return res.status(400).json({ status: 'error', message: error.details[0].message });
        }

        // Cek apakah role dengan ID yang diberikan ada di database
        const existingRole = await Role.findByPk(req.params.id);
        if (!existingRole) {
            return res.status(404).json({ status: 'error', message: 'Role not found' });
        }

        // Lakukan update data role
        await Role.update(req.body, {
            where: { id: req.params.id }
        });

        // Ambil data role yang sudah diupdate dari database
        const updatedRole = await Role.findByPk(req.params.id);

        return res.status(200).json({ status: 'success', data: updatedRole });
    } catch (error) {
        console.error(error);
        return res.status(500).json({ status: 'error', message: 'Internal server error' });
    }
};

export default update;