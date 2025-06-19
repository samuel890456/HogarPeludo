// backend/models/adopcionesModel.js
const db = require('../config/db'); // Esto es el pool de promesas que exportas de db.js

const Adopcion = {
  // Crear nueva solicitud de adopción
  // Ya no necesitamos 'new Promise' aquí, ya que db.query devuelve una promesa
  create: async (mascota_id, adoptante_id, estado) => { // Marca la función como async
    const query = `INSERT INTO adopciones (mascota_id, adoptante_id, fecha_solicitud, estado) VALUES (?, ?, NOW(), ?)`;
    
    console.log('🟠 Modelo DB: Iniciando Adopcion.create (Async/Await)...');
    console.log('🟠 Modelo DB: SQL Query:', query);
    console.log('🟠 Modelo DB: Valores:', [mascota_id, adoptante_id, estado]);

    try {
      // Usa await con db.query
      const [results] = await db.query(query, [mascota_id, adoptante_id, estado]);
      
      console.log('✅ Modelo DB: Query de inserción exitosa. Insert ID:', results.insertId);
      return results.insertId; // Devuelve directamente el ID insertado
    } catch (err) {
      console.error('❌ Modelo DB: ERROR al ejecutar query (async/await):', err);
      throw err; // Vuelve a lanzar el error para que sea capturado por el controlador
    }
  },

  // ... (el resto de tus métodos, adaptalos también a async/await si usan db.query) ...
  // Por ejemplo, getAll:
  getAll: async () => {
    const query = `
      SELECT 
        a.id,
        a.fecha_solicitud,
        a.estado,
        m.nombre as mascota_nombre,
        m.imagen_url,
        u.nombre as adoptante_nombre,
        u.email as adoptante_email
      FROM adopciones a
      JOIN mascotas m ON a.mascota_id = m.id
      JOIN usuarios u ON a.adoptante_id = u.id
      ORDER BY a.fecha_solicitud DESC
    `;
    try {
      const [rows] = await db.query(query);
      return rows;
    } catch (err) {
      console.error('Error en adopcionesModel.getAll:', err);
      throw err;
    }
  },

  getByUsuario: async (usuario_id) => {
    const query = `
      SELECT 
        a.id,
        a.fecha_solicitud,
        a.estado,
        m.nombre as mascota_nombre,
        m.imagen_url,
        m.id as mascota_id
      FROM adopciones a
      JOIN mascotas m ON a.mascota_id = m.id
      WHERE a.adoptante_id = ?
      ORDER BY a.fecha_solicitud DESC
    `;
    try {
      const [rows] = await db.query(query, [usuario_id]);
      return rows;
    } catch (err) {
      console.error('Error en adopcionesModel.getByUsuario:', err);
      throw err;
    }
  },

  updateEstado: async (id, estado) => {
    const query = `UPDATE adopciones SET estado = ? WHERE id = ?`;
    try {
      const [results] = await db.query(query, [estado, id]);
      return results.affectedRows > 0;
    } catch (err) {
      console.error('Error en adopcionesModel.updateEstado:', err);
      throw err;
    }
  },
// Nuevo método para verificar si ya existe una solicitud para la misma mascota por el mismo adoptante
  getExistingSolicitud: async (mascota_id, adoptante_id) => {
    try {
      const query = `
        SELECT id, estado
        FROM adopciones
        WHERE mascota_id = ? AND adoptante_id = ?
        ORDER BY fecha_solicitud DESC
        LIMIT 1;
      `;
      console.log('🟠 Modelo DB: Verificando solicitud existente...');
      const [rows] = await db.query(query, [mascota_id, adoptante_id]);
      
      // Si rows tiene elementos, significa que ya hay una solicitud
      return rows[0] || null; // Devuelve la primera solicitud encontrada o null si no hay
    } catch (error) {
      console.error('❌ Modelo DB: ERROR al verificar solicitud existente:', error);
      throw error;
    }
  }
};
  

module.exports = Adopcion;