const express = require('express');
const solicitudesController = require('../controllers/solicitudesController');
const authController = require('../controllers/authController'); // Para verificar el token

const router = express.Router();

// Ruta para crear una nueva solicitud de adopción (protegida)
router.post('/', authController.verificarToken, solicitudesController.createSolicitud);

// Ruta para obtener solicitudes (filtrado por rol, protegida)
router.get('/', authController.verificarToken, solicitudesController.getSolicitudes);

// Ruta para actualizar el estado de una solicitud (protegida, solo para el publicador de la mascota o admin)
router.put('/:id/estado', authController.verificarToken, solicitudesController.updateEstadoSolicitud);

// Ruta para eliminar una solicitud (protegida, solo para el adoptante, publicador de la mascota o admin)
router.delete('/:id', authController.verificarToken, solicitudesController.deleteSolicitud);

module.exports = router;