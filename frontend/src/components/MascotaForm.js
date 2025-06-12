// File: frontend/src/components/MascotaForm.js
import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { createMascota, getMascotaById, updateMascota } from '../api/api';
import '../styles/MascotaForm.css';

// Definir la URL base de tus uploads del backend
const UPLOADS_BASE_URL = 'http://localhost:5000/uploads/'; 

const MascotaForm = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const [formData, setFormData] = useState({
        nombre: '',
        especie: '',
        raza: '',
        edad: '',
        sexo: '',
        tamano: '',
        peso: '',
        color: '',
        descripcion: '',
        estado_salud: '',
        historia: '',
        ubicacion: '',
        imagen: null,
        imagen_url_preview: null,
        disponible: true,
        clear_imagen: false,
    });
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const [isEditing, setIsEditing] = useState(false);

    useEffect(() => {
        if (id) {
            setIsEditing(true);
            setLoading(true);
            setError(null);
            const fetchMascota = async () => {
                try {
                    const mascota = await getMascotaById(id);
                    setFormData({
                        nombre: mascota.nombre || '',
                        especie: mascota.especie || '',
                        raza: mascota.raza || '',
                        edad: mascota.edad || '',
                        sexo: mascota.sexo || '',
                        tamano: mascota.tamano || '',
                        peso: mascota.peso || '',
                        color: mascota.color || '',
                        descripcion: mascota.descripcion || '',
                        estado_salud: mascota.estado_salud || '',
                        historia: mascota.historia || '',
                        ubicacion: mascota.ubicacion || '',
                        imagen: null,
                        // AQUI: Construye la URL completa para el preview
                        imagen_url_preview: mascota.imagen_url ? `${UPLOADS_BASE_URL}${mascota.imagen_url}` : null,
                        disponible: mascota.disponible,
                        clear_imagen: false,
                    });
                } catch (err) {
                    console.error("Error al cargar mascota para edición:", err);
                    setError('No se pudo cargar la información de la mascota para editar.');
                } finally {
                    setLoading(false);
                }
            };
            fetchMascota();
        } else {
            setIsEditing(false);
            setFormData({
                nombre: '', especie: '', raza: '', edad: '', sexo: '', tamano: '', peso: '', color: '',
                descripcion: '', estado_salud: '', historia: '', ubicacion: '', imagen: null,
                imagen_url_preview: null, disponible: true, clear_imagen: false
            });
        }
    }, [id]);

    const handleChange = (e) => {
        const { name, value, type, checked } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: type === 'checkbox' ? checked : value
        }));
    };

    const handleFileChange = (e) => {
        const file = e.target.files[0];
        setFormData(prev => ({
            ...prev,
            imagen: file,
            imagen_url_preview: file ? URL.createObjectURL(file) : null,
            clear_imagen: false
        }));
    };

    const handleRemoveImage = () => {
        setFormData(prev => ({
            ...prev,
            imagen: null,
            imagen_url_preview: null,
            clear_imagen: true
        }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError(null);

        const data = new FormData();
        for (const key in formData) {
            if (key === 'imagen' && formData.imagen) {
                data.append('imagen', formData.imagen);
            } else if (key !== 'imagen_url_preview' && key !== 'imagen') {
                data.append(key, formData[key]);
            }
        }

        try {
            if (isEditing) {
                await updateMascota(id, data);
                alert('Mascota actualizada correctamente');
                navigate('/mis-publicaciones');
            } else {
                await createMascota(data);
                alert('Mascota publicada correctamente');
                navigate('/mis-publicaciones');
            }
        } catch (err) {
            console.error("Error al guardar mascota:", err);
            setError('Error al guardar la mascota: ' + (err.response?.data?.error || err.message));
        } finally {
            setLoading(false);
        }
    };

    if (loading && isEditing) return <div className="loading-message">Cargando datos de la mascota...</div>;

    return (
        <div className="mascota-form-container">
            <h2>{isEditing ? 'Editar Publicación' : 'Publicar Nueva Mascota'}</h2>
            {error && <div className="form-error-message">{error}</div>}
            <form onSubmit={handleSubmit}>
                <div className="form-grid">
                    <div className="form-group">
                        <label htmlFor="nombre">Nombre<span className="required">*</span></label>
                        <input type="text" id="nombre" name="nombre" value={formData.nombre} onChange={handleChange} required />
                    </div>
                    <div className="form-group">
                        <label htmlFor="especie">Especie<span className="required">*</span></label>
                        <select id="especie" name="especie" value={formData.especie} onChange={handleChange} required>
                            <option value="">Selecciona</option>
                            <option value="Perro">Perro</option>
                            <option value="Gato">Gato</option>
                            <option value="Ave">Ave</option>
                            <option value="Roedor">Roedor</option>
                            <option value="Otro">Otro</option>
                        </select>
                    </div>
                    <div className="form-group">
                        <label htmlFor="raza">Raza</label>
                        <input type="text" id="raza" name="raza" value={formData.raza} onChange={handleChange} />
                    </div>
                    <div className="form-group">
                        <label htmlFor="edad">Edad (años)<span className="required">*</span></label>
                        <input type="number" id="edad" name="edad" value={formData.edad} onChange={handleChange} min="0" required />
                    </div>
                    <div className="form-group">
                        <label htmlFor="sexo">Sexo<span className="required">*</span></label>
                        <select id="sexo" name="sexo" value={formData.sexo} onChange={handleChange} required>
                            <option value="">Selecciona</option>
                            <option value="Macho">Macho</option>
                            <option value="Hembra">Hembra</option>
                        </select>
                    </div>
                    <div className="form-group">
                        <label htmlFor="tamano">Tamaño</label>
                        <select id="tamano" name="tamano" value={formData.tamano} onChange={handleChange}>
                            <option value="">Selecciona</option>
                            <option value="Pequeño">Pequeño</option>
                            <option value="Mediano">Mediano</option>
                            <option value="Grande">Grande</option>
                        </select>
                    </div>
                    <div className="form-group">
                        <label htmlFor="peso">Peso (kg)</label>
                        <input type="number" id="peso" name="peso" value={formData.peso} onChange={handleChange} step="0.1" min="0" />
                    </div>
                    <div className="form-group">
                        <label htmlFor="color">Color</label>
                        <input type="text" id="color" name="color" value={formData.color} onChange={handleChange} />
                    </div>
                    <div className="form-group full-width">
                        <label htmlFor="descripcion">Descripción<span className="required">*</span></label>
                        <textarea id="descripcion" name="descripcion" value={formData.descripcion} onChange={handleChange} required></textarea>
                    </div>
                    <div className="form-group full-width">
                        <label htmlFor="estado_salud">Estado de Salud</label>
                        <textarea id="estado_salud" name="estado_salud" value={formData.estado_salud} onChange={handleChange}></textarea>
                    </div>
                    <div className="form-group full-width">
                        <label htmlFor="historia">Historia</label>
                        <textarea id="historia" name="historia" value={formData.historia} onChange={handleChange}></textarea>
                    </div>
                    <div className="form-group">
                        <label htmlFor="ubicacion">Ubicación (Ciudad, País)<span className="required">*</span></label>
                        <input type="text" id="ubicacion" name="ubicacion" value={formData.ubicacion} onChange={handleChange} required />
                    </div>
                    <div className="form-group checkbox-group">
                        <label htmlFor="disponible">
                            <input type="checkbox" id="disponible" name="disponible" checked={formData.disponible} onChange={handleChange} />
                            Disponible para Adopción
                        </label>
                    </div>
                </div>

                <div className="image-upload-group">
                    <label>Imagen de la Mascota</label>
                    <div className="image-upload-area">
                        {formData.imagen_url_preview && (
                            <div className="image-preview-container">
                                <img src={formData.imagen_url_preview} alt="Vista previa" className="image-preview" />
                                <button type="button" className="remove-image-btn" onClick={handleRemoveImage}>
                                    &times;
                                </button>
                            </div>
                        )}
                        <input
                            type="file"
                            id="imagen"
                            name="imagen"
                            accept="image/*"
                            onChange={handleFileChange}
                            style={{ display: 'none' }}
                        />
                        <button
                            type="button"
                            className="upload-button"
                            onClick={() => document.getElementById('imagen').click()}
                        >
                            <i className="fas fa-upload"></i> Subir Imagen
                        </button>
                        {formData.imagen_url_preview && isEditing && (
                            <p className="upload-tip">Deja el campo vacío si no quieres cambiar la imagen.</p>
                        )}
                        {!formData.imagen_url_preview && (
                            <p className="upload-tip">Sube una foto clara de la mascota.</p>
                        )}
                    </div>
                </div>

                <div className="form-actions">
                    <button type="submit" className="btn-primary" disabled={loading}>
                        {loading ? 'Guardando...' : (isEditing ? 'Guardar Cambios' : 'Publicar Mascota')}
                    </button>
                    <button type="button" className="btn-secondary" onClick={() => navigate('/mis-publicaciones')} disabled={loading}>
                        Cancelar
                    </button>
                </div>
            </form>
        </div>
    );
};

export default MascotaForm;