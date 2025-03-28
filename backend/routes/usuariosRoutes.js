const express = require('express');
const usuariosController = require('../controllers/usuariosController');
const authController = require('../controllers/authController');

const router = express.Router();

// Obtener un usuario por su ID (protegida)
router.get('/:id', authController.verificarToken, usuariosController.getUsuarioById);

// Actualizar un usuario existente (protegida)
router.put('/:id', authController.verificarToken, usuariosController.updateUsuario);

module.exports = router;