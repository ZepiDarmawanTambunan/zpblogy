'use strict';

const Joi = require('joi');
const { Tag } = require('../../../models');

const update = async (req, res) => {
    const { id } = req.params;

    const schema = Joi.object({
        name: Joi.string().optional(),
        status: Joi.number().integer().min(0).max(1).optional()
    });

    try {
        const { error } = schema.validate(req.body);
        if (error) {
            return res.status(400).json({ status: 'error', message: error.details[0].message });
        }

        // Cari tag berdasarkan ID
        const tag = await Tag.findByPk(id);
        if (!tag) {
            return res.status(404).json({ status: 'error', message: 'Tag not found' });
        }

        // Update tag dengan data baru
        await tag.update(req.body);

        return res.status(200).json({ status: 'success', data: tag });
    } catch (error) {
        console.error(error);
        return res.status(500).json({ status: 'error', message: 'Internal server error' });
    }
};

module.exports = update;