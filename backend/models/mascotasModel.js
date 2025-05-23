//backend/models/mascotasModel.js
const db = require('../config/db');

class Mascota {
    static async count() {
        const [rows] = await db.query('SELECT COUNT(*) AS total FROM mascotas');
        return rows[0].total;
    }
    
    static async getAll() {
        const [rows] = await db.query('SELECT * FROM mascotas');
        return rows;
    }

    static async getById(id) {
        const [rows] = await db.query('SELECT * FROM mascotas WHERE id = ?', [id]);
        return rows[0];
    }

    static async create(nombre, especie, raza, edad, genero, tamaño, descripcion, foto, estado, usuario_id) {
        const [result] = await db.query(
            'INSERT INTO mascotas (nombre, especie, raza, edad, genero, tamaño, descripcion, foto, estado, usuario_id) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)',
            [nombre, especie, raza, edad, genero, tamaño, descripcion, foto, estado, usuario_id]
        );
        return result.insertId;
    }
    


    static async update(id, nombre, especie, raza, edad, genero, tamaño, descripcion, foto, estado) {
        await db.query(
            'UPDATE mascotas SET nombre = ?, especie = ?, raza = ?, edad = ?, genero = ?, tamaño = ?, descripcion = ?, foto = ?, estado = ? WHERE id = ?',
            [nombre, especie, raza, edad, genero, tamaño, descripcion, foto, estado, id]
        );
    }

    static async delete(id) {
        await db.query('DELETE FROM mascotas WHERE id = ?', [id]);
    }
}

module.exports = Mascota;