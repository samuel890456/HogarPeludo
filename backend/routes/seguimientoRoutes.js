const express = require('express');
const seguimientoController = require('../controllers/seguimientoController');
const authController = require('../controllers/authController');

const router = express.Router();

// Crear un nuevo registro de seguimiento (protegida)
router.post('/', authController.verificarToken, seguimientoController.createSeguimiento);

// Obtener todos los registros de seguimiento de una solicitud (protegida)
router.get('/solicitud/:solicitud_id', authController.verificarToken, seguimientoController.getSeguimientosBySolicitudId);

module.exports = router;