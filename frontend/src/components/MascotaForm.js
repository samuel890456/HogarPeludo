import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate, useParams } from 'react-router-dom';
import { createMascota, getMascotaById, updateMascota } from '../api/api';
import { toast } from 'react-toastify';
import Select from 'react-select';
import { PhotoIcon, TrashIcon } from '@heroicons/react/24/outline';

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
    const [paises, setPaises] = useState([]);
    const [estados, setEstados] = useState([]);
    const [ciudades, setCiudades] = useState([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const [isEditing, setIsEditing] = useState(false);

    useEffect(() => {
        const fetchPaises = async () => {
            try {
                const response = await axios.get('https://api.countrystatecity.in/v1/countries', {
                    headers: { 'X-CSCAPI-KEY': 'eXVOOU1JV0V6azU3VWJCMXlQeUZoT25Rd2RuQnRKZDBQTjNQSllldw==' }
                });
                setPaises(response.data);
            } catch (error) {
                console.error('Error fetching countries:', error);
            }
        };
        fetchPaises();
    }, []);

    const handlePaisChange = async (paisIso2) => {
        setFormData(prev => ({ ...prev, pais: paisIso2, estado: '', ciudad: '' }));
        try {
            const response = await axios.get(`https://api.countrystatecity.in/v1/countries/${paisIso2}/states`, {
                headers: { 'X-CSCAPI-KEY': 'eXVOOU1JV0V6azU3VWJCMXlQeUZoT25Rd2RuQnRKZDBQTjNQSllldw==' }
            });
            setEstados(response.data);
            setCiudades([]);
        } catch (error) {
            console.error('Error fetching states:', error);
        }
    };

    const handleEstadoChange = async (estadoIso2) => {
        const paisIso2 = formData.pais;
        setFormData(prev => ({ ...prev, estado: estadoIso2, ciudad: '' }));
        try {
            const response = await axios.get(`https://api.countrystatecity.in/v1/countries/${paisIso2}/states/${estadoIso2}/cities`, {
                headers: { 'X-CSCAPI-KEY': 'eXVOOU1JV0V6azU3VWJCMXlQeUZoT25Rd2RuQnRKZDBQTjNQSllldw==' }
            });
            setCiudades(response.data);
        } catch (error) {
            console.error('Error fetching cities:', error);
        }
    };

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
        
        // Para nuevas mascotas siempre disponible, para edición usar el valor del formulario
        if (isEditing) {
            data.set('disponible', formData.disponible ? 'true' : 'false');
        } else {
            data.set('disponible', 'true'); // Nuevas mascotas siempre disponibles
        }

        // Combinar ciudad y país en el campo de ubicación
        const paisNombre = paises.find(p => p.iso2 === formData.pais)?.name || formData.pais;
        const estadoNombre = estados.find(e => e.iso2 === formData.estado)?.name || formData.estado;

        const ubicacionCompleta = `${formData.ciudad}, ${estadoNombre}, ${paisNombre}`;
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

    if (loading && isEditing) return <div className="text-center py-8 text-lg text-gray-600">Cargando datos de la mascota...</div>;

    return (
        <div className="container mx-auto p-6 bg-white rounded-xl shadow-2xl my-8 max-w-4xl">
            <h2 className="text-3xl font-bold text-gray-800 mb-6">{isEditing ? 'Editar Publicación' : 'Publicar Nueva Mascota'}</h2>
            {error && <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative mb-4 text-sm">{error}</div>}
            <form onSubmit={handleSubmit} className="space-y-6">
                {/* Sección de Información Básica */}
                <div className="space-y-6 p-6 border border-gray-200 rounded-lg shadow-sm bg-gray-50">
                    <h3 className="text-2xl font-bold text-gray-800 border-b pb-3 mb-4">Información Básica</h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div>
                            <label htmlFor="nombre" className="block text-sm font-medium text-gray-700 mb-1">Nombre<span className="text-red-500">*</span></label>
                            <input type="text" id="nombre" name="nombre" value={formData.nombre} onChange={handleChange} required className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-orange-500 focus:ring-orange-500 sm:text-sm p-2" />
                        </div>
                        <div>
                            <label htmlFor="especie" className="block text-sm font-medium text-gray-700 mb-1">Especie<span className="text-red-500">*</span></label>
                            <select id="especie" name="especie" value={formData.especie} onChange={handleChange} required className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-orange-500 focus:ring-orange-500 sm:text-sm p-2">
                                <option value="">Selecciona</option>
                                <option value="Perro">Perro</option>
                                <option value="Gato">Gato</option>
                                <option value="Ave">Ave</option>
                                <option value="Roedor">Roedor</option>
                                <option value="Otro">Otro</option>
                            </select>
                        </div>
                        <div>
                            <label htmlFor="raza" className="block text-sm font-medium text-gray-700 mb-1">Raza</label>
                            <input type="text" id="raza" name="raza" value={formData.raza} onChange={handleChange} className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-orange-500 focus:ring-orange-500 sm:text-sm p-2" />
                        </div>
                        <div>
                            <label htmlFor="edad" className="block text-sm font-medium text-gray-700 mb-1">Edad (años)<span className="text-red-500">*</span></label>
                            <input type="number" id="edad" name="edad" value={formData.edad} onChange={handleChange} min="0" required className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-orange-500 focus:ring-orange-500 sm:text-sm p-2" />
                        </div>
                        <div>
                            <label htmlFor="sexo" className="block text-sm font-medium text-gray-700 mb-1">Sexo<span className="text-red-500">*</span></label>
                            <select id="sexo" name="sexo" value={formData.sexo} onChange={handleChange} required className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-orange-500 focus:ring-orange-500 sm:text-sm p-2">
                                <option value="">Selecciona</option>
                                <option value="Macho">Macho</option>
                                <option value="Hembra">Hembra</option>
                            </select>
                        </div>
                        <div>
                            <label htmlFor="tamano" className="block text-sm font-medium text-gray-700 mb-1">Tamaño</label>
                            <select id="tamano" name="tamano" value={formData.tamano} onChange={handleChange} className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-orange-500 focus:ring-orange-500 sm:text-sm p-2">
                                <option value="">Selecciona</option>
                                <option value="Pequeño">Pequeño</option>
                                <option value="Mediano">Mediano</option>
                                <option value="Grande">Grande</option>
                            </select>
                        </div>
                        <div>
                            <label htmlFor="peso" className="block text-sm font-medium text-gray-700 mb-1">Peso (kg)</label>
                            <input type="number" id="peso" name="peso" value={formData.peso} onChange={handleChange} step="0.1" min="0" className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-orange-500 focus:ring-orange-500 sm:text-sm p-2" />
                        </div>
                        <div>
                            <label htmlFor="color" className="block text-sm font-medium text-gray-700 mb-1">Color</label>
                            <input type="text" id="color" name="color" value={formData.color} onChange={handleChange} className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-orange-500 focus:ring-orange-500 sm:text-sm p-2" />
                        </div>
                    </div>
                </div>

                {/* Sección de Descripción e Historia */}
                <div className="space-y-6 p-6 border border-gray-200 rounded-lg shadow-sm bg-gray-50">
                    <h3 className="text-2xl font-bold text-gray-800 border-b pb-3 mb-4">Más Detalles</h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div className="md:col-span-2">
                            <label htmlFor="descripcion" className="block text-sm font-medium text-gray-700 mb-1">Descripción<span className="text-red-500">*</span></label>
                            <textarea
                                id="descripcion"
                                name="descripcion"
                                value={formData.descripcion}
                                onChange={handleChange}
                                required
                                placeholder="Describe a la mascota: su personalidad, qué le gusta hacer, si es activa o tranquila, etc."
                                maxLength={MAX_DESCRIPCION}
                                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-orange-500 focus:ring-orange-500 sm:text-sm p-2 h-32 resize-none"
                            />
                            <div className={`text-right text-xs ${formData.descripcion.length === MAX_DESCRIPCION ? 'text-red-500' : 'text-gray-500'}`}>
                                {formData.descripcion.length}/{MAX_DESCRIPCION} caracteres
                            </div>
                        </div>
                        <div className="md:col-span-2">
                            <label htmlFor="historia" className="block text-sm font-medium text-gray-700 mb-1">Historia</label>
                            <textarea
                                id="historia"
                                name="historia"
                                value={formData.historia}
                                onChange={handleChange}
                                placeholder="¿Cómo llegó a ti? ¿Tiene alguna historia especial? (Opcional)"
                                maxLength={MAX_HISTORIA}
                                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-orange-500 focus:ring-orange-500 sm:text-sm p-2 h-32 resize-none"
                            />
                            <div className={`text-right text-xs ${formData.historia.length === MAX_HISTORIA ? 'text-red-500' : 'text-gray-500'}`}>
                                {formData.historia.length}/{MAX_HISTORIA} caracteres
                            </div>
                        </div>
                        <div>
                            <label htmlFor="pais" className="block text-sm font-medium text-gray-700 mb-1">País<span className="text-red-500">*</span></label>
                            <select id="pais" name="pais" value={formData.pais} onChange={(e) => handlePaisChange(e.target.value)} required className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-orange-500 focus:ring-orange-500 sm:text-sm p-2">
                                <option value="">Selecciona un país</option>
                                {paises.map(pais => (
                                    <option key={pais.iso2} value={pais.iso2}>{pais.name}</option>
                                ))}
                            </select>
                        </div>
                        <div>
                            <label htmlFor="estado" className="block text-sm font-medium text-gray-700 mb-1">Estado/Departamento<span className="text-red-500">*</span></label>
                            <select id="estado" name="estado" value={formData.estado} onChange={(e) => handleEstadoChange(e.target.value)} required className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-orange-500 focus:ring-orange-500 sm:text-sm p-2">
                                <option value="">Selecciona un estado</option>
                                {estados.map(estado => (
                                    <option key={estado.iso2} value={estado.iso2}>{estado.name}</option>
                                ))}
                            </select>
                        </div>
                        <div>
                            <label htmlFor="ciudad" className="block text-sm font-medium text-gray-700 mb-1">Ciudad<span className="text-red-500">*</span></label>
                            <select id="ciudad" name="ciudad" value={formData.ciudad} onChange={handleChange} required className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-orange-500 focus:ring-orange-500 sm:text-sm p-2">
                                <option value="">Selecciona una ciudad</option>
                                {ciudades.map(ciudad => (
                                    <option key={ciudad.id} value={ciudad.name}>{ciudad.name}</option>
                                ))}
                            </select>
                        </div>
                    </div>
                </div>

                {/* --- SECCIÓN DE SALUD Y ESTATUS (CAMBIO AQUÍ) --- */}
                <div className="space-y-6 p-6 border border-gray-200 rounded-lg shadow-sm bg-gray-50">
                    <h3 className="text-2xl font-bold text-gray-800 border-b pb-3 mb-4">Salud y Estatus</h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6"> {/* Mantén el form-grid para consistencia de layout */}
                        <div className="md:col-span-2">
                            <label htmlFor="estado_salud" className="block text-sm font-medium text-gray-700 mb-1">Estado de Salud</label>
                            <textarea
                                id="estado_salud"
                                name="estado_salud"
                                value={formData.estado_salud}
                                onChange={handleChange}
                                placeholder="Información relevante sobre su salud, alergias o condiciones médicas."
                                maxLength={MAX_ESTADO_SALUD}
                                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-orange-500 focus:ring-orange-500 sm:text-sm p-2 h-32 resize-none"
                            />
                            <div className={`text-right text-xs ${formData.estado_salud.length === MAX_ESTADO_SALUD ? 'text-red-500' : 'text-gray-500'}`}>
                                {formData.estado_salud.length}/{MAX_ESTADO_SALUD} caracteres
                            </div>
                        </div>
                        {/* Nuevo contenedor para los checkboxes específicos */}
                        <div className="md:col-span-2 flex flex-wrap gap-x-6 gap-y-4 items-center"> {/* <-- Nueva clase y full-width para ocupar el espacio */}
                            <label htmlFor="esterilizado" className="inline-flex items-center text-gray-700 text-sm font-medium cursor-pointer">
                                <input
                                    type="checkbox"
                                    id="esterilizado"
                                    name="esterilizado"
                                    checked={formData.esterilizado}
                                    onChange={handleChange}
                                    className="h-4 w-4 text-orange-600 focus:ring-orange-500 border-gray-300 rounded"
                                />
                                <span className="ml-2">Esterilizado/Castrado</span>
                            </label>
                            <label htmlFor="vacunas" className="inline-flex items-center text-gray-700 text-sm font-medium cursor-pointer">
                                <input
                                    type="checkbox"
                                    id="vacunas"
                                    name="vacunas"
                                    checked={formData.vacunas}
                                    onChange={handleChange}
                                    className="h-4 w-4 text-orange-600 focus:ring-orange-500 border-gray-300 rounded"
                                />
                                <span className="ml-2">Vacunas al día</span>
                            </label>
                            {isEditing && (
                                <>
                                    <label htmlFor="disponible" className="inline-flex items-center text-gray-700 text-sm font-medium cursor-pointer">
                                        <input
                                            type="checkbox"
                                            id="disponible"
                                            name="disponible"
                                            checked={formData.disponible}
                                            onChange={handleChange}
                                            className="h-4 w-4 text-orange-600 focus:ring-orange-500 border-gray-300 rounded"
                                        />
                                        <span className="ml-2">Disponible para adopción</span>
                                    </label>
                                    <p className="text-gray-500 text-xs mt-2 w-full">Desmarca esta opción si la mascota ya no está disponible (ej: ya fue adoptada, en proceso de adopción, etc.)</p>
                                </>
                            )}
                        </div> {/* <-- Fin del nuevo contenedor */}
                    </div>
                </div>
                {/* --- FIN CAMBIO EN SECCIÓN DE SALUD Y ESTATUS --- */}

                {/* Sección de Personalidad y Comportamiento (Tags) */}
                <div className="space-y-6 p-6 border border-gray-200 rounded-lg shadow-sm bg-gray-50">
                    <h3 className="text-2xl font-bold text-gray-800 border-b pb-3 mb-4">Personalidad y Comportamiento</h3>
                    <div className="mb-4">
                        <label className="block text-sm font-medium text-gray-700 mb-1">Características (tags)</label>
                        <Select
                            isMulti
                            name="tags"
                            options={TAG_OPTIONS}
                            className="basic-multi-select"
                            classNamePrefix="select"
                            value={selectedTags} // Usa las opciones filtradas
                            onChange={handleTagsChange}
                            placeholder="Selecciona características de la mascota..."
                            styles={{
                                control: (base) => ({
                                    ...base,
                                    borderColor: '#d1d5db', // gray-300
                                    boxShadow: 'none',
                                    '&:hover': { borderColor: '#f97316' }, // orange-500
                                    '&:focus': { borderColor: '#f97316', boxShadow: '0 0 0 1px #f97316' }, // orange-500
                                    borderRadius: '0.375rem', // rounded-md
                                    minHeight: '2.5rem', // py-2 px-3
                                }),
                                multiValue: (base) => ({
                                    ...base,
                                    backgroundColor: '#fed7aa', // orange-200
                                }),
                                multiValueLabel: (base) => ({
                                    ...base,
                                    color: '#c2410c', // orange-800
                                }),
                                multiValueRemove: (base) => ({
                                    ...base,
                                    color: '#c2410c',
                                    '&:hover': { backgroundColor: '#ea580c', color: 'white' }, // orange-700
                                }),
                                option: (base, { isSelected, isFocused }) => ({
                                    ...base,
                                    backgroundColor: isSelected ? '#f97316' : isFocused ? '#fff7ed' : null, // orange-500 / orange-50
                                    color: isSelected ? 'white' : '#1f2937', // gray-900
                                    '&:active': { backgroundColor: '#f97316' },
                                }),
                            }}
                        />
                        <p className="text-gray-500 text-xs mt-1">Elige las características que mejor describan a la mascota.</p>
                    </div>
                </div>

                {/* Sección de Imagen */}
                <div className="space-y-6 p-6 border border-gray-200 rounded-lg shadow-sm bg-gray-50">
                    <h3 className="text-2xl font-bold text-gray-800 border-b pb-3 mb-4">Foto de la Mascota<span className="text-red-500">*</span></h3>
                    <div className="flex flex-col items-center justify-center border-2 border-dashed border-gray-300 rounded-lg p-6 mb-4 relative bg-gray-50">
                        {formData.imagen_url_preview ? (
                            <div className="relative w-48 h-48 mb-4 group">
                                <img src={formData.imagen_url_preview} alt="Vista previa" className="w-full h-full object-cover rounded-lg shadow-md" />
                                <button type="button" className="absolute top-2 right-2 bg-red-500 text-white rounded-full h-8 w-8 flex items-center justify-center text-lg font-bold opacity-0 group-hover:opacity-100 transition-opacity duration-200" onClick={handleRemoveImage} aria-label="Eliminar imagen">
                                    <TrashIcon className="w-5 h-5" />
                                </button>
                            </div>
                        ) : (
                            <div className="text-center text-gray-500 mb-4">
                                <PhotoIcon className="w-16 h-16 mx-auto text-gray-400 mb-2" />
                                <p>Sube una foto clara y atractiva de la mascota.</p>
                            </div>
                        )}
                        <input
                                type="file"
                                id="imagen"
                                name="imagen"
                                accept="image/*"
                                onChange={handleFileChange}
                                className="hidden"
                            />
                            <button
                                type="button"
                                className="inline-flex items-center px-4 py-2 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-orange-500 hover:bg-orange-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-orange-500"
                                onClick={() => document.getElementById('imagen').click()}
                            >
                                <PhotoIcon className="w-5 h-5 mr-2" /> {formData.imagen_url_preview ? 'Cambiar Imagen' : 'Seleccionar Imagen'}
                            </button>
                        {isEditing && formData.imagen_url_preview && (
                            <p className="text-gray-500 text-xs mt-2">La imagen actual se mantendrá si no subes una nueva.</p>
                        )}
                    </div>
                </div>

                <div className="flex justify-end space-x-4 mt-8">
                    <button type="submit" className="inline-flex justify-center py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-orange-600 hover:bg-orange-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-orange-500" disabled={loading}>
                        {loading ? 'Guardando...' : (isEditing ? 'Guardar Cambios' : 'Publicar Mascota')}
                    </button>
                    <button type="button" className="inline-flex justify-center py-2 px-4 border border-gray-300 shadow-sm text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500" onClick={() => navigate('/mis-publicaciones')} disabled={loading}>
                        Cancelar
                    </button>
                </div>
            </form>
        </div>
    );
};

export default MascotaForm;
