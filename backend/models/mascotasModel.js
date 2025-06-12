// backend/models/mascotasModel.js
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
    
    // NUEVA FUNCIÓN: Obtener mascotas por el ID de quien las publicó
    static async getByUserId(userId) {
        const [rows] = await db.query('SELECT * FROM mascotas WHERE publicado_por_id = ?', [userId]);
        return rows;
    }
    // CREATE con todos los nuevos campos
    static async create(nombre, especie, raza, edad, sexo, tamano, peso, color, descripcion, estado_salud, historia, ubicacion, imagen_url, publicado_por_id, disponible) {
        const [result] = await db.query(
            'INSERT INTO mascotas (nombre, especie, raza, edad, sexo, tamano, peso, color, descripcion, estado_salud, historia, ubicacion, imagen_url, publicado_por_id, disponible) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)',
            [nombre, especie, raza, edad, sexo, tamano, peso, color, descripcion, estado_salud, historia, ubicacion, imagen_url, publicado_por_id, disponible]
        );
        return result.insertId;
    }

    // UPDATE con todos los nuevos campos
    static async update(id, nombre, especie, raza, edad, sexo, tamano, peso, color, descripcion, estado_salud, historia, ubicacion, imagen_url, disponible) {
        await db.query(
            'UPDATE mascotas SET nombre = ?, especie = ?, raza = ?, edad = ?, sexo = ?, tamano = ?, peso = ?, color = ?, descripcion = ?, estado_salud = ?, historia = ?, ubicacion = ?, imagen_url = ?, disponible = ? WHERE id = ?',
            [nombre, especie, raza, edad, sexo, tamano, peso, color, descripcion, estado_salud, historia, ubicacion, imagen_url, disponible, id]
        );
    }

    static async delete(id) {
        await db.query('DELETE FROM mascotas WHERE id = ?', [id]);
    }
}

module.exports = Mascota;