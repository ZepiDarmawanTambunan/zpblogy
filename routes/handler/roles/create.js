const Joi = require('joi');
const { Role } = require('../../../models');

const create = async (req, res) => {
    const schema = Joi.object({
        name: Joi.string().required(),
        status: Joi.number().integer().min(0).max(1).default(1)
    });

    try {
        const { error } = schema.validate(req.body);
        if (error) {
            return res.status(400).json({ status: 'error', message: error.details[0].message });
        }

        const newRole = await Role.create(req.body);

        return res.status(201).json({ status: 'success', data: newRole });
    } catch (error) {
        console.error(error);
        return res.status(500).json({ status: 'error', message: 'Internal server error' });
    }
};

module.exports = create;