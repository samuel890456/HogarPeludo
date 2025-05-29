// models/adopcionesModel.js
const db = require('../config/db');

const Adopcion = {
  create: async (mascota_id, adoptante_id) => {
    return new Promise((resolve, reject) => {
      const fecha_solicitud = new Date();
      const estado = 'aceptada'; // Puedes usar 'pendiente', 'aceptada', 'rechazada'

      const query = `
        INSERT INTO adopciones (mascota_id, adoptante_id, fecha_solicitud, estado)
        VALUES (?, ?, ?, ?)
      `;

      db.query(query, [mascota_id, adoptante_id, fecha_solicitud, estado], (err, result) => {
        if (err) return reject(err);
        resolve(result.insertId);
      });
    });
  },

  getAll: async () => {
    return new Promise((resolve, reject) => {
      const query = `SELECT * FROM adopciones`;
      db.query(query, (err, results) => {
        if (err) return reject(err);
        resolve(results);
      });
    });
  },

  getById: async (id) => {
    return new Promise((resolve, reject) => {
      const query = `SELECT * FROM adopciones WHERE id = ?`;
      db.query(query, [id], (err, results) => {
        if (err) return reject(err);
        resolve(results[0]);
      });
    });
  },

  updateEstado: async (id, nuevoEstado) => {
    return new Promise((resolve, reject) => {
      const query = `UPDATE adopciones SET estado = ? WHERE id = ?`;
      db.query(query, [nuevoEstado, id], (err, result) => {
        if (err) return reject(err);
        resolve(result);
      });
    });
  }
};

module.exports = Adopcion;
