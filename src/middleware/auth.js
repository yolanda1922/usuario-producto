const jwt = require('jsonwebtoken');

module.exports = (req, res, next) => {
    // Buscar el token en cookies o en el header de autorización
    let token = req.cookies.token;
    
    // Si no está en cookies, buscar en el header Authorization
    if (!token && req.headers.authorization) {
        const authHeader = req.headers.authorization;
        if (authHeader.startsWith('Bearer ')) {
            token = authHeader.slice(7); // Remover "Bearer " del inicio
        }
    }
    
    if (!token) return res.status(401).json({ message: 'Token no proporcionado' });
    try {
        const openToken = jwt.verify(token, process.env.JWT_SECRET);
        req.user = openToken.usuario;
        next();
    } catch (error) {
        return res.status(401).json({ message: 'Token invalido' });
    }
};
