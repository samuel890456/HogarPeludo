// File: frontend/src/components/MascotaDetalle.js
const express = require('express');
const router = express.Router();
const adopcionesController = require('../controllers/adopcionesController');

router.post('/', adopcionesController.solicitarAdopcion);

module.exports = router;
