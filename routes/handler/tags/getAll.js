'use strict';

const { Tag } = require('../../../models');

const getAll = async (req, res) => {
    try {
        // Ambil semua tag dari database
        const tags = await Tag.findAll();

        return res.status(200).json({ status: 'success', data: tags });
    } catch (error) {
        console.error(error);
        return res.status(500).json({ status: 'error', message: 'Internal server error' });
    }
};

module.exports = getAll;