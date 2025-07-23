// backend/controllers/notificacionesController.js
const Notificacion = require('../models/notificacionesModel');

const notificacionesController = {
    getUnreadNotifications: async (req, res) => {
        try {
            const userId = req.usuario.id;
            const notifications = await Notificacion.getUnreadByUserId(userId);
            res.status(200).json(notifications);
        } catch (error) {
            console.error('Error al obtener notificaciones no leídas:', error);
            res.status(500).json({ message: 'Error interno del servidor al obtener notificaciones.' });
        }
    },

    markNotificationAsRead: async (req, res) => {
        try {
            const { id } = req.params;
            const userId = req.usuario.id; // Para asegurar que el usuario solo pueda marcar sus propias notificaciones

            const notifications = await Notificacion.getById(id); // getById devuelve un array
            const notification = notifications[0]; // Tomar el primer elemento
            if (!notification || notification.usuario_id !== userId) {
                return res.status(403).json({ message: 'No autorizado para marcar esta notificación como leída.' });
            }

            const updated = await Notificacion.markAsRead(id);
            if (updated) {
                res.status(200).json({ message: 'Notificación marcada como leída.' });
            } else {
                res.status(404).json({ message: 'Notificación no encontrada.' });
            }
        } catch (error) {
            console.error('Error al marcar notificación como leída:', error);
            res.status(500).json({ message: 'Error interno del servidor al marcar notificación como leída.' });
        }
    },

    // Nuevo: Obtener TODAS las notificaciones de un usuario
    getAllNotifications: async (req, res) => {
        try {
            const userId = req.usuario.id;
            const notifications = await Notificacion.getByUserId(userId);
            res.status(200).json(notifications);
        } catch (error) {
            console.error('Error al obtener todas las notificaciones:', error);
            res.status(500).json({ message: 'Error interno del servidor al obtener todas las notificaciones.' });
        }
    },

    // Nuevo: Marcar TODAS las notificaciones de un usuario como leídas
    markAllNotificationsAsRead: async (req, res) => {
        try {
            const userId = req.usuario.id;
            const affectedRows = await Notificacion.markAllAsRead(userId);
            res.status(200).json({ message: `${affectedRows} notificaciones marcadas como leídas.`, affectedRows });
        } catch (error) {
            console.error('Error al marcar todas las notificaciones como leídas:', error);
            res.status(500).json({ message: 'Error interno del servidor al marcar todas las notificaciones como leídas.' });
        }
    },

    // Nuevo: Eliminar una notificación específica
    deleteNotification: async (req, res) => {
        try {
            const { id } = req.params; // ID de la notificación a eliminar
            const userId = req.usuario.id; // ID del usuario autenticado

            const deleted = await Notificacion.deleteNotification(id, userId);
            if (deleted) {
                res.status(200).json({ message: 'Notificación eliminada exitosamente.' });
            } else {
                // Puede ser que no se encontró o que el usuario no era el dueño
                res.status(404).json({ message: 'Notificación no encontrada o no autorizado para eliminarla.' });
            }
        } catch (error) {
            console.error('Error al eliminar notificación:', error);
            res.status(500).json({ message: 'Error interno del servidor al eliminar notificación.' });
        }
    },

};

module.exports = notificacionesController;