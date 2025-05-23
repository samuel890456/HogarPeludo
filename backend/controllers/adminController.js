//backend/controllers/adminController.js
const Mascota = require('../models/mascotasModel');
const Solicitud = require('../models/solicitudesModel');
const Usuario = require('../models/usuariosModel');

exports.getResumenGeneral = async (req, res) => {
    try {
        const totalMascotas = await Mascota.count();
        const totalSolicitudes = await Solicitud.count();
        const totalUsuarios = await Usuario.count();
        res.json({ totalMascotas, totalSolicitudes, totalUsuarios });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

exports.getMascotas = async (req, res) => {
    try {
        const mascotas = await Mascota.getAll();
        res.json(mascotas);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

exports.getSolicitudes = async (req, res) => {
    try {
        const solicitudes = await Solicitud.getAll();
        res.json(solicitudes);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

exports.getUsuarios = async (req, res) => {
    try {
        const usuarios = await Usuario.getAll();
        res.json(usuarios);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};


exports.toggleUsuarioStatus = async (req, res) => {
    try {
        const usuario = await Usuario.getById(req.params.id);
        if (!usuario) return res.status(404).json({ message: "Usuario no encontrado" });

        const nuevoEstado = usuario.activo ? 0 : 1;
        await Usuario.updateStatus(req.params.id, nuevoEstado);
        res.json({ message: `Usuario ${nuevoEstado ? 'activado' : 'desactivado'} correctamente` });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

exports.deleteMascota = async (req, res) => {
    try {
        await Mascota.delete(req.params.id);
        res.json({ message: 'Mascota eliminada correctamente' });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};
// controllers/adminController.js
exports.toggleEstadoUsuario = async (req, res) => {
    try {
        const nuevoEstado = await Usuario.toggleEstado(req.params.id);
        res.json({ message: `Usuario ${nuevoEstado === 'activo' ? 'desbloqueado' : 'bloqueado'} correctamente`, estado: nuevoEstado });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Error al cambiar el estado del usuario' });
    }
};
exports.rechazarSolicitud = async (req, res) => {
    const { id } = req.params;
    try {
        await Solicitud.update({ estado: 'rechazada' }, { where: { id } });
        res.json({ message: 'Solicitud rechazada correctamente' });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Error al rechazar la solicitud' });
    }
};
exports.aprobarSolicitud = async (req, res) => {
    const { id } = req.params;
    try {
        await Solicitud.update({ estado: 'aprobada' }, { where: { id } });
        res.json({ message: 'Solicitud aprobada correctamente' });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Error al aprobar la solicitud' });
    }
};

exports.updateSolicitud = async (req, res) => {
    try {
        const { estado } = req.body;
        await Solicitud.update(req.params.id, estado);
        res.json({ message: 'Solicitud actualizada correctamente' });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};
