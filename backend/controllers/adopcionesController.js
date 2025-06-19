// backend/controllers/adopcionesController.js
const Adopcion = require('../models/adopcionesModel');
const Mascota = require('../models/mascotasModel');
const Usuario = require('../models/usuariosModel');
const enviarCorreo = require('../utils/correoUtils');

exports.solicitarAdopcion = async (req, res) => {
  try {
    const Notificacion = require('../models/notificacionesModel'); // Importa el modelo de notificación
    
    const { mascota_id, adoptante_id } = req.body;
    
    // Validar datos obligatorios
    if (!mascota_id || !adoptante_id) {
      return res.status(400).json({ error: 'Faltan datos obligatorios (mascota_id o adoptante_id)' });
    }

    // --- NUEVA LÓGICA DE VERIFICACIÓN DE DUPLICADOS ---
    console.log('🔵 Controlador: Verificando si ya existe una solicitud para esta mascota y adoptante...');
    const existingSolicitud = await Adopcion.getExistingSolicitud(mascota_id, adoptante_id);

    if (existingSolicitud) {
      // Si ya existe una solicitud
      console.log('🔵 Controlador: Solicitud existente encontrada:', existingSolicitud);
      // Puedes adaptar el mensaje según el estado de la solicitud existente
      let message = 'Ya has enviado una solicitud de adopción para esta mascota.';
      if (existingSolicitud.estado === 'pendiente') {
        message = 'Ya tienes una solicitud pendiente para esta mascota.';
      } else if (existingSolicitud.estado === 'aprobada') {
        message = 'Tu solicitud de adopción para esta mascota ya fue aprobada.';
      }
      // Envía una respuesta 409 Conflict para indicar un conflicto de recursos
      return res.status(409).json({ error: message });
    }
    // --- FIN DE LA NUEVA LÓGICA ---

    // Obtener datos de la mascota
    const mascota = await Mascota.getById(mascota_id);
    if (!mascota) {
      return res.status(404).json({ error: 'Mascota no encontrada' });
    }

    // Obtener datos del dueño (publicado_por_id) y adoptante
    const duenio = await Usuario.getById(mascota.publicado_por_id);
    const adoptante = await Usuario.getById(adoptante_id);
    
    // Verificaciones adicionales para duenio y adoptante
    if (!duenio) {
        return res.status(404).json({ error: 'Dueño de la mascota no encontrado' });
    }
    if (!adoptante) {
        return res.status(404).json({ error: 'Adoptante no encontrado' });
    }
    
    // Registrar la solicitud en la base de datos
    console.log('🔵 Controlador: Antes de llamar a Adopcion.create()');
    const id = await Adopcion.create(mascota_id, adoptante_id, 'pendiente'); 
    console.log('🔵 Controlador: Después de llamar a Adopcion.create(), ID:', id);

    // Crear notificación para el publicador de la mascota
    await Notificacion.create(
        duenio.id, // ID del publicador
        'nueva_solicitud',
        `¡${adoptante.nombre} ha solicitado adoptar a ${mascota.nombre}!`,
        `/solicitudes`
    );

    console.log('🐶 Mascota:', mascota.nombre);
    console.log('👤 Adoptante:', adoptante.nombre);
    console.log('📬 Correo del dueño:', duenio.email);
    
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

    

    return res.status(201).json({ message: 'Solicitud enviada exitosamente', id_solicitud: id });
  } catch (error) {
    console.error('🔴 Error en solicitud de adopción (controlador):', error);
    // Asegúrate de enviar un error amigable al frontend
    return res.status(500).json({ error: 'Error al procesar la solicitud. Por favor, inténtalo de nuevo más tarde.' });
  }
};