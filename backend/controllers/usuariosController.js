const Usuario = require('../models/usuariosModel');
const bcrypt = require('bcrypt');

// Registrar un nuevo usuario
exports.registrarUsuario = async (req, res) => {
    try {
        const { nombre, email, contraseña, telefono, direccion, rol_id } = req.body;

        // Hash de la contraseña
        const hashedPassword = await bcrypt.hash(contraseña, 10);

        const id = await Usuario.create(nombre, email, hashedPassword, telefono, direccion, rol_id);
        res.status(201).json({ id, nombre, email, telefono, direccion, rol_id });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

// Obtener un usuario por su ID
exports.getUsuarioById = async (req, res) => {
    try {
        const usuario = await Usuario.getById(req.params.id);
        if (!usuario) {
            return res.status(404).json({ message: 'Usuario no encontrado' });
        }
        res.json(usuario);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

// Actualizar un usuario existente
exports.updateUsuario = async (req, res) => {
    try {
        const { nombre, email, telefono, direccion } = req.body;
        await Usuario.update(req.params.id, nombre, email, telefono, direccion);
        res.json({ message: 'Usuario actualizado correctamente' });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};