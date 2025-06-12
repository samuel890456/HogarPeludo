//backend/models/usuariosModel.js
const db = require('../config/db');

class Usuario {
    static async getAll() {
        const [rows] = await db.query('SELECT * FROM usuarios');
        return rows;
    }

    static async count() {
        const [rows] = await db.query('SELECT COUNT(*) AS total FROM usuarios');
        return rows[0].total;
    }

    static async getById(id) {
        const [rows] = await db.query('SELECT * FROM usuarios WHERE id = ?', [id]);
        return rows[0] || null;
    }

    static async getByEmail(email) {
        const [rows] = await db.query('SELECT * FROM usuarios WHERE email = ?', [email]);
        return rows[0] || null;
    }

    static async create(nombre, email, contraseña, telefono, direccion) { // rol_id no aquí
        const [result] = await db.query(
            'INSERT INTO usuarios (nombre, email, contraseña, telefono, direccion) VALUES (?, ?, ?, ?, ?)',
            [nombre, email, contraseña, telefono, direccion]
        );
        return result.insertId;
    }

    static async getByEmailWithRoles(email) {
        const [rows] = await db.query(
            `SELECT u.*, GROUP_CONCAT(ur.rol_id) AS roles_ids 
             FROM usuarios u 
             LEFT JOIN usuario_roles ur ON u.id = ur.usuario_id 
             WHERE u.email = ? GROUP BY u.id`,
            [email]
        );
        if (rows[0]) {
            // Convertir la cadena de roles a un array de strings
            rows[0].roles = rows[0].roles_ids ? rows[0].roles_ids.split(',') : [];
            delete rows[0].roles_ids;
        }
        return rows[0] || null;
    }

    static async assignRole(usuarioId, rolId) {
        await db.query(
            'INSERT INTO usuario_roles (usuario_id, rol_id) VALUES (?, ?)',
            [usuarioId, rolId]
        );
    }

    static async getUserRoles(usuarioId) {
        const [rows] = await db.query(
            'SELECT r.id, r.nombre_rol FROM usuario_roles ur JOIN roles r ON ur.rol_id = r.id WHERE ur.usuario_id = ?',
            [usuarioId]
        );
        return rows.map(row => row.id.toString()); // Devolver IDs de rol como strings
    }

    static async update(id, nombre, email, telefono, direccion) {
        await db.query(
            'UPDATE usuarios SET nombre = ?, email = ?, telefono = ?, direccion = ? WHERE id = ?',
            [nombre, email, telefono, direccion, id]
        );
    }

    static async updateStatus(id, activo) {
        await db.query('UPDATE usuarios SET activo = ? WHERE id = ?', [activo, id]);
    }


    static async toggleEstado(id) {
        const usuario = await this.getById(id);
        const nuevoEstado = usuario.estado === 'activo' ? 'bloqueado' : 'activo';
        const [result] = await db.query('UPDATE usuarios SET estado = ? WHERE id = ?', [nuevoEstado, id]);
        return nuevoEstado;
    }


}

module.exports = Usuario;