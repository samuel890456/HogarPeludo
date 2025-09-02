const db = require('../config/db');

const Fundacion = {
    create: async (fundacion) => {
        const query = 'INSERT INTO fundaciones (nombre, email, telefono, direccion, descripcion, sitio_web, logo_url, usuario_id, ciudad, departamento, aprobacion, numero_registro_legal, acepta_voluntarios, acepta_donaciones, facebook, instagram, whatsapp, horario, especialidad, fundacion_desde, calificacion) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)';
        const values = [fundacion.nombre, fundacion.email, fundacion.telefono, fundacion.direccion, fundacion.descripcion, fundacion.sitio_web, fundacion.logo_url, fundacion.usuario_id, fundacion.ciudad, fundacion.departamento, fundacion.aprobacion || 'pendiente', fundacion.numero_registro_legal, fundacion.acepta_voluntarios, fundacion.acepta_donaciones, fundacion.facebook, fundacion.instagram, fundacion.whatsapp, fundacion.horario, fundacion.especialidad, fundacion.fundacion_desde, fundacion.calificacion];
        return await db.query(query, values);
    },

    findById: async (id) => {
        const query = 'SELECT * FROM fundaciones WHERE id = ?';
        return await db.query(query, [id]);
    },

    findByUserId: async (userId) => {
        const query = 'SELECT * FROM fundaciones WHERE usuario_id = ?';
        return await db.query(query, [userId]);
    },

    findByEmail: async (email) => {
        const query = 'SELECT * FROM fundaciones WHERE email = ?';
        return await db.query(query, [email]);
    },

    findAll: async (searchTerm = '', departamento = '', ciudad = '', aprobacion = '') => {
        let query = `
            SELECT 
                f.*, 
                COUNT(m.id) AS mascotas_disponibles,
                (
                  SELECT AVG(cf.puntuacion)
                  FROM calificaciones_fundacion cf
                  WHERE cf.fundacion_id = f.id
                ) AS calificacion
            FROM fundaciones f
            LEFT JOIN mascotas m ON f.usuario_id = m.publicado_por_id AND m.disponible = 1
            WHERE 1=1
        `;
        const params = [];

        if (searchTerm) {
            query += ' AND (f.nombre LIKE ? OR f.email LIKE ? OR f.direccion LIKE ? OR f.descripcion LIKE ?)';
            params.push(`%${searchTerm}%`, `%${searchTerm}%`, `%${searchTerm}%`, `%${searchTerm}%`);
        }
        if (departamento) {
            query += ' AND f.departamento = ?';
            params.push(departamento);
        }
        if (ciudad) {
            query += ' AND f.ciudad = ?';
            params.push(ciudad);
        }
        if (aprobacion) {
            query += ' AND f.aprobacion = ?';
            params.push(aprobacion);
        }

        query += ' GROUP BY f.id ORDER BY f.nombre ASC';
        return await db.query(query, params);
    },

    update: async (id, fundacion) => {
        const query = 'UPDATE fundaciones SET nombre = ?, email = ?, telefono = ?, direccion = ?, descripcion = ?, sitio_web = ?, logo_url = ? WHERE id = ?';
        const values = [fundacion.nombre, fundacion.email, fundacion.telefono, fundacion.direccion, fundacion.descripcion, fundacion.sitio_web, fundacion.logo_url, id];
        return await db.query(query, values);
    },

    updateByUserId: async (userId, fundacion) => {
        const query = 'UPDATE fundaciones SET nombre = ?, email = ?, telefono = ?, direccion = ?, descripcion = ?, sitio_web = ?, logo_url = ?, ciudad = ?, departamento = ?, aprobacion = ?, numero_registro_legal = ?, acepta_voluntarios = ?, acepta_donaciones = ?, facebook = ?, instagram = ?, whatsapp = ?, horario = ?, especialidad = ?, fundacion_desde = ?, calificacion = ? WHERE usuario_id = ?';
        const values = [fundacion.nombre, fundacion.email, fundacion.telefono, fundacion.direccion, fundacion.descripcion, fundacion.sitio_web, fundacion.logo_url, fundacion.ciudad, fundacion.departamento, fundacion.aprobacion, fundacion.numero_registro_legal, fundacion.acepta_voluntarios, fundacion.acepta_donaciones, fundacion.facebook, fundacion.instagram, fundacion.whatsapp, fundacion.horario, fundacion.especialidad, fundacion.fundacion_desde, fundacion.calificacion, userId];
        return await db.query(query, values);
    },

    updateStatus: async (id, aprobacion) => {
        const query = 'UPDATE fundaciones SET aprobacion = ? WHERE id = ?';
        const values = [aprobacion, id];
        return await db.query(query, values);
    },

    delete: async (id) => {
        const query = 'DELETE FROM fundaciones WHERE id = ?';
        return await db.query(query, [id]);
    },

    count: async () => {
        const [rows] = await db.query('SELECT COUNT(*) AS total FROM fundaciones');
        return rows[0].total;
    },

    addCalificacion: async (fundacionId, usuarioId, puntuacion, comentario) => {
        const db = require('../config/db');
        await db.query(
            'INSERT INTO calificaciones_fundacion (fundacion_id, usuario_id, puntuacion, comentario) VALUES (?, ?, ?, ?)',
            [fundacionId, usuarioId, puntuacion, comentario]
        );
    },

    getCalificaciones: async (fundacionId) => {
        const db = require('../config/db');
        const [rows] = await db.query(
            'SELECT c.*, u.nombre as usuario_nombre FROM calificaciones_fundacion c JOIN usuarios u ON c.usuario_id = u.id WHERE c.fundacion_id = ? ORDER BY c.fecha DESC',
            [fundacionId]
        );
        return rows;
    },

    getPromedioCalificacion: async (fundacionId) => {
        const db = require('../config/db');
        const [rows] = await db.query(
            'SELECT AVG(puntuacion) as promedio FROM calificaciones_fundacion WHERE fundacion_id = ?',
            [fundacionId]
        );
        return rows[0]?.promedio || 0;
    }
};

module.exports = Fundacion;
