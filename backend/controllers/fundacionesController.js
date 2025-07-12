const Fundacion = require('../models/fundacionesModel');

exports.createFundacion = async (req, res) => {
    try {
        const [result] = await Fundacion.create(req.body);
        res.status(201).json({ id: result.insertId, ...req.body });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

exports.getAllFundaciones = async (req, res) => {
    try {
        const [fundaciones] = await Fundacion.findAll();
        res.status(200).json(fundaciones);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

exports.getFundacionById = async (req, res) => {
    try {
        const [fundacion] = await Fundacion.findById(req.params.id);
        if (fundacion.length === 0) {
            return res.status(404).json({ message: 'Fundacion not found' });
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
