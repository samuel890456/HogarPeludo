const bcrypt = require('bcrypt');
const Usuario = require('../models/usuariosModel'); // Ajusta la ruta si es diferente

const createAdmin = async () => {
    try {
        const nombre = 'Admin';
        const email = 'admin@example.com';
        const contraseña = 'admin123';
        const telefono = '1234567890';
        const direccion = 'Calle Principal';

        // Verificar si ya existe un usuario con ese email
        const usuarioExistente = await Usuario.getByEmail(email);
        if (usuarioExistente) {
            console.log('❌ Ya existe un usuario con ese correo.');
            return;
        }

        // Encriptar contraseña
        const hashedPassword = await bcrypt.hash(contraseña, 10);

        // Crear usuario
        const usuarioId = await Usuario.create(nombre, email, hashedPassword, telefono, direccion);
        console.log(`✅ Usuario creado con ID: ${usuarioId}`);

        // Asignar rol de administrador (rol_id = 1)
        await Usuario.assignRole(usuarioId, 1);
        console.log('✅ Rol de administrador asignado correctamente.');
    } catch (error) {
        console.error('❌ Error al crear el administrador:', error);
    }
};

createAdmin();
