// File: backend/models/solicitudesModel.js
const db = require('../config/db');

class Solicitud {
    // Obtener todas las solicitudes (posiblemente solo para administradores o para el publicador de la mascota)
    static async getAll(searchTerm = '', estado = '', especie = '') {
    try {
        let query = `
            SELECT
                a.id,
                a.fecha_solicitud,
                a.estado,
                a.motivo,
                m.id AS mascota_id,
                m.nombre AS mascota_nombre,
                m.especie AS mascota_especie,
                m.imagen_url AS mascota_imagen_url,
                m.ubicacion AS mascota_ubicacion,
                u.id AS adoptante_id,
                u.nombre AS adoptante_nombre,
                u.email AS adoptante_email,
                u.telefono AS adoptante_telefono,
                u_publicador.id AS publicador_id,
                u_publicador.nombre AS publicador_nombre,
                u_publicador.email AS publicador_email
            FROM adopciones a
            JOIN mascotas m ON a.mascota_id = m.id
            JOIN usuarios u ON a.adoptante_id = u.id
            JOIN usuarios u_publicador ON m.publicado_por_id = u_publicador.id
            WHERE 1=1
        `;
        const params = [];

        if (searchTerm) {
            query += ' AND (m.nombre LIKE ? OR u.nombre LIKE ? OR u.email LIKE ?)';
            params.push(`%${searchTerm}%`, `%${searchTerm}%`, `%${searchTerm}%`);
        }
        if (estado) {
            query += ' AND a.estado = ?';
            params.push(estado);
        }
        if (especie) {
            query += ' AND m.especie = ?';
            params.push(especie);
        }

        query += ' ORDER BY a.fecha_solicitud DESC';

        const [rows] = await db.query(query, params);
        return rows;
    } catch (error) {
        console.error('Error en Solicitud.getAll:', error);
        throw error;
    }
}

    static async getBySolicitudId(id) {
    try {
        const [rows] = await db.query(`
            SELECT 
                a.id, 
                a.mascota_id, 
                a.adoptante_id, 
                a.fecha_solicitud, 
                a.estado,
                m.publicado_por_id AS publicador_id
            FROM adopciones a
            JOIN mascotas m ON a.mascota_id = m.id
            WHERE a.id = ?
        `, [id]);

        return rows.length > 0 ? rows[0] : null; // ✅ corregido
    } catch (error) {
        console.error('Error en Solicitud.getBySolicitudId:', error);
        throw error;
    }
}

    // Obtener solicitudes por ID de adoptante (para que un usuario vea sus propias solicitudes)
    static async getByAdoptanteId(adoptanteId) {
        try {
            const [rows] = await db.query(`
                SELECT 
                    a.id, 
                    a.fecha_solicitud, 
                    a.estado,
                    m.id AS mascota_id,
                    m.nombre AS mascota_nombre,
                    m.especie AS mascota_especie,
                    m.imagen_url AS mascota_imagen_url,
                    m.ubicacion AS mascota_ubicacion,
                    u.id AS adoptante_id,
                    u.nombre AS adoptante_nombre,
                    u.email AS adoptante_email,
                    u.telefono AS adoptante_telefono,
                    u_publicador.id AS publicador_id,
                    u_publicador.nombre AS publicador_nombre,
                    u_publicador.email AS publicador_email
                FROM adopciones a
                JOIN mascotas m ON a.mascota_id = m.id
                JOIN usuarios u ON a.adoptante_id = u.id
                JOIN usuarios u_publicador ON m.publicado_por_id = u_publicador.id
                WHERE a.adoptante_id = ?
                ORDER BY a.fecha_solicitud DESC
            `, [adoptanteId]);
            return rows;
        } catch (error) {
            console.error('Error en Solicitud.getByAdoptanteId:', error);
            throw error;
        }
    }

    // Obtener solicitudes por ID del publicador de la mascota
    static async getByPublicadorId(publicadorId) {
        try {
            const [rows] = await db.query(`
                SELECT 
                    a.id, 
                    a.fecha_solicitud, 
                    a.estado,
                    m.id AS mascota_id,
                    m.nombre AS mascota_nombre,
                    m.especie AS mascota_especie,
                    m.imagen_url AS mascota_imagen_url,
                    m.ubicacion AS mascota_ubicacion,
                    u.id AS adoptante_id,
                    u.nombre AS adoptante_nombre,
                    u.email AS adoptante_email,
                    u.telefono AS adoptante_telefono,
                    u_publicador.id AS publicador_id,
                    u_publicador.nombre AS publicador_nombre,
                    u_publicador.email AS publicador_email
                FROM adopciones a
                JOIN mascotas m ON a.mascota_id = m.id
                JOIN usuarios u ON a.adoptante_id = u.id
                JOIN usuarios u_publicador ON m.publicado_por_id = u_publicador.id
                WHERE m.publicado_por_id = ?
                ORDER BY a.fecha_solicitud DESC
            `, [publicadorId]);
            return rows;
        } catch (error) {
            console.error('Error en Solicitud.getByPublicadorId:', error);
            throw error;
        }
    }


    // Crear una nueva solicitud
    static async create(mascota_id, adoptante_id) {
        try {
            // *** AGREGAR ESTA VERIFICACIÓN ***
            const [existingSolicitud] = await db.query(
                'SELECT id FROM adopciones WHERE mascota_id = ? AND adoptante_id = ? AND estado = "pendiente"',
                [mascota_id, adoptante_id]
            );

            if (existingSolicitud.length > 0) {
                // Si ya existe una solicitud pendiente, lanzar un error
                const error = new Error('Ya existe una solicitud pendiente para esta mascota por parte de este usuario.');
                error.statusCode = 409; // Código de conflicto HTTP
                throw error;
            }
            // **********************************

            const [result] = await db.query(
                'INSERT INTO adopciones (mascota_id, adoptante_id, fecha_solicitud, estado) VALUES (?, ?, NOW(), ?)',
                [mascota_id, adoptante_id, 'pendiente']
            );
            return { id: result.insertId };
        } catch (error) {
            console.error('Error en Solicitud.create:', error);
            throw error;
        }
    }

    // Actualizar el estado de una solicitud
    static async updateState(id, estado) {
        try {
            const [result] = await db.query(
                'UPDATE adopciones SET estado = ? WHERE id = ?',
                [estado, id]
            );
            return result.affectedRows > 0;
        } catch (error) {
            console.error('Error en Solicitud.updateState:', error);
            throw error;
        }
    }

    // Eliminar una solicitud
    static async delete(id) {
        try {
            const [result] = await db.query('DELETE FROM adopciones WHERE id = ?', [id]);
            return result.affectedRows > 0;
        } catch (error) {
            console.error('Error en Solicitud.delete:', error);
            throw error;
        }
    }

    static async count() {
        const [rows] = await db.query('SELECT COUNT(*) AS total FROM adopciones');
        return rows[0].total;
    }
}

module.exports = Solicitud;