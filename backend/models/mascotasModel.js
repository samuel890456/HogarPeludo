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
    static async create(
        nombre, especie, raza, edad, sexo, tamano, peso, color, descripcion, estado_salud, historia, ubicacion, imagen_url, publicado_por_id, disponible, esterilizado, vacunas, tags
    ) {
        const [result] = await db.query(
            `INSERT INTO mascotas 
            (nombre, especie, raza, edad, sexo, tamano, peso, color, descripcion, estado_salud, historia, ubicacion, imagen_url, publicado_por_id, disponible, esterilizado, vacunas, tags)
            VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
            [nombre, especie, raza, edad, sexo, tamano, peso, color, descripcion, estado_salud, historia, ubicacion, imagen_url, publicado_por_id, disponible, esterilizado, vacunas, tags]
        );
        return result.insertId;
    }

    // UPDATE con todos los nuevos campos
    static async update(
        id, nombre, especie, raza, edad, sexo, tamano, peso, color, descripcion, estado_salud, historia, ubicacion, imagen_url, disponible, esterilizado, vacunas, tags
    ) {
        await db.query(
            `UPDATE mascotas SET 
                nombre = ?, 
                especie = ?, 
                raza = ?, 
                edad = ?, 
                sexo = ?, 
                tamano = ?, 
                peso = ?, 
                color = ?, 
                descripcion = ?, 
                estado_salud = ?, 
                historia = ?, 
                ubicacion = ?, 
                imagen_url = ?, 
                disponible = ?, 
                esterilizado = ?, 
                vacunas = ?,
                tags = ?
            WHERE id = ?`,
            [nombre, especie, raza, edad, sexo, tamano, peso, color, descripcion, estado_salud, historia, ubicacion, imagen_url, disponible, esterilizado, vacunas, tags, id]
        );
    }

    static async delete(id) {
        await db.query('DELETE FROM mascotas WHERE id = ?', [id]);
    }

    static async getAdopcionesPorEspecie() {
        return db.query(`
            SELECT especie, COUNT(*) AS total
            FROM mascotas
            WHERE disponible = 0
            GROUP BY especie
            ORDER BY total DESC
        `);
    }

    static async getAdopcionesPorMes() {
        return db.query(`
            SELECT DATE_FORMAT(fecha_publicacion, '%Y-%m') AS mes, COUNT(*) AS total
            FROM mascotas
            WHERE disponible = 0
            GROUP BY mes
            ORDER BY mes
        `);
    }

    static async getTopPopulares(limit = 5) {
        return db.query(`
            SELECT m.id, m.nombre, m.especie, m.imagen_url, COUNT(a.id) AS solicitudes
            FROM mascotas m
            LEFT JOIN adopciones a ON m.id = a.mascota_id
            GROUP BY m.id
            ORDER BY solicitudes DESC
            LIMIT ?
        `, [limit]);
    }
}

module.exports = Mascota;