const db = require('../config/db');

const Fundacion = {
    create: async (fundacion) => {
        const query = 'INSERT INTO fundaciones (nombre, email, telefono, direccion, descripcion, sitio_web, logo_url, usuario_id, ciudad, departamento, aprobacion) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)';
        const values = [fundacion.nombre, fundacion.email, fundacion.telefono, fundacion.direccion, fundacion.descripcion, fundacion.sitio_web, fundacion.logo_url, fundacion.usuario_id, fundacion.ciudad, fundacion.departamento, fundacion.aprobacion || 'pendiente'];
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
        let query = 'SELECT * FROM fundaciones WHERE 1=1';
        const params = [];

        if (searchTerm) {
            query += ' AND (nombre LIKE ? OR email LIKE ? OR direccion LIKE ?)';
            params.push(`%${searchTerm}%`, `%${searchTerm}%`, `%${searchTerm}%`);
        }
        if (departamento) {
            query += ' AND departamento = ?';
            params.push(departamento);
        }
        if (ciudad) {
            query += ' AND ciudad = ?';
            params.push(ciudad);
        }
        if (aprobacion) {
            query += ' AND aprobacion = ?';
            params.push(aprobacion);
        }

        query += ' ORDER BY nombre ASC';
        return await db.query(query, params);
    },

    update: async (id, fundacion) => {
        const query = 'UPDATE fundaciones SET nombre = ?, email = ?, telefono = ?, direccion = ?, descripcion = ?, sitio_web = ?, logo_url = ?, ciudad = ?, departamento = ?, aprobacion = ? WHERE id = ?';
        const values = [fundacion.nombre, fundacion.email, fundacion.telefono, fundacion.direccion, fundacion.descripcion, fundacion.sitio_web, fundacion.logo_url, fundacion.ciudad, fundacion.departamento, fundacion.aprobacion, id];
        return await db.query(query, values);
    },

    updateByUserId: async (userId, fundacion) => {
        const query = 'UPDATE fundaciones SET nombre = ?, email = ?, telefono = ?, direccion = ?, descripcion = ?, sitio_web = ?, logo_url = ?, ciudad = ?, departamento = ?, aprobacion = ? WHERE usuario_id = ?';
        const values = [fundacion.nombre, fundacion.email, fundacion.telefono, fundacion.direccion, fundacion.descripcion, fundacion.sitio_web, fundacion.logo_url, fundacion.ciudad, fundacion.departamento, fundacion.aprobacion, userId];
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
    }
};

module.exports = Fundacion;
