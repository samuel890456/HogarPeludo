// File: backend/routes/adopcionesRoutes.js
// Este archivo define las rutas relacionadas con las adopciones de mascotas.
const express = require('express');
const router = express.Router();
const adopcionesController = require('../controllers/adopcionesController');
const authController = require('../controllers/authController');

router.post('/', adopcionesController.solicitarAdopcion);
router.put('/:id/estado', authController.verificarToken, authController.checkRole(['1', '3']), adopcionesController.updateAdopcionEstado);

module.exports = router;
