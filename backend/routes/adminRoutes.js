//backend/routes/adminRoutes.js
const express = require('express');
const router = express.Router();
const adminController = require('../controllers/adminController');
const campanasNoticiasController = require('../controllers/campanasNoticiasController');
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

// Rutas para solicitudes de rol
router.get('/usuarios/solicitudes-rol-pendientes', adminController.getSolicitudesRolPendientes);
router.put('/usuarios/:id/aprobar-rol', adminController.aprobarSolicitudRol);
router.put('/usuarios/:id/rechazar-rol', adminController.rechazarSolicitudRol);

// Rutas para la gestión de fundaciones
router.get('/fundaciones', adminController.getFundaciones);
router.put('/fundaciones/:id/aprobar', adminController.aprobarFundacion);
router.put('/fundaciones/:id/rechazar', adminController.rechazarFundacion);
router.put('/fundaciones/:id', adminController.updateFundacion);
router.delete('/fundaciones/:id', adminController.eliminarFundacion);

// Rutas para la gestión de campañas y noticias
router.get('/campanas-noticias', campanasNoticiasController.getAllCampanasNoticias);
router.post('/campanas-noticias', campanasNoticiasController.createCampanaNoticia);
router.put('/campanas-noticias/:id', campanasNoticiasController.updateCampanaNoticia);
router.delete('/campanas-noticias/:id', campanasNoticiasController.deleteCampanaNoticia);

router.put('/solicitudes/:id', adminController.updateSolicitud);
router.put('/usuarios/:id', adminController.toggleUsuarioStatus);
router.delete('/mascotas/:id', adminController.deleteMascota);

module.exports = router;
