const mysql = require('mysql2');

// Configuración de la conexión a la base de datos
const pool = mysql.createPool({
    host: 'localhost',
    user: 'root', // Cambia esto por tu usuario de MySQL
    password: 'admin', // Cambia esto por tu contraseña de MySQL
    database: 'adopcion_mascotas',
    waitForConnections: true,
    connectionLimit: 10,
    queueLimit: 0
});

// Exportar el pool para su uso en otros archivos
const db = pool.promise();

// Función para mostrar las mascotas
async function mostrarMascotas() {
    try {
        console.log('Conexión a la base de datos exitosa.');
        // Consulta para seleccionar todas las mascotas
        const [rows] = await db.query('SELECT * FROM mascotas');
        
        if (rows.length === 0) {
            console.log('No hay mascotas registradas.');
        } else {
            console.log('Mascotas registradas:');
            rows.forEach((mascota, index) => {
                console.log(`\nMascota #${index + 1}:`);
                console.log(`  ID: ${mascota.id}`);
                console.log(`  Nombre: ${mascota.nombre}`);
                console.log(`  Especie: ${mascota.especie}`);
                console.log(`  Raza: ${mascota.raza}`);
                console.log(`  Edad: ${mascota.edad}`);
                console.log(`  Género: ${mascota.genero}`);
                console.log(`  Tamaño: ${mascota.tamaño}`);
                console.log(`  Descripción: ${mascota.descripcion}`);
                console.log(`  Foto: ${mascota.foto}`);
                console.log(`  Fecha de Ingreso: ${mascota.fecha_ingreso}`);
                console.log(`  Estado: ${mascota.estado}`);
            });
        }
    } catch (error) {
        console.error('Error al conectar a la base de datos:', error);
        console.error('Error al obtener las mascotas:', error);
    }
}

// Llamar a la función para mostrar las mascotas
mostrarMascotas();

module.exports = db;