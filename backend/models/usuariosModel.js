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

    static async create(nombre, email, contraseña, telefono, direccion, rol_id) {
        const [result] = await db.query(
            'INSERT INTO usuarios (nombre, email, contraseña, telefono, direccion, rol_id) VALUES (?, ?, ?, ?, ?, ?)',
            [nombre, email, contraseña, telefono, direccion, rol_id]
        );
        return result.insertId;
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