const Usuario = require('../models/usuariosModel');
const bcrypt = require('bcrypt');
const fs = require('fs');
const path = require('path');

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
        const userId = req.params.id; // ID del usuario a actualizar
        const { nombre, email, telefono, direccion, biografia, notificarEmail, notificarWeb, clear_foto_perfil } = req.body;
        let foto_perfil_url = null;

        // Si hay un archivo de imagen subido
        if (req.file) {
            foto_perfil_url = req.file.filename; // Multer guarda el nombre del archivo
        } else if (clear_foto_perfil === 'true') {
            // Si se solicita eliminar la foto existente
            const currentUser = await Usuario.getById(userId);
            if (currentUser && currentUser.foto_perfil_url) {
                const oldImagePath = path.join(__dirname, '..', 'uploads', currentUser.foto_perfil_url);
                if (fs.existsSync(oldImagePath)) {
                    fs.unlinkSync(oldImagePath); // Eliminar el archivo físico
                }
            }
            foto_perfil_url = null; // Establecer la URL a NULL en la DB
        } else {
            // Mantener la foto existente si no se sube una nueva ni se elimina
            const currentUser = await Usuario.getById(userId);
            foto_perfil_url = currentUser ? currentUser.foto_perfil_url : null;
        }

        await Usuario.update(
            userId, 
            nombre, 
            email, 
            telefono, 
            direccion, 
            biografia, 
            foto_perfil_url, 
            clear_foto_perfil === 'true', // Pasar como booleano
            notificarEmail === 'true', // Convertir a booleano
            notificarWeb === 'true' // Convertir a booleano
        );

        // Obtener el usuario actualizado para devolverlo en la respuesta
        const updatedUser = await Usuario.getById(userId);
        res.json({ message: 'Perfil actualizado correctamente', user: updatedUser });
    } catch (error) {
        console.error('Error al actualizar el usuario:', error);
        res.status(500).json({ message: 'Error interno del servidor al actualizar el perfil.' });
    }
};

// Cambiar contraseña
exports.changePassword = async (req, res) => {
    try {
        const userId = req.params.id; // ID del usuario
        const { currentPassword, newPassword } = req.body;

        const user = await Usuario.getById(userId);
        if (!user) {
            return res.status(404).json({ message: 'Usuario no encontrado.' });
        }

        const isMatch = await bcrypt.compare(currentPassword, user.contraseña);
        if (!isMatch) {
            return res.status(400).json({ message: 'La contraseña actual es incorrecta.' });
        }

        if (newPassword.length < 6) {
            return res.status(400).json({ message: 'La nueva contraseña debe tener al menos 6 caracteres.' });
        }

        const hashedNewPassword = await bcrypt.hash(newPassword, 10);
        await Usuario.updatePassword(userId, hashedNewPassword);

        res.status(200).json({ message: 'Contraseña actualizada con éxito.' });
    } catch (error) {
        console.error('Error al cambiar la contraseña:', error);
        res.status(500).json({ message: 'Error interno del servidor al cambiar la contraseña.' });
    }
};

// Solicitar cambio de rol a Refugio
exports.requestRoleChange = async (req, res) => {
    try {
        const userId = req.params.id; // ID del usuario
        const { motivacion } = req.body;

        if (!motivacion || motivacion.length < 10) {
            return res.status(400).json({ message: 'La motivación debe tener al menos 10 caracteres.' });
        }

        // Registrar la solicitud en la nueva tabla
        const db = require('../config/db');
        await db.query(
            'INSERT INTO solicitudes_cambio_rol (usuario_id, rol_solicitado, estado, fecha_solicitud, comentario) VALUES (?, ?, ?, NOW(), ?)',
            [userId, 'refugio', 'pendiente', motivacion]
        );

        res.status(200).json({ message: 'Solicitud de cambio de rol enviada con éxito. Será revisada por un administrador.' });
    } catch (error) {
        console.error('Error al solicitar cambio de rol:', error);
        res.status(500).json({ message: 'Error interno del servidor al procesar la solicitud de cambio de rol.' });
    }
};

// Eliminar un usuario
exports.eliminarUsuario = async (req, res) => {
    try {
        const userId = req.params.id; // El ID viene de los parámetros de la ruta
        
        // Opcional: Verificar que el usuario que hace la petición es el mismo que se va a eliminar o es un admin
        if (req.usuario.id !== parseInt(userId) && !req.usuario.roles.includes('admin')) {
            return res.status(403).json({ message: 'No tienes permiso para eliminar esta cuenta.' });
        }

        // Obtener información del usuario para eliminar su foto de perfil si existe
        const userToDelete = await Usuario.getById(userId);
        if (userToDelete && userToDelete.foto_perfil_url) {
            const imagePath = path.join(__dirname, '..', 'uploads', userToDelete.foto_perfil_url);
            if (fs.existsSync(imagePath)) {
                fs.unlinkSync(imagePath); // Eliminar el archivo físico
            }
        }

        await Usuario.delete(userId);
        res.json({ message: 'Cuenta eliminada correctamente' });
    } catch (error) {
        console.error('Error al eliminar el usuario:', error);
        res.status(500).json({ message: 'Error interno del servidor al eliminar la cuenta.' });
    }
};

// Obtener solicitudes de cambio de rol pendientes
exports.getPendingRoleRequests = async (req, res) => {
    try {
        const requests = await Usuario.getPendingRoleRequests();
        res.json(requests);
    } catch (error) {
        console.error('Error al obtener solicitudes de rol pendientes:', error);
        res.status(500).json({ message: 'Error interno del servidor al obtener solicitudes de rol.' });
    }
};

// Aprobar solicitud de cambio de rol
exports.approveRoleRequest = async (req, res) => {
    try {
        const { userId } = req.params;
        const db = require('../config/db');
        // Asignar el rol de 'refugio' (ID 3) al usuario
        await db.query('INSERT INTO usuario_roles (usuario_id, rol_id) VALUES (?, ?) ON DUPLICATE KEY UPDATE rol_id = VALUES(rol_id)', [userId, 3]);
        // Actualizar el estado de la solicitud a 'aprobada'
        await db.query('UPDATE solicitudes_cambio_rol SET estado = ?, fecha_respuesta = NOW(), admin_id = ? WHERE usuario_id = ? AND estado = ? ORDER BY fecha_solicitud DESC LIMIT 1', ['aprobada', req.usuario.id, userId, 'pendiente']);
        res.status(200).json({ message: 'Solicitud de rol aprobada y rol asignado con éxito.' });
    } catch (error) {
        console.error('Error al aprobar solicitud de rol:', error);
        res.status(500).json({ message: 'Error interno del servidor al aprobar la solicitud de rol.' });
    }
};

// Rechazar solicitud de cambio de rol
exports.rejectRoleRequest = async (req, res) => {
    try {
        const { userId } = req.params;
        const db = require('../config/db');
        // Actualizar el estado de la solicitud a 'rechazada'
        await db.query('UPDATE solicitudes_cambio_rol SET estado = ?, fecha_respuesta = NOW(), admin_id = ? WHERE usuario_id = ? AND estado = ? ORDER BY fecha_solicitud DESC LIMIT 1', ['rechazada', req.usuario.id, userId, 'pendiente']);
        res.status(200).json({ message: 'Solicitud de rol rechazada con éxito.' });
    } catch (error) {
        console.error('Error al rechazar solicitud de rol:', error);
        res.status(500).json({ message: 'Error interno del servidor al rechazar la solicitud de rol.' });
    }
};