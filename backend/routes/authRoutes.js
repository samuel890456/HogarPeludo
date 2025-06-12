const express = require('express');
const authController = require('../controllers/authController');

const router = express.Router();

// Registro de usuario
router.post('/registrarse', authController.registrarUsuario);

// Inicio de sesión
router.post('/iniciar-sesion', authController.iniciarSesion);
router.post('/forgot-password', authController.forgotPassword); // Para solicitar el envío del email
router.post('/reset-password/:token', authController.resetPassword); // Para restablecer la contraseña con el token
// Ruta protegida (ejemplo)
router.get('/ruta-protegida', authController.verificarToken, (req, res) => {
    res.json({ message: 'Esta es una ruta protegida', usuario: req.usuario });
});

module.exports = router;