// backend/routes/mascotasRoutes.js
const express = require('express');
const mascotasController = require('../controllers/mascotasController');
const authController = require('../controllers/authController');

const router = express.Router();
const multer = require('multer');
const path = require('path'); // Necesario para path.extname

// Configuración de Multer para almacenar imágenes en una carpeta 'uploads'
const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, 'uploads/'); // Asegúrate de que esta carpeta exista en la raíz de tu backend
    },
    filename: function (req, file, cb) {
        cb(null, Date.now() + path.extname(file.originalname)); // Nombre único del archivo
    }
});

const upload = multer({ storage: storage });

// Obtener todas las mascotas
router.get('/', mascotasController.getAllMascotas);
// Ruta pública para ver mascotas de un usuario/fundación sin autenticación
router.get('/publico/usuario/:id', mascotasController.getMascotasByUserIdPublic);

// Obtener mascotas por ID de usuario (¡NUEVA RUTA!)
router.get('/usuario/:id', authController.verificarToken, mascotasController.getMascotasByUserId); // <--- AÑADE ESTA LÍNEA
// Obtener una mascota por su ID
router.get('/:id', mascotasController.getMascotaById);

// Crear una nueva mascota (protegida)
router.post('/', authController.verificarToken, upload.single('imagen'), mascotasController.createMascota); // Cambiado 'foto' a 'imagen'

// Actualizar una mascota existente (protegida)
router.put('/:id', authController.verificarToken, upload.single('imagen'), mascotasController.updateMascota); // Cambiado 'foto' a 'imagen'

// Eliminar una mascota (protegida)
router.delete('/:id', authController.verificarToken, mascotasController.deleteMascota);

module.exports = router;