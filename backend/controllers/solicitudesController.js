const Solicitud = require('../models/solicitudesModel');

// Crear una nueva solicitud de adopción
exports.createSolicitud = async (req, res) => {
    try {
        const { usuario_id, mascota_id, comentarios } = req.body;
        const id = await Solicitud.create(usuario_id, mascota_id, comentarios);
        res.status(201).json({ id, usuario_id, mascota_id, comentarios });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

// Obtener todas las solicitudes de un usuario
exports.getSolicitudesByUsuarioId = async (req, res) => {
    try {
        const solicitudes = await Solicitud.getByUsuarioId(req.params.usuario_id);
        res.json(solicitudes);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

// Actualizar el estado de una solicitud
exports.updateEstadoSolicitud = async (req, res) => {
    try {
        const { estado } = req.body;
        await Solicitud.updateEstado(req.params.id, estado);
        res.json({ message: 'Estado de la solicitud actualizado correctamente' });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};