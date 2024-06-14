import Article from '../../../models/Article.js';
import User from '../../../models/User.js';

const get = async (req, res) => {
    const { id } = req.params;

    try {
        const article = await Article.findOne({
            where: { id },
            include: {
                model: User,
                attributes: ['username', 'email']
            }
        });

        if (!article) {
            return res.status(404).json({ status: 'error', message: 'Article not found' });
        }

        return res.status(200).json({ status: 'success', data: article });
    } catch (error) {
        console.error(error);
        return res.status(500).json({ status: 'error', message: 'Internal server error' });
    }
};

export default get;