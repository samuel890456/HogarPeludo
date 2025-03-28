const Seguimiento = require('../models/seguimientoModel');

// Crear un nuevo registro de seguimiento
exports.createSeguimiento = async (req, res) => {
    try {
        const { solicitud_id, comentarios } = req.body;
        const id = await Seguimiento.create(solicitud_id, comentarios);
        res.status(201).json({ id, solicitud_id, comentarios });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

// Obtener todos los registros de seguimiento de una solicitud
exports.getSeguimientosBySolicitudId = async (req, res) => {
    try {
        const seguimientos = await Seguimiento.getBySolicitudId(req.params.solicitud_id);
        res.json(seguimientos);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};