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

exports.updateAdopcionEstado = async (req, res) => {
    try {
        const Notificacion = require('../models/notificacionesModel');
        const { id } = req.params;
        const { estado } = req.body;
        const userId = req.usuario.id; // ID del usuario que realiza la acción (publicador/admin)

        // 1. Validar el estado
        const estadosValidos = ['pendiente', 'aprobada', 'rechazada', 'completada'];
        if (!estadosValidos.includes(estado)) {
            return res.status(400).json({ message: 'Estado de adopción inválido.' });
        }

        // 2. Obtener la solicitud de adopción y la mascota asociada
        const solicitud = await Adopcion.getById(id);
        if (!solicitud) {
            return res.status(404).json({ message: 'Solicitud de adopción no encontrada.' });
        }

        const mascota = await Mascota.getById(solicitud.mascota_id);
        if (!mascota) {
            return res.status(404).json({ message: 'Mascota asociada a la solicitud no encontrada.' });
        }

        // 3. Verificar permisos: Solo el publicador de la mascota o un admin puede actualizar el estado
        if (mascota.publicado_por_id !== userId && !req.usuario.roles.includes('1')) { // '1' es el rol de admin
            return res.status(403).json({ message: 'No tienes permiso para actualizar esta solicitud.' });
        }

        // 4. Actualizar el estado de la solicitud en la base de datos
        await Adopcion.updateEstado(id, estado);

        // 5. Si la adopción es aprobada, actualizar la disponibilidad de la mascota
        if (estado === 'aprobada') {
            await Mascota.updateDisponibilidad(mascota.id, 0); // 0 = no disponible
        } else if (estado === 'rechazada') {
            // Si se rechaza, y la mascota estaba no disponible por esta solicitud, podría volver a estar disponible
            // Esto es una lógica más compleja, por ahora solo nos aseguramos de que si se aprueba, se desactive.
            // Si la mascota ya estaba no disponible por otra razón, no la activamos automáticamente.
        }

        // 6. Enviar notificación al adoptante
        const adoptante = await Usuario.getById(solicitud.adoptante_id);
        if (adoptante) {
            let mensajeNotificacion = '';
            let emailSubject = '';
            let emailHtml = '';

            switch (estado) {
                case 'aprobada':
                    mensajeNotificacion = `¡Felicidades! Tu solicitud de adopción para ${mascota.nombre} ha sido APROBADA.`;
                    emailSubject = `🎉 ¡Tu solicitud para ${mascota.nombre} ha sido APROBADA!`;
                    emailHtml = `
                        <h2>¡Felicidades, ${adoptante.nombre}!</h2>
                        <p>Tu solicitud de adopción para <strong>${mascota.nombre}</strong> ha sido <strong>APROBADA</strong>.</p>
                        <p>El publicador de la mascota se pondrá en contacto contigo para coordinar los siguientes pasos.</p>
                        <p>¡Pronto tendrás a ${mascota.nombre} en tu hogar!</p>
                    `;
                    break;
                case 'rechazada':
                    mensajeNotificacion = `Tu solicitud de adopción para ${mascota.nombre} ha sido RECHAZADA.`;
                    emailSubject = `😔 Tu solicitud para ${mascota.nombre} ha sido RECHAZADA`;
                    emailHtml = `
                        <h2>Hola, ${adoptante.nombre},</h2>
                        <p>Lamentamos informarte que tu solicitud de adopción para <strong>${mascota.nombre}</strong> ha sido <strong>RECHAZADA</strong>.</p>
                        <p>Puedes buscar otras mascotas disponibles en nuestra plataforma.</p>
                    `;
                    break;
                case 'completada':
                    mensajeNotificacion = `¡La adopción de ${mascota.nombre} ha sido COMPLETADA!`;
                    emailSubject = `✅ Adopción de ${mascota.nombre} COMPLETADA`;
                    emailHtml = `
                        <h2>¡Felicidades, ${adoptante.nombre}!</h2>
                        <p>La adopción de <strong>${mascota.nombre}</strong> ha sido marcada como <strong>COMPLETADA</strong>.</p>
                        <p>Esperamos que disfrutes mucho de tu nuevo compañero.</p>
                    `;
                    break;
                default:
                    mensajeNotificacion = `El estado de tu solicitud para ${mascota.nombre} ha cambiado a ${estado}.`;
                    emailSubject = `Cambio de estado en tu solicitud para ${mascota.nombre}`; 
                    emailHtml = `
                        <h2>Hola, ${adoptante.nombre},</h2>
                        <p>El estado de tu solicitud de adopción para <strong>${mascota.nombre}</strong> ha cambiado a <strong>${estado}</strong>.</p>
                    `;
                    break;
            }

            await Notificacion.create(
                adoptante.id,
                'estado_solicitud',
                mensajeNotificacion,
                `/solicitudes` // Enlace a la página de solicitudes del adoptante
            );

            await enviarCorreo({
                to: adoptante.email,
                subject: emailSubject,
                html: emailHtml,
            });
        }

        res.status(200).json({ message: 'Estado de solicitud actualizado exitosamente.' });

    } catch (error) {
        console.error('🔴 Error en updateAdopcionEstado (controlador):', error);
        res.status(500).json({ error: 'Error al actualizar el estado de la solicitud.' });
    }
};