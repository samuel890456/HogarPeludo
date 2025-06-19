const jwt = require('jsonwebtoken');
const Usuario = require('../models/usuariosModel'); // Make sure this path is correct
require('dotenv').config();

// Middleware to verify the JWT token
const verificarToken = async (req, res, next) => {
    try {
        const token = req.header('Authorization')?.replace('Bearer ', '');

        if (!token) {
            return res.status(401).json({ message: 'Acceso denegado. Token no proporcionado.' });
        }

        // Verify and decode the token
        const decoded = jwt.verify(token, process.env.JWT_SECRET);

        // Fetch the user from the database. Use getByEmailWithRoles to get their associated roles
        const usuario = await Usuario.getByEmailWithRoles(decoded.email); // Fetch by email to get roles

        if (!usuario) {
            return res.status(404).json({ message: 'Usuario no encontrado.' });
        }
        if (usuario.estado === 'bloqueado' || usuario.activo === 0) {
            return res.status(403).json({ message: 'Cuenta desactivada. Contacta con un administrador.' });
        }

        // Attach user data (including roles) to the request object
        req.usuario = {
            id: usuario.id,
            email: usuario.email,
            nombre: usuario.nombre,
            telefono: usuario.telefono,
            direccion: usuario.direccion,
            estado: usuario.estado,
            activo: usuario.activo,
            // Crucial: Pass the array of roles
            roles: usuario.roles || [] 
        };
        console.log('Usuario autenticado:', req.usuario);

        next();
    } catch (error) {
        console.error('Error en verificarToken:', error.message);
        res.status(400).json({ message: 'Token inválido o expirado.' });
    }
};

// Middleware to verify if the user is an administrator
const verificarAdmin = (req, res, next) => {
    // Check if the 'roles' array includes the admin role ID ('1')
    if (!req.usuario.roles || !req.usuario.roles.includes('1')) { 
        return res.status(403).json({ message: 'Acceso denegado. Se requieren privilegios de administrador.' });
    }
    console.log('Roles del usuario:', req.usuario.roles);

    next();
};

module.exports = { verificarToken, verificarAdmin };