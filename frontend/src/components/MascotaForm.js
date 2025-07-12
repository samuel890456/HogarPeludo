import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { createMascota, getMascotaById, updateMascota } from '../api/api';
import { toast } from 'react-toastify';
import Select from 'react-select';
import '../styles/MascotaForm.css';

// Definir la URL base de tus uploads del backend
const UPLOADS_BASE_URL = 'http://localhost:5000/uploads/';

const TAG_OPTIONS = [
    { value: 'amigable_ninos', label: 'Amigable con niños' },
    { value: 'compatible_perros', label: 'Compatible con otros perros' },
    { value: 'patio_grande', label: 'Necesita patio grande' },
    { value: 'entrenado_bano', label: 'Entrenado para ir al baño' },
    { value: 'energia_alta', label: 'Nivel de energía: Alto' },
    { value: 'jugueton', label: 'Le encanta jugar' },
    { value: 'tranquilo', label: 'Tranquilo y cariñoso' },
    { value: 'requiere_medicacion', label: 'Requiere medicación' },
    { value: 'timido', label: 'Tímido/Reservado' },
    { value: 'sociable', label: 'Muy sociable' },
    { value: 'curioso', label: 'Curioso y explorador' },
    { value: 'leal', label: 'Muy leal' },
    { value: 'independiente', label: 'Independiente' },
    { value: 'necesita_compania', label: 'Necesita compañía constante' },
    { value: 'ideal_primeriza', label: 'Ideal para dueños primerizos' },
    { value: 'experiencia_requerida', label: 'Requiere experiencia' },
];

const MAX_DESCRIPCION = 300;
const MAX_ESTADO_SALUD = 200;
const MAX_HISTORIA = 400;

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
        ciudad: '',
        pais: '',
        imagen: null,
        imagen_url_preview: null,
        disponible: true,
        esterilizado: false,
        vacunas: false,
        clear_imagen: false,
        tags: [],
    });
    const [countries, setCountries] = useState([
        'Argentina', 'Bolivia', 'Brasil', 'Chile', 'Colombia', 'Costa Rica', 'Cuba', 'Ecuador',
        'El Salvador', 'España', 'Guatemala', 'Honduras', 'México', 'Nicaragua', 'Panamá',
        'Paraguay', 'Perú', 'Puerto Rico', 'República Dominicana', 'Uruguay', 'Venezuela'
    ]);
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
                    let ciudad = '';
                    let pais = '';
                    if (mascota.ubicacion) {
                        const parts = mascota.ubicacion.split(', ');
                        if (parts.length > 1) {
                            ciudad = parts[0];
                            pais = parts[1];
                        } else {
                            ciudad = mascota.ubicacion;
                        }
                    }
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
                        ciudad: ciudad,
                        pais: pais,
                        imagen: null,
                        imagen_url_preview: mascota.imagen_url ? `${UPLOADS_BASE_URL}${mascota.imagen_url}` : null,
                        disponible: mascota.disponible,
                        esterilizado: mascota.esterilizado === 1,
                        vacunas: mascota.vacunas === 1,
                        clear_imagen: false,
                        tags: mascota.tags ? JSON.parse(mascota.tags) : [],
                    });
                } catch (err) {
                    console.error("Error al cargar mascota para edición:", err);
                    setError('No se pudo cargar la información de la mascota para editar.');
                    toast.error('Error al cargar la mascota.');
                } finally {
                    setLoading(false);
                }
            };
            fetchMascota();
        } else {
            setIsEditing(false);
            setFormData({
                nombre: '', especie: '', raza: '', edad: '', sexo: '', tamano: '', peso: '', color: '',
                descripcion: '', estado_salud: '', historia: '', ciudad: '', pais: '', imagen: null,
                imagen_url_preview: null, disponible: true, esterilizado: false, vacunas: false, clear_imagen: false, tags: []
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

    const handleTagsChange = (selectedOptions) => {
        setFormData(prev => ({
            ...prev,
            tags: selectedOptions ? selectedOptions.map(opt => opt.value) : []
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
            } else if (key === 'tags') {
                data.append('tags', JSON.stringify(formData.tags));
            } else if (key === 'ciudad' || key === 'pais') {
                // No añadir directamente, se manejará la ubicación combinada
            } else if (key !== 'imagen_url_preview' && key !== 'imagen') {
                data.append(key, formData[key]);
            }
        }

        // Combinar ciudad y país en el campo de ubicación
        const ubicacionCompleta = `${formData.ciudad.trim()}, ${formData.pais.trim()}`;
        data.append('ubicacion', ubicacionCompleta);
        
        // Si se limpió la imagen en el modo de edición, enviar la señal al backend
        if (isEditing && formData.clear_imagen && !formData.imagen) {
            data.append('clear_imagen', 'true');
        }

        try {
            if (isEditing) {
                await updateMascota(id, data);
                toast.success('¡Mascota actualizada con éxito!');
                navigate('/mis-publicaciones');
            } else {
                await createMascota(data);
                toast.success('¡Mascota publicada con éxito!');
                navigate('/mis-publicaciones');
            }
        } catch (err) {
            console.error("Error al guardar mascota:", err);
            // Mostrar un error más específico si la API lo proporciona
            const errorMessage = err.response && err.response.data && err.response.data.message 
                                ? err.response.data.message 
                                : 'Ocurrió un error al publicar la mascota.';
            toast.error(errorMessage);
            setError(errorMessage);
        } finally {
            setLoading(false);
        }
    };

    // Filtra las opciones de tags seleccionadas para el componente Select
    const selectedTags = TAG_OPTIONS.filter(opt => formData.tags.includes(opt.value));

    if (loading && isEditing) return <div className="loading-message">Cargando datos de la mascota...</div>;

    return (
        <div className="mascota-form-container">
            <h2>{isEditing ? 'Editar Publicación' : 'Publicar Nueva Mascota'}</h2>
            {error && <div className="form-error-message">{error}</div>}
            <form onSubmit={handleSubmit}>
                {/* Sección de Información Básica */}
                <div className="form-section">
                    <h3>Información Básica</h3>
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
                    </div>
                </div>

                {/* Sección de Descripción e Historia */}
                <div className="form-section">
                    <h3>Más Detalles</h3>
                    <div className="form-grid">
                        <div className="form-group full-width">
                            <label htmlFor="descripcion">Descripción<span className="required">*</span></label>
                            <textarea
                                id="descripcion"
                                name="descripcion"
                                value={formData.descripcion}
                                onChange={handleChange}
                                required
                                placeholder="Describe a la mascota: su personalidad, qué le gusta hacer, si es activa o tranquila, etc."
                                maxLength={MAX_DESCRIPCION}
                            />
                            <div className={`char-counter${formData.descripcion.length === MAX_DESCRIPCION ? ' limit' : ''}`}>
                                {formData.descripcion.length}/{MAX_DESCRIPCION} caracteres
                            </div>
                        </div>
                        <div className="form-group full-width">
                            <label htmlFor="historia">Historia</label>
                            <textarea
                                id="historia"
                                name="historia"
                                value={formData.historia}
                                onChange={handleChange}
                                placeholder="¿Cómo llegó a ti? ¿Tiene alguna historia especial? (Opcional)"
                                maxLength={MAX_HISTORIA}
                            />
                            <div className={`char-counter${formData.historia.length === MAX_HISTORIA ? ' limit' : ''}`}>
                                {formData.historia.length}/{MAX_HISTORIA} caracteres
                            </div>
                        </div>
                        <div className="form-group full-width">
                            <label htmlFor="ciudad">Ciudad<span className="required">*</span></label>
                            <input type="text" id="ciudad" name="ciudad" value={formData.ciudad} onChange={handleChange} required placeholder="Ej: Medellín" />
                        </div>
                        <div className="form-group full-width">
                            <label htmlFor="pais">País<span className="required">*</span></label>
                            <select id="pais" name="pais" value={formData.pais} onChange={handleChange} required>
                                <option value="">Selecciona un país</option>
                                {countries.map(country => (
                                    <option key={country} value={country}>{country}</option>
                                ))}
                            </select>
                        </div>
                    </div>
                </div>

                 {/* --- SECCIÓN DE SALUD Y ESTATUS (CAMBIO AQUÍ) --- */}
                <div className="form-section">
                    <h3>Salud y Estatus</h3>
                    <div className="form-grid"> {/* Mantén el form-grid para consistencia de layout */}
                        <div className="form-group full-width">
                            <label htmlFor="estado_salud">Estado de Salud</label>
                            <textarea
                                id="estado_salud"
                                name="estado_salud"
                                value={formData.estado_salud}
                                onChange={handleChange}
                                placeholder="Información relevante sobre su salud, alergias o condiciones médicas."
                                maxLength={MAX_ESTADO_SALUD}
                            />
                            <div className={`char-counter${formData.estado_salud.length === MAX_ESTADO_SALUD ? ' limit' : ''}`}>
                                {formData.estado_salud.length}/{MAX_ESTADO_SALUD} caracteres
                            </div>
                        </div>
                        {/* Nuevo contenedor para los checkboxes específicos */}
                        <div className="checkbox-options-row full-width"> {/* <-- Nueva clase y full-width para ocupar el espacio */}
                            <label htmlFor="esterilizado" className="checkbox-label">
                                <input
                                    type="checkbox"
                                    id="esterilizado"
                                    name="esterilizado"
                                    checked={formData.esterilizado}
                                    onChange={handleChange}
                                />
                                Esterilizado/Castrado
                            </label>
                            <label htmlFor="vacunas" className="checkbox-label">
                                <input
                                    type="checkbox"
                                    id="vacunas"
                                    name="vacunas"
                                    checked={formData.vacunas}
                                    onChange={handleChange}
                                />
                                Vacunas al día
                            </label>
                            <label htmlFor="disponible" className="checkbox-label">
                                <input type="checkbox" id="disponible" name="disponible" checked={formData.disponible} onChange={handleChange} />
                                Disponible para Adopción
                            </label>
                        </div> {/* <-- Fin del nuevo contenedor */}
                    </div>
                </div>
                {/* --- FIN CAMBIO EN SECCIÓN DE SALUD Y ESTATUS --- */}

                {/* Sección de Personalidad y Comportamiento (Tags) */}
                <div className="form-section">
                    <h3>Personalidad y Comportamiento</h3>
                    <div className="form-group full-width">
                        <label>Características (tags)</label>
                        <Select
                            isMulti
                            name="tags"
                            options={TAG_OPTIONS}
                            className="react-select-container"
                            classNamePrefix="react-select"
                            value={selectedTags} // Usa las opciones filtradas
                            onChange={handleTagsChange}
                            placeholder="Selecciona características de la mascota..."
                        />
                        <p className="field-tip">Elige las características que mejor describan a la mascota.</p>
                    </div>
                </div>

                {/* Sección de Imagen */}
                <div className="form-section image-upload-section">
                    <h3>Foto de la Mascota<span className="required">*</span></h3>
                    <div className="image-upload-area">
                        {formData.imagen_url_preview ? (
                            <div className="image-preview-wrapper">
                                <img src={formData.imagen_url_preview} alt="Vista previa" className="image-preview" />
                                <button type="button" className="remove-image-btn" onClick={handleRemoveImage} aria-label="Eliminar imagen">
                                    &times;
                                </button>
                            </div>
                        ) : (
                            <div className="upload-placeholder">
                                <i className="fas fa-camera"></i>
                                <p>Sube una foto clara y atractiva de la mascota.</p>
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
                            <i className="fas fa-upload"></i> {formData.imagen_url_preview ? 'Cambiar Imagen' : 'Seleccionar Imagen'}
                        </button>
                        {isEditing && formData.imagen_url_preview && (
                            <p className="upload-tip">La imagen actual se mantendrá si no subes una nueva.</p>
                        )}
                    </div>
                </div>

                <div className="form-actions">
                    <button type="submit" className="btn btn-primary" disabled={loading}>
                        {loading ? 'Guardando...' : (isEditing ? 'Guardar Cambios' : 'Publicar Mascota')}
                    </button>
                    <button type="button" className="btn btn-secondary" onClick={() => navigate('/mis-publicaciones')} disabled={loading}>
                        Cancelar
                    </button>
                </div>
            </form>
        </div>
    );
};

export default MascotaForm;