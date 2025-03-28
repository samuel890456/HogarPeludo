/*const bcrypt = require('bcrypt');
const Usuario = require('../models/usuariosModel');

const createAdmin = async () => {
    try {
        const nombre = 'Admin';
        const email = 'admin@example.com';
        const contraseña = 'admin123';
        const hashedPassword = await bcrypt.hash(contraseña, 10);

        // Crear el usuario administrador
        const id = await Usuario.create(nombre, email, hashedPassword, null, null, 1);
        console.log(`Usuario administrador creado con ID: ${id}`);
    } catch (error) {
        console.error('Error al crear el usuario administrador:', error);
    }
};

createAdmin();*/