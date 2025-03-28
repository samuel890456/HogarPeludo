const db = require('../config/db');

class Rol {
    // Obtener un rol por su ID
    static async getById(id) {
        const [rows] = await db.query('SELECT * FROM roles WHERE id = ?', [id]);
        return rows[0];
    }

    // Obtener todos los roles
    static async getAll() {
        const [rows] = await db.query('SELECT * FROM roles');
        return rows;
    }
}

module.exports = Rol;