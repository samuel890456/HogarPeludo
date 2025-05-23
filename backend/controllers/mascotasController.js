//backend/controladores/mascotasController.js
const Mascota = require('../models/mascotasModel');

// Función para limpiar los nombres y valores de los campos
const limpiarCampos = (obj) => {
    return Object.fromEntries(
        Object.entries(obj).map(([key, value]) => [
            key.replace(/[\s\t\n]+/g, '').normalize("NFC"), // Elimina espacios, tabulaciones y saltos de línea
            typeof value === 'string' ? value.trim().normalize("NFC") : value // Limpia valores
        ])
    );
};


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
        console.log("Datos recibidos en el backend antes de limpiar:", req.body);

        let datos = limpiarCampos(req.body); // 🔥 Limpia los datos antes de usarlos

        console.log("Datos limpios en el backend:", datos);
        console.log("Archivo recibido:", req.file);

        // Extraer datos limpiados
        const { nombre, especie, raza, genero, descripcion, estado } = datos;
        const edad = datos.edad ? Number(datos.edad) : null;
        const tamaño = datos.tamaño || datos["tamaÃ±o"] || ""; // Manejar variaciones del campo
        const usuario_id = datos.usuario_id ? Number(datos.usuario_id) : null;
        const foto = req.file ? req.file.filename : null;

        // Validaciones
        if (!nombre) return res.status(400).json({ error: "Nombre de mascota es obligatorio." });
        if (!especie) return res.status(400).json({ error: "Especie de mascota es obligatorio." });
        if (!raza) return res.status(400).json({ error: "Raza de mascota es obligatorio." });
        if (!edad) return res.status(400).json({ error: "Edad de mascota es obligatoria y debe ser un número." });
        if (!genero) return res.status(400).json({ error: "Género de mascota es obligatorio." });
        if (!tamaño) return res.status(400).json({ error: "Tamaño de mascota es obligatorio." });
        if (!descripcion) return res.status(400).json({ error: "Descripción de mascota es obligatoria." });
        if (!estado) return res.status(400).json({ error: "Estado de mascota es obligatorio." });
        if (!usuario_id) return res.status(400).json({ error: "Usuario no identificado." });

        // Guardar en la base de datos
        const id = await Mascota.create(nombre, especie, raza, edad, genero, tamaño, descripcion, foto, estado, usuario_id);
        res.status(201).json({ id, nombre, especie, raza, edad, genero, tamaño, descripcion, foto, estado, usuario_id });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

exports.updateMascota = async (req, res) => {
    try {
        console.log("Datos recibidos en el PUT:", req.body);

        let datos = limpiarCampos(req.body);
        console.log("Datos limpios:", datos);

        const { nombre, especie, raza, edad, genero, descripcion, estado } = datos;
        const foto = req.file ? req.file.filename : null;
        const tamaño = datos.tamaño || datos["tamaÃ±o"] || ""; // Manejar variaciones del campo

        if (!nombre) {
            console.error("Error: Falta el nombre");
            return res.status(400).json({ error: "Nombre de mascota es obligatorio." });
        }

        const edadNum = Number(edad);
        if (isNaN(edadNum)) {
            return res.status(400).json({ error: "Edad debe ser un número válido." });
        }

        const mascotaExistente = await Mascota.getById(req.params.id);
        if (!mascotaExistente) {
            return res.status(404).json({ error: "Mascota no encontrada" });
        }

        await Mascota.update(req.params.id, nombre, especie, raza, edadNum, genero, tamaño, descripcion, foto, estado);
        res.json({ message: "Mascota actualizada correctamente" });
    } catch (error) {
        console.error("Error en updateMascota:", error);
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
