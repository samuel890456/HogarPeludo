const Fundacion = require('../models/fundacionesModel');

exports.createFundacion = async (req, res) => {
    try {
        // Por defecto, la fundación se crea con estado 'pendiente' de aprobación
        const fundacionData = {
            ...req.body,
            aprobacion: 'pendiente'
        };
        const [result] = await Fundacion.create(fundacionData);
        res.status(201).json({ id: result.insertId, ...fundacionData });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

exports.getAllFundaciones = async (req, res) => {
    try {
        // Permitir filtrar por departamento, ciudad y aprobacion
        const { searchTerm = '', departamento = '', ciudad = '', aprobacion = '' } = req.query;
        const [fundaciones] = await Fundacion.findAll(searchTerm, departamento, ciudad, aprobacion);
        res.status(200).json(fundaciones);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

exports.getFundacionById = async (req, res) => {
    try {
        const [fundacion] = await Fundacion.findById(req.params.id);
        console.log('Fundacion encontrada:', fundacion);
        if (fundacion.length === 0) {
            return res.status(404).json({ message: 'Fundacion not found' });
        }
        res.status(200).json(fundacion[0]);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

exports.getFundacionByUserId = async (req, res) => {
    try {
        const [fundacion] = await Fundacion.findByUserId(req.params.userId);
        if (fundacion.length === 0) {
            return res.status(404).json({ message: 'Fundacion not found for this user' });
        }
        res.status(200).json(fundacion[0]);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

exports.updateFundacion = async (req, res) => {
    try {
        const [result] = await Fundacion.update(req.params.id, req.body);
        if (result.affectedRows === 0) {
            return res.status(404).json({ message: 'Fundacion not found' });
        }
        res.status(200).json({ id: req.params.id, ...req.body });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

exports.updateFundacionByUserId = async (req, res) => {
    try {
        const [result] = await Fundacion.updateByUserId(req.params.userId, req.body);
        if (result.affectedRows === 0) {
            return res.status(404).json({ message: 'Fundacion not found for this user' });
        }
        res.status(200).json({ userId: req.params.userId, ...req.body });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

exports.deleteFundacion = async (req, res) => {
    try {
        const [result] = await Fundacion.delete(req.params.id);
        if (result.affectedRows === 0) {
            return res.status(404).json({ message: 'Fundacion not found' });
        }
        res.status(204).json();
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

exports.calificarFundacion = async (req, res) => {
  try {
    const fundacionId = req.params.id;
    const usuarioId = req.usuario.id;
    const { puntuacion, comentario } = req.body;
    if (!puntuacion || puntuacion < 1 || puntuacion > 5) {
      return res.status(400).json({ message: 'La puntuación debe ser entre 1 y 5.' });
    }
    await Fundacion.addCalificacion(fundacionId, usuarioId, puntuacion, comentario);
    res.status(201).json({ message: 'Calificación registrada.' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.getCalificacionesFundacion = async (req, res) => {
  try {
    const fundacionId = req.params.id;
    const calificaciones = await Fundacion.getCalificaciones(fundacionId);
    res.json(calificaciones);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.getPromedioCalificacionFundacion = async (req, res) => {
  try {
    const fundacionId = req.params.id;
    const promedio = await Fundacion.getPromedioCalificacion(fundacionId);
    res.json({ promedio });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
