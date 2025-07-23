const express = require('express');
const usuariosController = require('../controllers/usuariosController');
const authController = require('../controllers/authController');
const multer = require('multer');
const path = require('path');
const fs = require('fs');

const router = express.Router();

// Configuración de Multer para la carga de imágenes de perfil
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        const uploadPath = path.join(__dirname, '..', 'uploads'); // Subir al directorio 'uploads' en la raíz del backend
        if (!fs.existsSync(uploadPath)) {
            fs.mkdirSync(uploadPath, { recursive: true });
        }
        cb(null, uploadPath);
    },
    filename: (req, file, cb) => {
        cb(null, Date.now() + '-' + file.originalname);
    }
});
const upload = multer({ storage: storage });

// Obtener un usuario por su ID (protegida)
router.get('/:id', authController.verificarToken, usuariosController.getUsuarioById);

// Actualizar un usuario existente (protegida) - Ahora con Multer para la foto de perfil
router.put('/:id', authController.verificarToken, upload.single('foto_perfil'), usuariosController.updateUsuario);

// Ruta para cambiar la contraseña
router.put('/:id/cambiar-contrasena', authController.verificarToken, usuariosController.changePassword);

// Ruta para solicitar cambio de rol a refugio
router.post('/:id/solicitar-rol-refugio', authController.verificarToken, usuariosController.requestRoleChange);

// Ruta para eliminar la cuenta
router.delete('/:id', authController.verificarToken, usuariosController.eliminarUsuario);

// Rutas para la gestión de solicitudes de rol (solo para administradores)
router.get('/solicitudes-rol-pendientes', authController.verificarToken, authController.checkRole(['1']), usuariosController.getPendingRoleRequests);
router.put('/:userId/aprobar-rol', authController.verificarToken, authController.checkRole(['1']), usuariosController.approveRoleRequest);
router.put('/:userId/rechazar-rol', authController.verificarToken, authController.checkRole(['1']), usuariosController.rejectRoleRequest);

module.exports = router;