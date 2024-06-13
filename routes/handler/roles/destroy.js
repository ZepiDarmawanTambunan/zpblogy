import Role from '../../../models/Role.js';

const destroy = async (req, res) => {
    const roleId = req.params.id;

    try {
        // Mencari role berdasarkan ID yang diberikan
        const role = await Role.findByPk(roleId);

        if (!role) {
            return res.status(404).json({ status: 'error', message: 'Role not found' });
        }

        // Menghapus role berdasarkan ID
        await Role.destroy({ where: { id: roleId } });

        return res.status(200).json({ status: 'success', message: 'Role deleted successfully' });
    } catch (error) {
        console.error(error);
        return res.status(500).json({ status: 'error', message: 'Internal server error' });
    }
};

export default destroy;