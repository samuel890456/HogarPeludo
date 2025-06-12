//backend/controllers/authController.js
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const Usuario = require('../models/usuariosModel');
const crypto = require('crypto'); // Para generar tokens seguros
const enviarCorreo = require('../utils/correoUtils'); // <--- Importa tu utilidad de correo
// Registro de un nuevo usuario
exports.registrarUsuario = async (req, res) => {
    try {
        const { nombre, email, contraseña, telefono, direccion } = req.body;

        const usuarioExistente = await Usuario.getByEmail(email);
        if (usuarioExistente) {
            return res.status(400).json({ message: 'El correo electrónico ya está registrado' });
        }

        const hashedPassword = await bcrypt.hash(contraseña, 10);

        // Crear el usuario sin rol_id en la tabla usuarios
        const id = await Usuario.create(nombre, email, hashedPassword, telefono, direccion);

        // Asignar los roles por defecto (ej: 'publicador' y 'adoptante')
        const defaultRoles = ['2', '3']; // IDs de los roles 'publicador' y 'adoptante'
        for (const rolId of defaultRoles) {
            await Usuario.assignRole(id, rolId);
        }

        // Obtener los roles del usuario recién creado para el token
        const userRoles = await Usuario.getUserRoles(id); 

        // Generar un token JWT con el ARRAY de roles
        const token = jwt.sign({ id, email, roles: userRoles }, process.env.JWT_SECRET, { expiresIn: '1h' });

        res.status(201).json({ id, nombre, email, token, roles: userRoles });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

// Inicio de sesión de un usuario
exports.iniciarSesion = async (req, res) => {
    try {
        const { email, contraseña } = req.body;

        // Usa el nuevo método para obtener usuario con roles
        const usuario = await Usuario.getByEmailWithRoles(email); 
        if (!usuario) {
            return res.status(400).json({ message: 'Credenciales incorrectas' });
        }
        if (usuario.activo === 0 || usuario.estado === 'bloqueado') {
            return res.status(403).json({ message: 'Tu cuenta está bloqueada. Contacta al administrador.' });
        }
        const contraseñaValida = await bcrypt.compare(contraseña, usuario.contraseña);
        if (!contraseñaValida) {
            return res.status(400).json({ message: 'Credenciales incorrectas' });
        }

        // Asegúrate de que `usuario.roles` sea un array de strings de IDs de rol
        const userRoles = usuario.roles || [];

        // Generar un token JWT con el ARRAY de roles
        const token = jwt.sign({ id: usuario.id, email: usuario.email, roles: userRoles }, process.env.JWT_SECRET, { expiresIn: '1h' });

        // Devolver la respuesta con el token y el ARRAY de roles
        res.json({ id: usuario.id, nombre: usuario.nombre, email: usuario.email, token, roles: userRoles });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

// Middleware para verificar el token JWT
exports.verificarToken = (req, res, next) => {
    const token = req.header('Authorization')?.replace('Bearer ', '');

    if (!token) {
        return res.status(401).json({ message: 'Acceso denegado. Token no proporcionado.' });
    }

    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        req.usuario = decoded; // Añadir el usuario decodificado a la solicitud
        next();
    } catch (error) {
        res.status(400).json({ message: 'Token inválido.' });
    }
};

// @desc    Solicitar restablecimiento de contraseña
// @route   POST /api/auth/forgot-password
// @access  Public
exports.forgotPassword = async (req, res) => {
    const { email } = req.body;

    try {
        // Usar getByEmail para obtener el usuario sin necesidad de roles aquí
        const user = await Usuario.getByEmail(email); 

        if (!user) {
            // Siempre envía un mensaje genérico por seguridad, para no revelar si el email existe
            return res.status(200).json({ message: 'Si tu correo electrónico está registrado, recibirás un enlace para restablecer tu contraseña.' });
        }

        // Generar un token de restablecimiento único y seguro
        const resetToken = crypto.randomBytes(32).toString('hex'); // 32 bytes para un token más largo
        
        // Calcular la fecha de expiración (1 hora)
        const resetExpire = new Date(Date.now() + 3600000); // 1 hora en milisegundos

        // Guardar el token y la fecha de expiración en la base de datos
        await Usuario.saveResetToken(user.id, resetToken, resetExpire);

        // URL para el front-end con el token
        const resetUrl = `${process.env.FRONTEND_URL}/restablecer-contrasena/${resetToken}`;

        // Contenido del correo electrónico
        const emailHtml = `
            <div style="font-family: Arial, sans-serif; line-height: 1.6; color: #333;">
                <h2>Restablecimiento de Contraseña para Huellitas de Esperanza</h2>
                <p>Hola ${user.nombre},</p>
                <p>Has solicitado restablecer tu contraseña. Por favor, haz clic en el siguiente enlace para continuar:</p>
                <p style="text-align: center; margin: 20px 0;">
                    <a href="${resetUrl}" style="background-color: #A8DAD7; color: white; padding: 12px 25px; text-decoration: none; border-radius: 8px; font-weight: bold;">
                        Restablecer Contraseña
                    </a>
                </p>
                <p>Este enlace es válido por 1 hora. Si no lo usas antes de que expire, tendrás que solicitar uno nuevo.</p>
                <p>Si no solicitaste esto, por favor ignora este correo electrónico.</p>
                <p>Gracias,<br/>El equipo de Huellitas de Esperanza</p>
            </div>
        `;

        // Enviar correo utilizando tu utilidad
        await enviarCorreo({
            to: user.email,
            subject: '🐾 Restablecimiento de Contraseña - Huellitas de Esperanza',
            html: emailHtml,
        });

        res.status(200).json({ message: 'Si tu correo electrónico está registrado, recibirás un enlace para restablecer tu contraseña.' });

    } catch (error) {
        console.error('Error en forgotPassword (controlador):', error);
        res.status(500).json({ message: 'Error en el servidor al procesar tu solicitud de restablecimiento.' });
    }
};

// @desc    Restablecer contraseña
// @route   POST /api/auth/reset-password/:token
// @access  Public
exports.resetPassword = async (req, res) => {
    const { token } = req.params;
    const { newPassword } = req.body;

    // Puedes añadir validación de contraseña aquí si quieres (ej. longitud mínima)
    if (!newPassword || newPassword.length < 6) {
        return res.status(400).json({ message: 'La nueva contraseña debe tener al menos 6 caracteres.' });
    }

    try {
        // Encontrar el usuario por el token y verificar que no ha expirado
        const user = await Usuario.findByResetToken(token);

        if (!user) {
            return res.status(400).json({ message: 'El enlace de restablecimiento es inválido o ha expirado. Por favor, solicita uno nuevo.' });
        }

        // Hash de la nueva contraseña
        const hashedPassword = await bcrypt.hash(newPassword, 10);

        // Actualizar la contraseña del usuario y limpiar los campos de token
        await Usuario.updatePasswordAndClearToken(user.id, hashedPassword);

        res.status(200).json({ message: 'Contraseña restablecida con éxito.' });

    } catch (error) {
        console.error('Error en resetPassword (controlador):', error);
        res.status(500).json({ message: 'Error en el servidor al restablecer la contraseña. Por favor, inténtalo de nuevo.' });
    }
};

