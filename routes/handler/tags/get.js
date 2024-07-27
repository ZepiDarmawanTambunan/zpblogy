'use strict';

const { Tag } = require('../../../models');

const get = async (req, res) => {
    const { id } = req.params;

    try {
        // Cari tag berdasarkan ID
        const tag = await Tag.findByPk(id);

        if (!tag) {
            return res.status(404).json({ status: 'error', message: 'Tag not found' });
        }

        return res.status(200).json({ status: 'success', data: tag });
    } catch (error) {
        console.error(error);
        return res.status(500).json({ status: 'error', message: 'Internal server error' });
    }
};

module.exports = get;