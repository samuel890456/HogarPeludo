//backend/controllers/authController.js
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const Usuario = require('../models/usuariosModel');

// Registro de un nuevo usuario
exports.registrarUsuario = async (req, res) => {
    try {
        const { nombre, email, contraseña, telefono, direccion} = req.body;

        // Verificar si el usuario ya existe
        const usuarioExistente = await Usuario.getByEmail(email);
        if (usuarioExistente) {
            return res.status(400).json({ message: 'El correo electrónico ya está registrado' });
        }

        // Hash de la contraseña
        const hashedPassword = await bcrypt.hash(contraseña, 10);

         // Asignar automáticamente el rol_id = 2 (usuario)
        const rol_id = 2;

        // Crear el usuario en la base de datos
        const id = await Usuario.create(nombre, email, hashedPassword, telefono, direccion, rol_id);

        // Generar un token JWT
        const token = jwt.sign({ id, email, rol_id }, process.env.JWT_SECRET, { expiresIn: '1h' });

        // Devolver la respuesta con el token
        res.status(201).json({ id, nombre, email, token });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

// Inicio de sesión de un usuario
exports.iniciarSesion = async (req, res) => {
    try {
        const { email, contraseña } = req.body;

        // Verificar si el usuario existe
        const usuario = await Usuario.getByEmail(email);
        if (!usuario) {
            return res.status(400).json({ message: 'Credenciales incorrectas' });
        }

        // Verificar la contraseña
        const contraseñaValida = await bcrypt.compare(contraseña, usuario.contraseña);
        if (!contraseñaValida) {
            return res.status(400).json({ message: 'Credenciales incorrectas' });
        }

        // Generar un token JWT
        const token = jwt.sign({ id: usuario.id, email: usuario.email, rol_id: usuario.rol_id }, process.env.JWT_SECRET, { expiresIn: '1h' });

        // Devolver la respuesta con el token
        res.json({ id: usuario.id, nombre: usuario.nombre, email: usuario.email, token });
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