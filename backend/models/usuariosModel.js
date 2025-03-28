const db = require('../config/db');

class Usuario {
    static async getByEmail(email) {
        const [rows] = await db.query('SELECT * FROM usuarios WHERE email = ?', [email]);
        return rows[0];
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
}

module.exports = Usuario;