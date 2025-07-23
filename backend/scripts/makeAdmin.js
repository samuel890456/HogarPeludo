require('dotenv').config({ path: __dirname + '/../.env' }); // Esto asegura la ruta correcta
const db = require('../config/db'); // Importa la conexión a la base de datos
const Usuario = require('../models/usuariosModel'); // Importa el modelo de Usuario

async function makeUserAdmin() {
    const userIdToMakeAdmin = process.argv[2]; // Obtiene el ID del usuario de los argumentos de la línea de comandos

    if (!userIdToMakeAdmin) {
        console.log('Uso: node scripts/makeAdmin.js <ID_DEL_USUARIO>');
        console.log('Por favor, proporciona el ID del usuario al que quieres hacer administrador.');
        process.exit(1);
    }

    try {
        const user = await Usuario.getById(userIdToMakeAdmin);
        if (!user) {
            console.error(`Usuario con ID ${userIdToMakeAdmin} no encontrado.`);
            return;
        }

        // Verifica si el usuario ya tiene el rol de administrador (ID '1')
        const userRoles = await Usuario.getUserRoles(userIdToMakeAdmin);
        if (userRoles.includes('1')) { // '1' es el ID del rol de administrador
            console.log(`El usuario ${user.email} (ID: ${userIdToMakeAdmin}) ya es administrador.`);
            return;
        }

        // Asigna el rol de administrador (ID '1')
        await Usuario.assignRole(userIdToMakeAdmin, '1');
        console.log(`¡Éxito! Rol de administrador asignado al usuario ${user.email} (ID: ${userIdToMakeAdmin}).`);

    } catch (error) {
        console.error('Error al asignar el rol de administrador:', error);
    } finally {
        // Cierra la conexión a la base de datos
        if (db.end) {
            await db.end();
        }
    }
}

makeUserAdmin();
