// backend/models/notificacionesModel.js
const db = require('../config/db');

class Notificacion {

    static async getById(id) {
        try {
            const [rows] = await db.query('SELECT * FROM notificaciones WHERE id = ?', [id]);
            return rows;
        } catch (error) {
            console.error('Error en Notificacion.getById:', error);
            throw error;
        }
    }
    static async create(usuario_id, tipo, mensaje, enlace = null) {
        try {
            const [result] = await db.query(
                'INSERT INTO notificaciones (usuario_id, tipo, mensaje, enlace) VALUES (?, ?, ?, ?)',
                [usuario_id, tipo, mensaje, enlace]
            );
            return { id: result.insertId };
        } catch (error) {
            console.error('Error en Notificacion.create:', error);
            throw error;
        }
    }

    static async getUnreadByUserId(userId) {
        try {
            const [rows] = await db.query(
                'SELECT * FROM notificaciones WHERE usuario_id = ? AND leida = FALSE ORDER BY fecha_creacion DESC',
                [userId]
            );
            return rows;
        } catch (error) {
            console.error('Error en Notificacion.getUnreadByUserId:', error);
            throw error;
        }
    }

    static async markAsRead(notificationId) {
        try {
            const [result] = await db.query(
                'UPDATE notificaciones SET leida = TRUE WHERE id = ?',
                [notificationId]
            );
            return result.affectedRows > 0;
        } catch (error) {
            console.error('Error en Notificacion.markAsRead:', error);
            throw error;
        }
    }
    static async getByUserId(userId) {
        try {
            const [rows] = await db.query(
                'SELECT * FROM notificaciones WHERE usuario_id = ? ORDER BY fecha_creacion DESC',
                [userId]
            );
            return rows;
        } catch (error) {
            console.error('Error en Notificacion.getByUserId:', error);
            throw error;
        }
    }

    static async markAllAsRead(userId) {
        try {
            const [result] = await db.query(
                'UPDATE notificaciones SET leida = TRUE WHERE usuario_id = ? AND leida = FALSE',
                [userId]
            );
            return result.affectedRows;
        } catch (error) {
            console.error('Error en Notificacion.markAllAsRead:', error);
            throw error;
        }
    }

    static async deleteNotification(notificationId, userId) {
        // Asegúrate de que el usuario solo pueda eliminar sus propias notificaciones
        try {
            const [result] = await db.query(
                'DELETE FROM notificaciones WHERE id = ? AND usuario_id = ?',
                [notificationId, userId]
            );
            return result.affectedRows > 0;
        } catch (error) {
            console.error('Error en Notificacion.deleteNotification:', error);
            throw error;
        }
    }
    

}



module.exports = Notificacion;