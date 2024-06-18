const jwt = require('jsonwebtoken');
const { JWT_SECRET } = process.env;

const verifyToken = async (req, res, next) => {
    const authHeader = req.headers.authorization;

    
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
        return res.status(401).json({ message: 'Access token is missing or invalid' });
    }
    
    const token = authHeader.split(' ')[1]; // Ambil token dari header Authorization
    
    try {
        const decoded = jwt.verify(token, JWT_SECRET);
        req.user = decoded;
        next();
    } catch (error) {
        console.error(error);
        return res.status(403).json({ message: 'Token is invalid' });
    }
};

module.exports = verifyToken;