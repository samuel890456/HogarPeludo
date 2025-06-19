//backend/routes/adminRoutes.js
const express = require('express');
const router = express.Router();
const adminController = require('../controllers/adminController');
const authMiddleware = require('../middlewares/authMiddleware');

// Middleware para verificar si el usuario es admin
router.use(authMiddleware.verificarToken, authMiddleware.verificarAdmin);

// Rutas del Dashboard
router.get('/resumen', adminController.getResumenGeneral);
router.get('/mascotas', adminController.getMascotas);
router.get('/solicitudes', adminController.getSolicitudes);
router.get('/usuarios', adminController.getUsuarios);
router.get('/ranking-adopciones', authMiddleware.verificarToken, authMiddleware.verificarAdmin, adminController.getRankingAdopcionesPorEspecie);
router.get('/adopciones-por-mes', authMiddleware.verificarToken, authMiddleware.verificarAdmin, adminController.getAdopcionesPorMes);
router.get('/top-mascotas-populares', authMiddleware.verificarToken, authMiddleware.verificarAdmin, adminController.getTopMascotasPopulares);

// routes/adminRoutes.js o donde definas rutas de admin
router.put('/usuarios/:id/toggle', adminController.toggleEstadoUsuario);


router.put('/solicitudes/:id', adminController.updateSolicitud);
router.put('/usuarios/:id', adminController.toggleUsuarioStatus);
router.delete('/mascotas/:id', adminController.deleteMascota);

module.exports = router;
