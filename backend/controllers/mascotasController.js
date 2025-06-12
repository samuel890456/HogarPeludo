// backend/controllers/mascotasController.js
const Mascota = require('../models/mascotasModel');
const fs = require('fs').promises;
const path = require('path');

const limpiarCampos = (obj) => {
    return Object.fromEntries(
        Object.entries(obj).map(([key, value]) => [
            key.replace(/[\s\t\n\uFEFF\xA0]+/g, '').normalize("NFC"),
            typeof value === 'string' ? value.trim().normalize("NFC") : value
        ])
    );
};

exports.getAllMascotas = async (req, res) => {
    try {
        const mascotas = await Mascota.getAll();
        // **IMPORTANTE: NO se añade la URL base aquí.**
        res.json(mascotas);
    } catch (error) {
        console.error("Error en getAllMascotas:", error);
        res.status(500).json({ error: error.message });
    }
};

exports.getMascotaById = async (req, res) => {
    try {
        const mascota = await Mascota.getById(req.params.id);
        if (!mascota) {
            return res.status(404).json({ message: 'Mascota no encontrada' });
        }
        // **IMPORTANTE: NO se añade la URL base aquí.**
        res.json(mascota);
    } catch (error) {
        console.error("Error en getMascotaById:", error);
        res.status(500).json({ error: error.message });
    }
};

exports.getMascotasByUserId = async (req, res) => {
    try {
        const userIdFromToken = req.usuario.id;
        const requestedUserId = req.params.id;

        if (Number(userIdFromToken) !== Number(requestedUserId) && req.usuario.rol_id !== 1) {
            return res.status(403).json({ message: "No tienes permiso para ver estas publicaciones." });
        }

        const mascotas = await Mascota.getByUserId(requestedUserId);
        // **IMPORTANTE: NO se añade la URL base aquí.**
        res.json(mascotas);
    } catch (error) {
        console.error("Error en getMascotasByUserId:", error);
        res.status(500).json({ error: error.message });
    }
};

exports.createMascota = async (req, res) => {
    try {
        console.log("Datos recibidos en el backend antes de limpiar (CREATE):", req.body);
        let datos = limpiarCampos(req.body);
        console.log("Datos limpios en el backend (CREATE):", datos);
        console.log("Archivo recibido (CREATE):", req.file);

        const { nombre, especie, raza, edad, sexo, tamano, peso, color, descripcion, estado_salud, historia, ubicacion, disponible } = datos;
        const publicado_por_id = req.usuario.id;

        const imagen_filename = req.file ? req.file.filename : null; // Solo guarda el nombre del archivo

        if (!nombre || !especie || !edad || !sexo || !ubicacion || !descripcion) {
            if (req.file) { await fs.unlink(req.file.path); }
            return res.status(400).json({ error: "Faltan campos obligatorios: nombre, especie, edad, sexo, ubicación, descripción." });
        }
        if (isNaN(Number(edad))) {
            if (req.file) { await fs.unlink(req.file.path); }
            return res.status(400).json({ error: "La edad debe ser un número." });
        }
        if (!['Macho', 'Hembra'].includes(sexo)) {
            if (req.file) { await fs.unlink(req.file.path); }
            return res.status(400).json({ error: "El sexo debe ser 'Macho' o 'Hembra'." });
        }
        if (tamano && !['Pequeño', 'Mediano', 'Grande'].includes(tamano)) {
            if (req.file) { await fs.unlink(req.file.path); }
            return res.status(400).json({ error: "El tamaño debe ser 'Pequeño', 'Mediano' o 'Grande'." });
        }
        if (!publicado_por_id) {
            if (req.file) { await fs.unlink(req.file.path); }
            return res.status(401).json({ error: "Usuario no autenticado para crear mascota." });
        }

        const id = await Mascota.create(
            nombre, especie, raza, Number(edad), sexo, tamano, Number(peso), color, descripcion, estado_salud, historia, ubicacion, imagen_filename, publicado_por_id, disponible === 'true'
        );

        // Devuelve el nombre del archivo, no la URL completa
        res.status(201).json({
            id, nombre, especie, raza, edad: Number(edad), sexo, tamano, peso: Number(peso), color,
            descripcion, estado_salud, historia, ubicacion, imagen_url: imagen_filename, publicado_por_id, disponible: disponible === 'true'
        });

    } catch (error) {
        console.error("Error en createMascota:", error);
        if (req.file) {
            try {
                await fs.unlink(req.file.path);
                console.log("Archivo temporal eliminado debido a error.");
            } catch (unlinkError) {
                console.error("Error al eliminar archivo temporal:", unlinkError);
            }
        }
        res.status(500).json({ error: error.message });
    }
};

exports.updateMascota = async (req, res) => {
    try {
        const mascotaId = req.params.id;
        console.log("Datos recibidos en el PUT (UPDATE):", req.body);

        let datos = limpiarCampos(req.body);
        console.log("Datos limpios (UPDATE):", datos);
        console.log("Archivo recibido (UPDATE):", req.file);

        const { nombre, especie, raza, edad, sexo, tamano, peso, color, descripcion, estado_salud, historia, ubicacion, disponible, clear_imagen } = datos;
        const publicado_por_id = req.usuario.id;

        const mascotaExistente = await Mascota.getById(mascotaId);
        if (!mascotaExistente) {
            if (req.file) { await fs.unlink(req.file.path); }
            return res.status(404).json({ error: "Mascota no encontrada." });
        }

        if (mascotaExistente.publicado_por_id !== publicado_por_id && req.usuario.rol_id !== 1) {
            if (req.file) { await fs.unlink(req.file.path); }
            return res.status(403).json({ message: "No tienes permiso para editar esta mascota." });
        }

        let new_imagen_filename = req.file ? req.file.filename : undefined;

        if (clear_imagen === 'true' && mascotaExistente.imagen_url) {
            try {
                await fs.unlink(path.join(__dirname, '..', 'uploads', mascotaExistente.imagen_url));
                console.log(`Imagen anterior eliminada: ${mascotaExistente.imagen_url}`);
            } catch (unlinkError) {
                console.error("Error al eliminar imagen anterior:", unlinkError);
            }
            new_imagen_filename = null;
        } else if (req.file && mascotaExistente.imagen_url) {
            try {
                await fs.unlink(path.join(__dirname, '..', 'uploads', mascotaExistente.imagen_url));
                console.log(`Imagen anterior reemplazada y eliminada: ${mascotaExistente.imagen_url}`);
            } catch (unlinkError) {
                console.error("Error al eliminar imagen anterior (reemplazo):", unlinkError);
            }
        } else if (!req.file && clear_imagen !== 'true' && mascotaExistente.imagen_url) {
            new_imagen_filename = mascotaExistente.imagen_url;
        } else if (!req.file && clear_imagen === 'true') {
            new_imagen_filename = null;
        }

        if (!nombre || !especie || !edad || !sexo || !ubicacion || !descripcion) {
            if (req.file) { await fs.unlink(req.file.path); }
            return res.status(400).json({ error: "Faltan campos obligatorios para actualizar: nombre, especie, edad, sexo, ubicación, descripción." });
        }
        if (isNaN(Number(edad))) {
            if (req.file) { await fs.unlink(req.file.path); }
            return res.status(400).json({ error: "La edad debe ser un número." });
        }
        if (!['Macho', 'Hembra'].includes(sexo)) {
            if (req.file) { await fs.unlink(req.file.path); }
            return res.status(400).json({ error: "El sexo debe ser 'Macho' o 'Hembra'." });
        }
        if (tamano && !['Pequeño', 'Mediano', 'Grande'].includes(tamano)) {
            if (req.file) { await fs.unlink(req.file.path); }
            return res.status(400).json({ error: "El tamaño debe ser 'Pequeño', 'Mediano' o 'Grande'." });
        }

        await Mascota.update(
            mascotaId, nombre, especie, raza, Number(edad), sexo, tamano, Number(peso), color,
            descripcion, estado_salud, historia, ubicacion, new_imagen_filename, disponible === 'true'
        );

        res.json({ message: "Mascota actualizada correctamente" });

    } catch (error) {
        console.error("Error en updateMascota:", error);
        if (req.file) {
            try {
                await fs.unlink(req.file.path);
                console.log("Archivo temporal eliminado debido a error durante actualización.");
            } catch (unlinkError) {
                console.error("Error al eliminar archivo temporal durante actualización:", unlinkError);
            }
        }
        res.status(500).json({ error: error.message });
    }
};


exports.deleteMascota = async (req, res) => {
    try {
        const mascotaId = req.params.id;
        const mascotaExistente = await Mascota.getById(mascotaId);

        if (!mascotaExistente) {
            return res.status(404).json({ error: "Mascota no encontrada." });
        }

        if (mascotaExistente.publicado_por_id !== req.usuario.id && req.usuario.rol_id !== 1) {
             return res.status(403).json({ message: "No tienes permiso para eliminar esta mascota." });
        }

        if (mascotaExistente.imagen_url) {
            try {
                const imagePath = path.join(__dirname, '..', 'uploads', mascotaExistente.imagen_url);
                await fs.unlink(imagePath);
                console.log(`Imagen eliminada del disco: ${mascotaExistente.imagen_url}`);
            } catch (unlinkError) {
                console.error("Error al eliminar la imagen del disco:", unlinkError);
            }
        }

        await Mascota.delete(mascotaId);
        res.json({ message: 'Mascota eliminada correctamente' });
    } catch (error) {
        console.error("Error en deleteMascota:", error);
        res.status(500).json({ error: error.message });
    }
};