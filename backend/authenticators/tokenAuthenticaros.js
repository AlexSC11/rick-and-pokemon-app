const jwt = require('jsonwebtoken');

const authenticateToken = (req, res, next) => {
    const token = req.cookies.token;
    if (!token) return res.sendStatus(401);

    jwt.verify(token, process.env.SECRET_KEY, (error, user) => {
        if (error) {
            console.log(error);
            return res.status(401).json({ error: 'Token expired' });
        }
        req.user = user;
        next();
    });
};

module.exports = authenticateToken;
