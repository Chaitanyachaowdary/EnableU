const jwt = require('jsonwebtoken');

const authenticateToken = (req, res, next) => {
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1];

    if (!token) return res.status(401).json({ message: 'Authentication required' });

    jwt.verify(token, process.env.JWT_SECRET || 'super-secret', (err, user) => {
        if (err) return res.status(403).json({ message: 'Invalid or expired token' });

        // senior best practice: Normalize identity across backends
        // Flask-JWT-Extended uses 'sub', jsonwebtoken uses decoded payload directly
        req.user = {
            ...user,
            id: user.id || user.sub,
            role: user.role || 'user' // Default to user if not present in token
        };
        next();
    });
};

const authorizeRole = (role) => {
    return (req, res, next) => {
        if (req.user.role !== role && req.user.role !== 'admin') {
            return res.status(403).json({ message: 'Access denied' });
        }
        next();
    };
};

module.exports = { authenticateToken, authorizeRole };
