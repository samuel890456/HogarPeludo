//backend/models/usuariosModel.js
const db = require('../config/db');

class Usuario {
    static async getAll() {
        const [rows] = await db.query(
            `SELECT u.*, GROUP_CONCAT(r.nombre_rol) AS roles_nombres, GROUP_CONCAT(r.id) AS roles_ids
             FROM usuarios u 
             LEFT JOIN usuario_roles ur ON u.id = ur.usuario_id 
             LEFT JOIN roles r ON ur.rol_id = r.id 
             GROUP BY u.id`
        );
        return rows.map(row => ({
            ...row,
            roles: row.roles_nombres ? row.roles_nombres.split(',') : [],
            roles_ids: row.roles_ids ? row.roles_ids.split(',') : []
        }));
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
            `SELECT u.*, GROUP_CONCAT(ur.rol_id) AS roles_ids,
                    u.resetPasswordToken, u.resetPasswordExpire -- <--- Añadido aquí
             FROM usuarios u 
             LEFT JOIN usuario_roles ur ON u.id = ur.usuario_id 
             WHERE u.email = ? GROUP BY u.id`, 
            [email]
        );
        if (rows[0]) {
            rows[0].roles = rows[0].roles_ids ? rows[0].roles_ids.split(',') : [];
            delete rows[0].roles_ids;
        }
        return rows[0] || null;
    }
    
    // Nuevo método: Encontrar un usuario por su token de restablecimiento de contraseña
    static async findByResetToken(token) {
        const [rows] = await db.query(
            `SELECT * FROM usuarios WHERE resetPasswordToken = ? AND resetPasswordExpire > NOW()`,
            [token]
        );
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

    static async update(id, nombre, email, telefono, direccion, biografia, foto_perfil_url, clear_foto_perfil, notificarEmail, notificarWeb) {
        let query = 'UPDATE usuarios SET nombre = ?, email = ?, telefono = ?, direccion = ?, biografia = ?, notificarEmail = ?, notificarWeb = ?';
        let params = [nombre, email, telefono, direccion, biografia, notificarEmail, notificarWeb];

        if (foto_perfil_url) {
            query += ', foto_perfil_url = ?';
            params.push(foto_perfil_url);
        } else if (clear_foto_perfil) {
            query += ', foto_perfil_url = NULL';
        }

        query += ' WHERE id = ?';
        params.push(id);

        await db.query(query, params);
    }

    static async updatePassword(id, newHashedPassword) {
        await db.query(
            'UPDATE usuarios SET contraseña = ? WHERE id = ?',
            [newHashedPassword, id]
        );
    }

    static async saveRoleRequest(userId, motivacion, status) {
        await db.query(
            'UPDATE usuarios SET solicitud_rol_refugio_estado = ?, solicitud_rol_refugio_motivacion = ? WHERE id = ?',
            [status, motivacion, userId]
        );
    }

    // Nuevo método para actualizar la contraseña y limpiar el token de restablecimiento
    static async updatePasswordAndClearToken(id, newHashedPassword) {
        await db.query(
            'UPDATE usuarios SET contraseña = ?, resetPasswordToken = NULL, resetPasswordExpire = NULL WHERE id = ?',
            [newHashedPassword, id]
        );
    }
    // Nuevo método para guardar el token de restablecimiento
    static async saveResetToken(id, token, expirationDate) {
        await db.query(
            'UPDATE usuarios SET resetPasswordToken = ?, resetPasswordExpire = ? WHERE id = ?',
            [token, expirationDate, id]
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


    // Nuevo método para eliminar un usuario
    static async delete(id) {
        await db.query('DELETE FROM usuarios WHERE id = ?', [id]);
    }

    static async updateUserRole(userId, newRoleId) {
        // Primero, eliminar todos los roles existentes para el usuario
        await db.query('DELETE FROM usuario_roles WHERE usuario_id = ?', [userId]);
        // Luego, asignar el nuevo rol
        await db.query('INSERT INTO usuario_roles (usuario_id, rol_id) VALUES (?, ?)', [userId, newRoleId]);
    }

    static async getPendingRoleRequests() {
        const [rows] = await db.query(
            `SELECT u.id, u.nombre, u.email, u.fecha_registro, u.solicitud_rol_refugio_motivacion, u.solicitud_rol_refugio_estado
             FROM usuarios u
             WHERE u.solicitud_rol_refugio_estado = 'pendiente_aprobacion_admin'`
        );
        return rows;
    }
}

module.exports = Usuario;