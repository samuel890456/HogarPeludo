const Rol = require('../models/rolesModel');

// Obtener todos los roles
exports.getAllRoles = async (req, res) => {
    try {
        const roles = await Rol.getAll();
        res.json(roles);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

// Obtener un rol por su ID
exports.getRolById = async (req, res) => {
    try {
        const rol = await Rol.getById(req.params.id);
        if (!rol) {
            return res.status(404).json({ message: 'Rol no encontrado' });
        }
        res.json(rol);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};