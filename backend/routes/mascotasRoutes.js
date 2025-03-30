//backend/routes/mascotasRoutes.js
const express = require('express');
const mascotasController = require('../controllers/mascotasController');
const authController = require('../controllers/authController');

const router = express.Router();
const multer = require('multer');
const upload = multer({ dest: 'uploads/' }); // Carpeta donde se guardarán las imágenes

// Obtener todas las mascotas
router.get('/', mascotasController.getAllMascotas);

// Obtener una mascota por su ID
router.get('/:id', mascotasController.getMascotaById);

// Crear una nueva mascota (protegida)
router.post('/', authController.verificarToken, upload.single('foto'), mascotasController.createMascota);

// Actualizar una mascota existente (protegida)
router.put('/:id', authController.verificarToken, mascotasController.updateMascota);

// Eliminar una mascota (protegida)
router.delete('/:id', authController.verificarToken, mascotasController.deleteMascota);

module.exports = router;