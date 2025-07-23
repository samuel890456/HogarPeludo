const db = require('../config/db');

class CampanaNoticia {
    static async getAll(whereClause = '', params = []) {
        const query = `SELECT cn.*, u.nombre as autor_nombre 
                      FROM campanas_noticias cn 
                      LEFT JOIN usuarios u ON cn.autor_id = u.id 
                      ${whereClause} 
                      ORDER BY cn.fecha_creacion DESC`;
        const [rows] = await db.query(query, params);
        return rows;
    }

    static async getById(id) {
        const [rows] = await db.query(
            'SELECT cn.*, u.nombre as autor_nombre FROM campanas_noticias cn LEFT JOIN usuarios u ON cn.autor_id = u.id WHERE cn.id = ?', 
            [id]
        );
        return rows[0];
    }

    static async getByTipo(tipo) {
        const [rows] = await db.query(
            'SELECT cn.*, u.nombre as autor_nombre FROM campanas_noticias cn LEFT JOIN usuarios u ON cn.autor_id = u.id WHERE cn.tipo = ? AND cn.estado IN ("activa", "publicada") ORDER BY cn.fecha_creacion DESC',
            [tipo]
        );
        return rows;
    }

    static async create(data) {
        const {
            titulo,
            descripcion,
            contenido,
            tipo,
            categoria,
            estado,
            fecha_publicacion,
            autor_id,
            imagen_url,
            fundacion_asociada,
            ubicacion,
            objetivo,
            progreso,
            tags
        } = data;

        const [result] = await db.query(
            `INSERT INTO campanas_noticias (
                titulo, descripcion, contenido, tipo, categoria, estado, 
                fecha_publicacion, autor_id, imagen_url, fundacion_asociada, 
                ubicacion, objetivo, progreso, tags
            ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
            [
                titulo, descripcion, contenido, tipo, categoria, estado,
                fecha_publicacion, autor_id, imagen_url, fundacion_asociada,
                ubicacion, objetivo, progreso, tags
            ]
        );
        return result.insertId;
    }

    static async update(id, data) {
        const {
            titulo,
            descripcion,
            contenido,
            tipo,
            categoria,
            estado,
            fecha_publicacion,
            imagen_url,
            fundacion_asociada,
            ubicacion,
            objetivo,
            progreso,
            tags
        } = data;

        await db.query(
            `UPDATE campanas_noticias SET 
                titulo = ?, descripcion = ?, contenido = ?, tipo = ?, categoria = ?, 
                estado = ?, fecha_publicacion = ?, imagen_url = ?, fundacion_asociada = ?, 
                ubicacion = ?, objetivo = ?, progreso = ?, tags = ?
            WHERE id = ?`,
            [
                titulo, descripcion, contenido, tipo, categoria, estado,
                fecha_publicacion, imagen_url, fundacion_asociada, ubicacion,
                objetivo, progreso, tags, id
            ]
        );
    }

    static async delete(id) {
        await db.query('DELETE FROM campanas_noticias WHERE id = ?', [id]);
    }

    static async incrementViews(id) {
        await db.query('UPDATE campanas_noticias SET vistas = vistas + 1 WHERE id = ?', [id]);
    }

    static async toggleLike(id, usuario_id) {
        // Primero verificar si ya existe un like
        const [existing] = await db.query(
            'SELECT * FROM campanas_noticias_likes WHERE campana_noticia_id = ? AND usuario_id = ?',
            [id, usuario_id]
        );

        if (existing.length > 0) {
            // Si existe, eliminar el like
            await db.query(
                'DELETE FROM campanas_noticias_likes WHERE campana_noticia_id = ? AND usuario_id = ?',
                [id, usuario_id]
            );
            await db.query('UPDATE campanas_noticias SET likes = likes - 1 WHERE id = ?', [id]);
        } else {
            // Si no existe, agregar el like
            await db.query(
                'INSERT INTO campanas_noticias_likes (campana_noticia_id, usuario_id) VALUES (?, ?)',
                [id, usuario_id]
            );
            await db.query('UPDATE campanas_noticias SET likes = likes + 1 WHERE id = ?', [id]);
        }
    }

    static async getEstadisticas() {
        const [campanas] = await db.query('SELECT COUNT(*) as total FROM campanas_noticias WHERE tipo = "campana"');
        const [campanasActivas] = await db.query('SELECT COUNT(*) as total FROM campanas_noticias WHERE tipo = "campana" AND estado = "activa"');
        const [noticias] = await db.query('SELECT COUNT(*) as total FROM campanas_noticias WHERE tipo = "noticia"');
        const [noticiasPublicadas] = await db.query('SELECT COUNT(*) as total FROM campanas_noticias WHERE tipo = "noticia" AND estado = "publicada"');
        const [totalVistas] = await db.query('SELECT SUM(vistas) as total FROM campanas_noticias');
        const [totalLikes] = await db.query('SELECT SUM(likes) as total FROM campanas_noticias');

        return {
            totalCampanas: campanas[0].total,
            campanasActivas: campanasActivas[0].total,
            totalNoticias: noticias[0].total,
            noticiasPublicadas: noticiasPublicadas[0].total,
            totalVistas: totalVistas[0].total || 0,
            totalLikes: totalLikes[0].total || 0
        };
    }
}

module.exports = CampanaNoticia;
