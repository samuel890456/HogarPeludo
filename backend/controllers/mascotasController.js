//backend/controllers/mascotasController.js
const Mascota = require('../models/mascotasModel');

exports.getAllMascotas = async (req, res) => {
    try {
        const mascotas = await Mascota.getAll();
        res.json(mascotas);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

exports.getMascotaById = async (req, res) => {
    try {
        const mascota = await Mascota.getById(req.params.id);
        if (!mascota) {
            return res.status(404).json({ message: 'Mascota no encontrada' });
        }
        res.json(mascota);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};
exports.createMascota = async (req, res) => {
    try {
        const { nombre, especie, raza, edad, genero, tamaño, descripcion, foto, usuario_id } = req.body;
        
        if (!usuario_id) {
            return res.status(400).json({ error: "Usuario no identificado." });
        }

        const estado = req.body.estado || null;  
        const fotoURL = typeof foto === "string" && foto.trim() !== "" ? foto : null;

        const id = await Mascota.create(nombre, especie, raza, edad, genero, tamaño, descripcion, fotoURL, estado, usuario_id);
        res.status(201).json({ id, nombre, especie, raza, edad, genero, tamaño, descripcion, foto: fotoURL, estado, usuario_id });
    } catch (error) {
        console.error("⚠️ Error en createMascota:", error);  // <---- Agregar esto
        res.status(500).json({ error: error.message });
    }
};




exports.updateMascota = async (req, res) => {
    try {
        const { nombre, especie, raza, edad, genero, tamaño, descripcion, foto, estado } = req.body;
        await Mascota.update(req.params.id, nombre, especie, raza, edad, genero, tamaño, descripcion, foto, estado);
        res.json({ message: 'Mascota actualizada correctamente' });
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