const express = require('express');
const router = express.Router();
const fundacionesController = require('../controllers/fundacionesController');
const authController = require('../controllers/authController'); // Importar authController

router.post('/', fundacionesController.createFundacion);
router.get('/', fundacionesController.getAllFundaciones);
router.get('/:id', fundacionesController.getFundacionById);
router.put('/:id', fundacionesController.updateFundacion);
router.delete('/:id', fundacionesController.deleteFundacion);

// Nuevas rutas para gestionar la fundación por usuario_id
router.get('/user/:userId', authController.verificarToken, authController.checkRole(['3']), fundacionesController.getFundacionByUserId);
router.put('/user/:userId', authController.verificarToken, authController.checkRole(['3']), fundacionesController.updateFundacionByUserId);

// Calificar una fundación (requiere autenticación)
router.post('/:id/calificar', authController.verificarToken, fundacionesController.calificarFundacion);
// Obtener todas las calificaciones de una fundación
router.get('/:id/calificaciones', fundacionesController.getCalificacionesFundacion);
// Obtener el promedio de calificación de una fundación
router.get('/:id/promedio-calificacion', fundacionesController.getPromedioCalificacionFundacion);

module.exports = router;
