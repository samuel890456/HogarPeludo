//backend/controllers/authController.js
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const Usuario = require('../models/usuariosModel');

// Registro de un nuevo usuario
exports.registrarUsuario = async (req, res) => {
    try {
        const { nombre, email, contraseña, telefono, direccion } = req.body;

        const usuarioExistente = await Usuario.getByEmail(email);
        if (usuarioExistente) {
            return res.status(400).json({ message: 'El correo electrónico ya está registrado' });
        }

        const hashedPassword = await bcrypt.hash(contraseña, 10);

        // Crear el usuario sin rol_id en la tabla usuarios
        const id = await Usuario.create(nombre, email, hashedPassword, telefono, direccion);

        // Asignar los roles por defecto (ej: 'publicador' y 'adoptante')
        const defaultRoles = ['2', '3']; // IDs de los roles 'publicador' y 'adoptante'
        for (const rolId of defaultRoles) {
            await Usuario.assignRole(id, rolId);
        }

        // Obtener los roles del usuario recién creado para el token
        const userRoles = await Usuario.getUserRoles(id); 

        // Generar un token JWT con el ARRAY de roles
        const token = jwt.sign({ id, email, roles: userRoles }, process.env.JWT_SECRET, { expiresIn: '1h' });

        res.status(201).json({ id, nombre, email, token, roles: userRoles });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

// Inicio de sesión de un usuario
exports.iniciarSesion = async (req, res) => {
    try {
        const { email, contraseña } = req.body;

        // Usa el nuevo método para obtener usuario con roles
        const usuario = await Usuario.getByEmailWithRoles(email); 
        if (!usuario) {
            return res.status(400).json({ message: 'Credenciales incorrectas' });
        }
        if (usuario.activo === 0 || usuario.estado === 'bloqueado') {
            return res.status(403).json({ message: 'Tu cuenta está bloqueada. Contacta al administrador.' });
        }
        const contraseñaValida = await bcrypt.compare(contraseña, usuario.contraseña);
        if (!contraseñaValida) {
            return res.status(400).json({ message: 'Credenciales incorrectas' });
        }

        // Asegúrate de que `usuario.roles` sea un array de strings de IDs de rol
        const userRoles = usuario.roles || [];

        // Generar un token JWT con el ARRAY de roles
        const token = jwt.sign({ id: usuario.id, email: usuario.email, roles: userRoles }, process.env.JWT_SECRET, { expiresIn: '1h' });

        // Devolver la respuesta con el token y el ARRAY de roles
        res.json({ id: usuario.id, nombre: usuario.nombre, email: usuario.email, token, roles: userRoles });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

// Middleware para verificar el token JWT
exports.verificarToken = (req, res, next) => {
    const token = req.header('Authorization')?.replace('Bearer ', '');

    if (!token) {
        return res.status(401).json({ message: 'Acceso denegado. Token no proporcionado.' });
    }

    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        req.usuario = decoded; // Añadir el usuario decodificado a la solicitud
        next();
    } catch (error) {
        res.status(400).json({ message: 'Token inválido.' });
    }
};