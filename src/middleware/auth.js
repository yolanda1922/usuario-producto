const jwt = require('jsonwebtoken');

module.exports = (req, res, next) => {
    const { authorization } = req.headers;
    if (!authorization) return res.status(401).json({ message: 'Token no proporcionado' });
    try {
        const [type, token] = authorization.split(' ');
        if (type !== 'Bearer' || !token) {
            return res.status(401).json({ message: 'Token no proporcionado' });
        }
        const openToken = jwt.verify(token, process.env.JWT_SECRET);
        req.user = openToken.usuario;
        next();
    } catch (error) {
        return res.status(401).json({ message: 'Token invalido' });
    }
};
