// backend/routes/notificacionesRoutes.js

const express = require('express');
const notificacionesController = require('../controllers/notificacionesController');
const authController = require('../controllers/authController');

const router = express.Router();

// Ruta existente: Obtener notificaciones NO LEÍDAS
router.get('/', authController.verificarToken, notificacionesController.getUnreadNotifications);
// Ruta existente: Marcar una notificación específica como leída
router.put('/:id/leida', authController.verificarToken, notificacionesController.markNotificationAsRead);

// NUEVAS RUTAS para la bandeja completa:

// Obtener TODAS las notificaciones del usuario
router.get('/todas', authController.verificarToken, notificacionesController.getAllNotifications);

// Marcar TODAS las notificaciones del usuario como leídas
router.put('/marcar-todas-leidas', authController.verificarToken, notificacionesController.markAllNotificationsAsRead);

// Eliminar una notificación específica
router.delete('/:id', authController.verificarToken, notificacionesController.deleteNotification);

module.exports = router;