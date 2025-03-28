const jwt = require('jsonwebtoken');

// Middleware para verificar el token JWT
const verificarToken = (req, res, next) => {
    // Obtener el token del encabezado de la solicitud
    const token = req.header('Authorization')?.replace('Bearer ', '');

    // Si no hay token, devolver un error
    if (!token) {
        return res.status(401).json({ message: 'Acceso denegado. Token no proporcionado.' });
    }

    try {
        // Verificar y decodificar el token
        const decoded = jwt.verify(token, process.env.JWT_SECRET);

        // Añadir el usuario decodificado a la solicitud
        req.usuario = decoded;

        // Continuar con el siguiente middleware o controlador
        next();
    } catch (error) {
        // Si el token es inválido, devolver un error
        res.status(400).json({ message: 'Token inválido.' });
    }
};

// Middleware para verificar si el usuario es un administrador
const verificarAdmin = (req, res, next) => {
    // Verificar si el usuario tiene el rol de administrador
    if (req.usuario.rol_id !== 1) { // Suponiendo que el rol_id 1 es para administradores
        return res.status(403).json({ message: 'Acceso denegado. Se requieren privilegios de administrador.' });
    }

    // Continuar con el siguiente middleware o controlador
    next();
};

module.exports = { verificarToken, verificarAdmin };