const db = require('../config/db');

class Seguimiento {
    // Crear un nuevo registro de seguimiento
    static async create(solicitud_id, comentarios) {
        const [result] = await db.query(
            'INSERT INTO seguimiento_adopcion (solicitud_id, comentarios) VALUES (?, ?)',
            [solicitud_id, comentarios]
        );
        return result.insertId;
    }

    // Obtener todos los registros de seguimiento de una solicitud
    static async getBySolicitudId(solicitud_id) {
        const [rows] = await db.query('SELECT * FROM seguimiento_adopcion WHERE solicitud_id = ?', [solicitud_id]);
        return rows;
    }

    // Obtener un registro de seguimiento por su ID
    static async getById(id) {
        const [rows] = await db.query('SELECT * FROM seguimiento_adopcion WHERE id = ?', [id]);
        return rows[0];
    }

    // Actualizar un registro de seguimiento
    static async update(id, comentarios) {
        await db.query('UPDATE seguimiento_adopcion SET comentarios = ? WHERE id = ?', [comentarios, id]);
    }

    // Eliminar un registro de seguimiento
    static async delete(id) {
        await db.query('DELETE FROM seguimiento_adopcion WHERE id = ?', [id]);
    }
}

module.exports = Seguimiento;