const db = require('../config/db');

const Fundacion = {
    create: async (fundacion) => {
        const query = 'INSERT INTO fundaciones (nombre, email, telefono, direccion, descripcion, sitio_web, logo_url, usuario_id) VALUES (?, ?, ?, ?, ?, ?, ?, ?)';
        const values = [fundacion.nombre, fundacion.email, fundacion.telefono, fundacion.direccion, fundacion.descripcion, fundacion.sitio_web, fundacion.logo_url, fundacion.usuario_id];
        return await db.query(query, values);
    },

    findById: async (id) => {
        const query = 'SELECT * FROM fundaciones WHERE id = ?';
        return await db.query(query, [id]);
    },

    findByEmail: async (email) => {
        const query = 'SELECT * FROM fundaciones WHERE email = ?';
        return await db.query(query, [email]);
    },

    findAll: async () => {
        const query = 'SELECT * FROM fundaciones';
        return await db.query(query);
    },

    update: async (id, fundacion) => {
        const query = 'UPDATE fundaciones SET nombre = ?, email = ?, telefono = ?, direccion = ?, descripcion = ?, sitio_web = ?, logo_url = ? WHERE id = ?';
        const values = [fundacion.nombre, fundacion.email, fundacion.telefono, fundacion.direccion, fundacion.descripcion, fundacion.sitio_web, fundacion.logo_url, id];
        return await db.query(query, values);
    },

    delete: async (id) => {
        const query = 'DELETE FROM fundaciones WHERE id = ?';
        return await db.query(query, [id]);
    }
};

module.exports = Fundacion;
