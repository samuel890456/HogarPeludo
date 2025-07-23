//backend/controllers/adminController.js
const Mascota = require('../models/mascotasModel');
const Solicitud = require('../models/solicitudesModel');
const Usuario = require('../models/usuariosModel');
const Fundacion = require('../models/fundacionesModel'); // Importar el modelo de Fundacion


exports.getResumenGeneral = async (req, res) => {
    try {
        const totalMascotas = await Mascota.count();
        const totalSolicitudes = await Solicitud.count();
        const totalUsuarios = await Usuario.count();
        const totalFundaciones = await Fundacion.count(); // Obtener el total de fundaciones
        res.json({ totalMascotas, totalSolicitudes, totalUsuarios, totalFundaciones }); // Incluir totalFundaciones en la respuesta
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

exports.getMascotas = async (req, res) => {
    try {
        const page = parseInt(req.query.page) || 1;
        const limit = parseInt(req.query.limit) || 10;
        const offset = (page - 1) * limit;

        const { mascotas, total } = await Mascota.getAllIncludingUnavailable(limit, offset);
        res.json({ mascotas, total, page, limit });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

exports.getSolicitudes = async (req, res) => {
    try {
        const { searchTerm, estado, especie } = req.query;
        const solicitudes = await Solicitud.getAll(searchTerm, estado, especie);
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

exports.getRankingAdopcionesPorEspecie = async (req, res) => {
    try {
        const [rows] = await Mascota.getAdopcionesPorEspecie();
        res.json(rows);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

exports.getAdopcionesPorMes = async (req, res) => {
    try {
        const [rows] = await Mascota.getAdopcionesPorMes();
        res.json(rows);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

exports.getTopMascotasPopulares = async (req, res) => {
    try {
        const [rows] = await Mascota.getTopPopulares(5);
        res.json(rows);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

// Métodos para manejar solicitudes de rol
exports.getSolicitudesRolPendientes = async (req, res) => {
    try {
        const solicitudes = await Usuario.getPendingRoleRequests();
        res.json(solicitudes);
    } catch (error) {
        console.error('Error al obtener solicitudes de rol pendientes:', error);
        res.status(500).json({ error: error.message });
    }
};

exports.aprobarSolicitudRol = async (req, res) => {
    try {
        const { id } = req.params;
        
        // Cambiar el estado de la solicitud a aprobada
        await Usuario.saveRoleRequest(id, null, 'aprobada');
        
        // Asignar el rol de refugio al usuario (rol_id = 2)
        await Usuario.assignRole(id, 2);
        
        res.json({ message: 'Solicitud de rol aprobada correctamente' });
    } catch (error) {
        console.error('Error al aprobar solicitud de rol:', error);
        res.status(500).json({ error: error.message });
    }
};

exports.rechazarSolicitudRol = async (req, res) => {
    try {
        const { id } = req.params;
        
        // Cambiar el estado de la solicitud a rechazada
        await Usuario.saveRoleRequest(id, null, 'rechazada');
        
        res.json({ message: 'Solicitud de rol rechazada correctamente' });
    } catch (error) {
        console.error('Error al rechazar solicitud de rol:', error);
        res.status(500).json({ error: error.message });
    }
};

// Métodos para la gestión de fundaciones
exports.getFundaciones = async (req, res) => {
    try {
        const { searchTerm, estado, ciudad } = req.query;
        const fundaciones = await Fundacion.findAll(searchTerm, estado, ciudad);
        res.json(fundaciones);
    } catch (error) {
        console.error('Error al obtener fundaciones:', error);
        res.status(500).json({ error: error.message });
    }
};

exports.aprobarFundacion = async (req, res) => {
    try {
        const { id } = req.params;
        await Fundacion.updateStatus(id, 'aprobada'); // Asumiendo que hay un método updateStatus en Fundacion model
        res.json({ message: 'Fundación aprobada correctamente' });
    } catch (error) {
        console.error('Error al aprobar fundación:', error);
        res.status(500).json({ error: error.message });
    }
};

exports.rechazarFundacion = async (req, res) => {
    try {
        const { id } = req.params;
        await Fundacion.updateStatus(id, 'rechazada'); // Asumiendo que hay un método updateStatus en Fundacion model
        res.json({ message: 'Fundación rechazada correctamente' });
    } catch (error) {
        console.error('Error al rechazar fundación:', error);
        res.status(500).json({ error: error.message });
    }
};

exports.eliminarFundacion = async (req, res) => {
    try {
        const { id } = req.params;
        await Fundacion.delete(id);
        res.json({ message: 'Fundación eliminada correctamente' });
    } catch (error) {
        console.error('Error al eliminar fundación:', error);
        res.status(500).json({ error: error.message });
    }
};

exports.updateFundacion = async (req, res) => {
    try {
        const { id } = req.params;
        const fundacionData = req.body;
        await Fundacion.update(id, fundacionData);
        res.json({ message: 'Fundación actualizada correctamente' });
    } catch (error) {
        console.error('Error al actualizar fundación:', error);
        res.status(500).json({ error: error.message });
    }
};
