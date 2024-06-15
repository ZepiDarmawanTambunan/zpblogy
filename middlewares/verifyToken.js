const jwt = require('jsonwebtoken');
const { JWT_SECRET } = process.env;

const verifyToken = async (req, res, next) => {
    const token = req.headers.authorization;

    if (!token) {
        return res.status(401).json({ message: 'Access token is missing or invalid' });
    }

    jwt.verify(token, JWT_SECRET, (err, decoded) => {
        if (err) {
            return res.status(403).json({ message: err.message });
        }

        req.user = decoded;
        next();
    });
};

module.exports = verifyToken;