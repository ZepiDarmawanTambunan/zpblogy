const { User, Role } = require('../../../models');

const getUser = async (req, res) => {
    const { id } = req.params;

    try {
        // Cari user berdasarkan ID
        const user = await User.findOne({ 
            where: { id },
            include: {
                model: Role,
                attributes: ['name']
            }
        });

        if (!user) {
            return res.status(404).json({ status: 'error', message: 'User not found' });
        }

        return res.status(200).json({ status: 'success', data: user });
    } catch (error) {
        console.error(error);
        return res.status(500).json({ status: 'error', message: 'Internal server error' });
    }
};

module.exports = getUser;