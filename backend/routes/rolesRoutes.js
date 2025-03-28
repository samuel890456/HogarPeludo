const express = require('express');
const rolesController = require('../controllers/rolesController');
const authController = require('../controllers/authController');

const router = express.Router();

// Obtener todos los roles (protegida)
router.get('/', authController.verificarToken, rolesController.getAllRoles);

// Obtener un rol por su ID (protegida)
router.get('/:id', authController.verificarToken, rolesController.getRolById);

module.exports = router;