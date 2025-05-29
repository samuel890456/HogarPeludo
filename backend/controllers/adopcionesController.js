//backend/controllers/adopcionesController.js
const Adopcion = require('../models/adopcionesModel');
const Mascota = require('../models/mascotasModel');
const Usuario = require('../models/usuariosModel');
const enviarCorreo = require('../utils/correoUtils');

exports.solicitarAdopcion = async (req, res) => {
  try {
    const { mascota_id, adoptante_id } = req.body;

    // Validar datos
    if (!mascota_id || !adoptante_id) {
      return res.status(400).json({ error: 'Faltan datos obligatorios' });
    }

    // Obtener datos de la mascota
    const mascota = await Mascota.getById(mascota_id);
    if (!mascota) {
      return res.status(404).json({ error: 'Mascota no encontrada' });
    }

    // Obtener datos del dueño y adoptante
    const duenio = await Usuario.getById(mascota.usuario_id);
    const adoptante = await Usuario.getById(adoptante_id);
    

    console.log('🐶 Mascota:', mascota);
    console.log('👤 Adoptante:', adoptante);
    console.log('📬 Correo del dueño:', duenio.email);
    // Registrar la solicitud

    // Enviar correo al dueño
    console.log('🟡 Antes de enviarCorreo()');
await enviarCorreo({
  to: duenio.email,
  subject: `🐾 Nueva solicitud de adopción para ${mascota.nombre}`,
  html: `
    <h2>¡Hola ${duenio.nombre}!</h2>
    <p><strong>${adoptante.nombre}</strong> está interesado/a en adoptar a <strong>${mascota.nombre}</strong>.</p>
    <p><strong>Teléfono:</strong> ${adoptante.telefono || 'No disponible'}</p>
    <p><strong>Email:</strong> ${adoptante.email}</p>
    <p>¡Ponte en contacto para coordinar la adopción!</p>
    <br/>
    <p>❤️ Gracias por usar Adopción de Mascotas</p>
  `,
});

console.log('🟢 Después de enviarCorreo()');

const id = await Adopcion.create(mascota_id, adoptante_id);

    res.status(201).json({ message: 'Solicitud enviada exitosamente', id });
  } catch (error) {
    console.error('Error en solicitud de adopción:', error);
    res.status(500).json({ error: 'Error al procesar la solicitud' });
  }

};
