const express = require('express');
const authController = require('../controllers/authController');

const router = express.Router();

// Registro de usuario
router.post('/registrarse', authController.registrarUsuario);

// Inicio de sesión
router.post('/iniciar-sesion', authController.iniciarSesion);

// Ruta protegida (ejemplo)
router.get('/ruta-protegida', authController.verificarToken, (req, res) => {
    res.json({ message: 'Esta es una ruta protegida', usuario: req.usuario });
});

module.exports = router;