const CampanaNoticia = require('../models/campanasNoticiasModel');

exports.getAllCampanasNoticias = async (req, res) => {
    try {
        const items = await CampanaNoticia.getAll();
        res.json(items);
    } catch (error) {
        console.error('Error al obtener campañas/noticias:', error);
        res.status(500).json({ message: 'Error interno del servidor al obtener campañas/noticias.' });
    }
};

exports.getCampanaNoticiaById = async (req, res) => {
    try {
        const { id } = req.params;
        const item = await CampanaNoticia.getById(id);
        if (!item) {
            return res.status(404).json({ message: 'Campaña/Noticia no encontrada.' });
        }
        res.json(item);
    } catch (error) {
        console.error('Error al obtener campaña/noticia por ID:', error);
        res.status(500).json({ message: 'Error interno del servidor al obtener campaña/noticia.' });
    }
};

exports.getCampanasNoticiasByTipo = async (req, res) => {
    try {
        const { tipo } = req.params;
        const items = await CampanaNoticia.getByTipo(tipo);
        res.json(items);
    } catch (error) {
        console.error('Error al obtener campañas/noticias por tipo:', error);
        res.status(500).json({ message: 'Error interno del servidor al obtener campañas/noticias por tipo.' });
    }
};

exports.createCampanaNoticia = async (req, res) => {
    try {
        const data = {
            ...req.body,
            autor_id: req.usuario.id,
            fecha_publicacion: new Date()
        };
        const newItemId = await CampanaNoticia.create(data);
        res.status(201).json({ message: 'Campaña/Noticia creada con éxito.', id: newItemId });
    } catch (error) {
        console.error('Error al crear campaña/noticia:', error);
        res.status(500).json({ message: 'Error interno del servidor al crear campaña/noticia.' });
    }
};

exports.updateCampanaNoticia = async (req, res) => {
    try {
        const { id } = req.params;
        const data = req.body;
        await CampanaNoticia.update(id, data);
        res.json({ message: 'Campaña/Noticia actualizada con éxito.' });
    } catch (error) {
        console.error('Error al actualizar campaña/noticia:', error);
        res.status(500).json({ message: 'Error interno del servidor al actualizar campaña/noticia.' });
    }
};

exports.deleteCampanaNoticia = async (req, res) => {
    try {
        const { id } = req.params;
        await CampanaNoticia.delete(id);
        res.json({ message: 'Campaña/Noticia eliminada con éxito.' });
    } catch (error) {
        console.error('Error al eliminar campaña/noticia:', error);
        res.status(500).json({ message: 'Error interno del servidor al eliminar campaña/noticia.' });
    }
};

exports.likeCampanaNoticia = async (req, res) => {
    try {
        const { id } = req.params;
        const userId = req.usuario.id;
        await CampanaNoticia.toggleLike(id, userId);
        res.json({ message: 'Like actualizado con éxito.' });
    } catch (error) {
        console.error('Error al actualizar like:', error);
        res.status(500).json({ message: 'Error interno del servidor al actualizar like.' });
    }
};

exports.getEstadisticas = async (req, res) => {
    try {
        const estadisticas = await CampanaNoticia.getEstadisticas();
        res.json(estadisticas);
    } catch (error) {
        console.error('Error al obtener estadísticas:', error);
        res.status(500).json({ message: 'Error interno del servidor al obtener estadísticas.' });
    }
};