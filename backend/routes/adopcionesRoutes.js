// File: backend/routes/adopcionesRoutes.js
// Este archivo define las rutas relacionadas con las adopciones de mascotas.
const express = require('express');
const router = express.Router();
const adopcionesController = require('../controllers/adopcionesController');

router.post('/', adopcionesController.solicitarAdopcion);

module.exports = router;
