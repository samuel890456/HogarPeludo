const Usuario = require('../models/usuariosModel');
const bcrypt = require('bcrypt');

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

// Eliminar un usuario
exports.eliminarUsuario = async (req, res) => {
    try {
        const userId = req.usuario.id;
        await Usuario.delete(userId);
        res.json({ message: 'Cuenta eliminada correctamente' });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};