//backend/middlewares/authMiddleware.js
const jwt = require('jsonwebtoken');
const Usuario = require('../models/usuariosModel');
require('dotenv').config();

// Middleware para verificar el token JWT
const verificarToken = async (req, res, next) => {
    try {
        // Obtener el token del encabezado de la solicitud
        const token = req.header('Authorization')?.replace('Bearer ', '');

        // Si no hay token, devolver un error
        if (!token) {
            return res.status(401).json({ message: 'Acceso denegado. Token no proporcionado.' });
        }

        // Verificar y decodificar el token
        const decoded = jwt.verify(token, process.env.JWT_SECRET);

        // Buscar el usuario en la base de datos
        const usuario = await Usuario.getById(decoded.id);

        // Verificar si el usuario existe y está activo
        if (!usuario) {
            return res.status(404).json({ message: 'Usuario no encontrado.' });
        }
        if (!usuario || usuario.estado === 'bloqueado' || usuario.activo === 0) { // Si el usuario está desactivado
            return res.status(403).json({ message: 'Cuenta desactivada. Contacta con un administrador.' });
        }

        // Añadir el usuario a la solicitud para que esté disponible en las siguientes funciones
        req.usuario = usuario;
        console.log('Usuario autenticado:', usuario); // <-- Agrega esto

        next();
    } catch (error) {
        res.status(400).json({ message: 'Token inválido o expirado.' });
    }
};

// Middleware para verificar si el usuario es un administrador
const verificarAdmin = (req, res, next) => {
    if (req.usuario.rol_id !== 1) { // Suponiendo que el rol_id 1 es para administradores
        return res.status(403).json({ message: 'Acceso denegado. Se requieren privilegios de administrador.' });
    }
    console.log('Rol del usuario:', req.usuario.rol_id); // <-- Y esto también

    next();
};

module.exports = { verificarToken, verificarAdmin };
