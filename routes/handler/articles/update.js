const Joi = require('joi');
const Article = require('../../../models/Article.js');

const update = async (req, res) => {
    const { id } = req.params;

    // Skema validasi menggunakan Joi
    const schema = Joi.object({
        title: Joi.string().optional(),
        content: Joi.string().optional(),
        status: Joi.string().optional(),
        image: Joi.string().optional()
    });

    try {
        // Validasi input
        const { error } = schema.validate(req.body);
        if (error) {
            return res.status(400).json({ status: 'error', message: error.details[0].message });
        }

        // Cari artikel berdasarkan ID
        const article = await Article.findByPk(id);
        if (!article) {
            return res.status(404).json({ status: 'error', message: 'Article not found' });
        }

        // Perbarui artikel
        await article.update(req.body);

        return res.status(200).json({ status: 'success', data: article });
    } catch (error) {
        console.error(error);
        return res.status(500).json({ status: 'error', message: 'Internal server error' });
    }
};

module.exports = update;