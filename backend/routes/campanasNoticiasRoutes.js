const express = require('express');
const router = express.Router();
const {
    getAllCampanasNoticias,
    getCampanaNoticiaById,
    getCampanasNoticiasByTipo,
    createCampanaNoticia,
    updateCampanaNoticia,
    deleteCampanaNoticia,
    likeCampanaNoticia,
    getEstadisticas
} = require('../controllers/campanasNoticiasController');
const { verificarToken, verificarAdmin } = require('../middlewares/authMiddleware');

// Rutas públicas
router.get('/', getAllCampanasNoticias);
router.get('/tipo/:tipo', getCampanasNoticiasByTipo);
router.get('/:id', getCampanaNoticiaById);

// Rutas que requieren autenticación
router.post('/:id/like', verificarToken, likeCampanaNoticia);

// Rutas que requieren rol de administrador
router.post('/', verificarToken, verificarAdmin, createCampanaNoticia);
router.put('/:id', verificarToken, verificarAdmin, updateCampanaNoticia);
router.delete('/:id', verificarToken, verificarAdmin, deleteCampanaNoticia);
router.get('/admin/estadisticas', verificarToken, verificarAdmin, getEstadisticas);

module.exports = router; 