//backend/models/solicitudesModel.js
const db = require('../config/db');

class Solicitud {
    static async getAll() {
        const [rows] = await db.query('SELECT * FROM solicitudes_adopcion');
        return rows;
    }
    static async count() {
        const [rows] = await db.query('SELECT COUNT(*) AS total FROM solicitudes_adopcion');
        return rows[0].total;
    }
    
    // Crear una nueva solicitud de adopción
    static async create(usuario_id, mascota_id, comentarios) {
        const [result] = await db.query(
            'INSERT INTO solicitudes_adopcion (usuario_id, mascota_id, comentarios) VALUES (?, ?, ?)',
            [usuario_id, mascota_id, comentarios]
        );
        return result.insertId;
    }

    // Obtener todas las solicitudes de un usuario
    static async getByUsuarioId(usuario_id) {
        const [rows] = await db.query('SELECT * FROM solicitudes_adopcion WHERE usuario_id = ?', [usuario_id]);
        return rows;
    }

    // Obtener una solicitud por su ID
    static async getById(id) {
        const [rows] = await db.query('SELECT * FROM solicitudes_adopcion WHERE id = ?', [id]);
        return rows[0];
    }

    // Actualizar el estado de una solicitud
    static async updateEstado(id, estado) {
        await db.query('UPDATE solicitudes_adopcion SET estado = ? WHERE id = ?', [estado, id]);
    }

    // Eliminar una solicitud
    static async delete(id) {
        await db.query('DELETE FROM solicitudes_adopcion WHERE id = ?', [id]);
    }
}

module.exports = Solicitud;