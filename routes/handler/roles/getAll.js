import Role from '../../../models/Role.js';
import { Op } from 'sequelize';

const getAll = async (req, res) => {
    let { status, name } = req.query;

    status = status ? status.trim() : null;
    name = name ? name.trim() : null;

    try {
        let roles;

        if (!status && !name) {
            roles = await Role.findAll();
        } else {
            const whereConditions = {};

            if (status) {
                whereConditions.status = status;
            }

            if (name) {
                whereConditions.name = { [Op.like]: `%${name}%` };
            }

            console.log(whereConditions);

            roles = await Role.findAll({ where: whereConditions });
        }

        return res.status(200).json({ status: 'success', data: roles });
    } catch (error) {
        console.error(error);
        return res.status(500).json({ status: 'error', message: 'Internal server error' });
    }
};

export default getAll;