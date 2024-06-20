const { Role } = require('../../../models');

const getById = async (req, res) => {
    const roleId = req.params.id;

    try {
        const role = await Role.findByPk(roleId);

        if (!role) {
            return res.status(404).json({ status: 'error', message: 'Role not found' });
        }

        return res.status(200).json({ status: 'success', data: role });
    } catch (error) {
        console.error(error);
        return res.status(500).json({ status: 'error', message: 'Internal server error' });
    }
};

module.exports = getById;