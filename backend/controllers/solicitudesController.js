//file: backend/controllers/solicitudesController.js
const Solicitud = require('../models/solicitudesModel');
const Notificacion = require('../models/notificacionesModel'); // Asegúrate de que este import esté aquí
const Usuario = require('../models/usuariosModel'); // Asegúrate de que este import esté aquí
const Mascota = require('../models/mascotasModel'); // <--- ¡Añadir este import aquí!
const enviarCorreo = require('../utils/correoUtils');

const solicitudesController = {
    // Crear una solicitud
    createSolicitud: async (req, res) => {
        try {
            const { mascota_id } = req.body;
            const adoptante_id = req.usuario.id; // The ID of the authenticated user
            if (!mascota_id) {
                return res.status(400).json({ message: 'Se requiere el ID de la mascota.' });
            }

            // Check if the authenticated user has the 'adoptante' role (ID '3')
            // This adds a layer of role-based authorization for creating a request
            if (!req.usuario.roles.includes('3') && !req.usuario.roles.includes('1')) { // Allow admins too
                return res.status(403).json({ message: 'No tienes permiso para crear solicitudes de adopción.' });
            }

            if (!mascota_id || !adoptante_id) {
                return res.status(400).json({ message: 'Se requiere el ID de la mascota.' });
            }

            const nuevaSolicitud = await Solicitud.create(mascota_id, adoptante_id);
            res.status(201).json({ message: 'Solicitud de adopción creada exitosamente.', solicitud: nuevaSolicitud });
        } catch (error) {
            console.error('Error al crear la solicitud:', error);
            res.status(500).json({ message: 'Error interno del servidor al crear la solicitud.' });
        }
    },

    // Obtener solicitudes (filtrado por rol)
    getSolicitudes: async (req, res) => {
        try {

            const userId = req.usuario.id;
            // Access the 'roles' array from req.usuario
            const userRoles = req.usuario.roles;

            let solicitudes = [];

            if (userRoles.includes('1')) {
                solicitudes = await Solicitud.getAll();
            } else {
                const allSolicitudes = [];

                if (userRoles.includes('2')) {
                    const publicadorSolicitudes = await Solicitud.getByPublicadorId(userId);
                    allSolicitudes.push(...publicadorSolicitudes);
                }

                if (userRoles.includes('3')) {
                    const adoptanteSolicitudes = await Solicitud.getByAdoptanteId(userId);
                    allSolicitudes.push(...adoptanteSolicitudes);
                }

                solicitudes = allSolicitudes;
            }

            res.status(200).json(solicitudes);
        } catch (error) {
            console.error('Error al obtener las solicitudes:', error);
            res.status(500).json({ message: 'Error interno del servidor al obtener las solicitudes.' });
        }
    },

    // Actualizar el estado de una solicitud
    updateEstadoSolicitud: async (req, res) => {
        try {
            const { id } = req.params;
            const { estado } = req.body;
            const userId = req.usuario.id;
            // Access the 'roles' array from req.usuario
            const userRoles = req.usuario.roles;
            

            // Validate that the state is one of the allowed ones
            const estadosPermitidos = ['pendiente', 'aceptada', 'rechazada'];
            if (!estadosPermitidos.includes(estado)) {
                return res.status(400).json({ message: 'Estado de solicitud inválido.' });
            }

            // Para garantizar que solo el publicador de la mascota o un administrador puedan cambiar el estado.
            // Primero, obtenga la solicitud para verificar la propiedad.
            // Nota: Solicitud.getBySolicitudId debe devolver un solo objeto o un valor nulo.
            const solicitudInfo = await Solicitud.getBySolicitudId(id);

            if (!solicitudInfo) {
                return res.status(404).json({ message: 'Solicitud no encontrada.' });
            }

            // Verifica permisos
            if (
                userRoles.includes('1') ||
                (userRoles.includes('2') && solicitudInfo.publicador_id === userId)
            ) {
                const actualizado = await Solicitud.updateState(id, estado);
                if (actualizado) {
                    // Obtener info de la solicitud y del adoptante para la notificación/correo
                    const solicitudDetalle = await Solicitud.getBySolicitudId(id); // Debe retornar un objeto
                    const adoptanteInfo = await Usuario.getById(solicitudDetalle.adoptante_id);
                    const mascotaInfo = await Mascota.getById(solicitudDetalle.mascota_id);

                    // Crear notificación para el adoptante
                    let notifMensaje = '';
                    if (estado === 'aceptada') {
                        notifMensaje = `¡Felicidades! Tu solicitud para adoptar a ${mascotaInfo.nombre} ha sido ACEPTADA.`;
                        await Mascota.updateDisponibilidad(mascotaInfo.id, 0); // Marcar mascota como no disponible
                    } else if (estado === 'rechazada') {
                        notifMensaje = `Tu solicitud para adoptar a ${mascotaInfo.nombre} ha sido RECHAZADA.`;
                    } else {
                        notifMensaje = `El estado de tu solicitud para ${mascotaInfo.nombre} ha cambiado a PENDIENTE.`;
                    }

                    await Notificacion.create(
                        adoptanteInfo.id,
                        'solicitud_actualizada',
                        notifMensaje,
                        `/solicitudes`
                    );

                    // Envía correo al adoptante
                    await enviarCorreo({
                        to: adoptanteInfo.email,
                        subject: `Actualización de tu solicitud para ${mascotaInfo.nombre}`,
                        html: `
                        <h2>Hola ${adoptanteInfo.nombre},</h2>
                        <p>Te informamos que tu solicitud de adopción para <strong>${mascotaInfo.nombre}</strong> ha sido <strong>${estado.toUpperCase()}</strong>.</p>
                        <p>Puedes revisar el estado y más detalles en tu sección de solicitudes.</p>
                        <br/>
                        <p>❤️ Huellitas de Esperanza</p>
                        `,
                    });

                    return res.status(200).json({ message: 'Estado de la solicitud actualizado exitosamente.' });
                } else {
                    return res.status(404).json({ message: 'Solicitud no encontrada o no se pudo actualizar.' });
                }
            } else {
                return res.status(403).json({ message: 'No tienes permisos para actualizar esta solicitud.' });
            }
        } catch (error) {
            console.error('Error al actualizar el estado de la solicitud:', error);
            res.status(500).json({ message: 'Error interno del servidor al actualizar el estado de la solicitud.' });
        }
    },

    // Eliminar una solicitud
    deleteSolicitud: async (req, res) => {
        try {
            const { id } = req.params;
            const userId = req.usuario.id;
            // Access the 'roles' array from req.usuario
            const userRoles = req.usuario.roles;






            // First, get the request to verify ownership
            // Note: Your Solicitud.getBySolicitudId should return a single object or null
            const solicitudInfo = await Solicitud.getBySolicitudId(id);
            console.log('Solicitud encontrada:', solicitudInfo);

            if (!solicitudInfo) {
                return res.status(404).json({ message: 'Solicitud no encontrada.' });
            }

            // Only the adoptante who made the request, the publicador of the pet, or an admin can delete
            // Check if '1' (admin), '3' (adoptante), or '2' (publicador) is in roles
            if (userRoles.includes('2') || (userRoles.includes('3') && solicitudInfo.adoptante_id === userId) || (userRoles.includes('2') && solicitudInfo.publicador_id === userId)) {
                const eliminado = await Solicitud.delete(id);
                if (eliminado) {
                    res.status(200).json({ message: 'Solicitud eliminada exitosamente.' });
                } else {
                    res.status(404).json({ message: 'Solicitud no encontrada o no se pudo eliminar.' });
                }
            } else {
                return res.status(403).json({ message: 'No tienes permisos para eliminar esta solicitud.' });
            }

        } catch (error) {
            console.error('Error al eliminar la solicitud:', error);
            res.status(500).json({ message: 'Error interno del servidor al eliminar la solicitud.' });
        }
    }
};

module.exports = solicitudesController;