'use strict';

const Joi = require('joi');
const { Tag } = require('../../../models');

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

        // Cek apakah name sudah ada di dalam tabel Tag
        const existingTag = await Tag.findOne({ where: { name: req.body.name } });
        if (existingTag) {
            return res.status(200).json({ status: 'success', data: existingTag, message: 'Tag already exists' });
        }

        const newTag = await Tag.create(req.body);

        return res.status(201).json({ status: 'success', data: newTag });
    } catch (error) {
        console.error(error);
        return res.status(500).json({ status: 'error', message: 'Internal server error' });
    }
};

module.exports = create;