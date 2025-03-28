const express = require('express');
const solicitudesController = require('../controllers/solicitudesController');
const authController = require('../controllers/authController');

const router = express.Router();

// Crear una nueva solicitud de adopción (protegida)
router.post('/', authController.verificarToken, solicitudesController.createSolicitud);

// Obtener todas las solicitudes de un usuario (protegida)
router.get('/usuario/:usuario_id', authController.verificarToken, solicitudesController.getSolicitudesByUsuarioId);

// Actualizar el estado de una solicitud (protegida)
router.put('/:id/estado', authController.verificarToken, solicitudesController.updateEstadoSolicitud);

module.exports = router;