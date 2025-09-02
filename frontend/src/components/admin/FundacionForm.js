import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { getFundacionById, updateFundacion, createFundacion } from '../../api/adminApi'; // Assuming these API functions exist
import { toast } from 'react-toastify';
import { PhotoIcon, TrashIcon } from '@heroicons/react/24/outline';
import { XMarkIcon } from '@heroicons/react/24/solid';

const UPLOADS_BASE_URL = 'http://localhost:5000/uploads/';

const FundacionForm = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const [formData, setFormData] = useState({
        nombre: '',
        email: '',
        telefono: '',
        direccion: '',
        descripcion: '',
        sitio_web: '',
        logo: null, // For file upload
        logo_url_preview: null, // For image preview
        clear_logo: false, // To signal backend to remove logo
    });
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const [isEditing, setIsEditing] = useState(false);

    useEffect(() => {
        if (id) {
            setIsEditing(true);
            setLoading(true);
            setError(null);
            const fetchFundacion = async () => {
                try {
                    const fundacion = await getFundacionById(id); // Assuming getFundacionById exists in adminApi
                    setFormData({
                        nombre: fundacion.nombre || '',
                        email: fundacion.email || '',
                        telefono: fundacion.telefono || '',
                        direccion: fundacion.direccion || '',
                        descripcion: fundacion.descripcion || '',
                        sitio_web: fundacion.sitio_web || '',
                        logo: null,
                        logo_url_preview: fundacion.logo_url ? `${UPLOADS_BASE_URL}${fundacion.logo_url}` : null,
                        clear_logo: false,
                    });
                } catch (err) {
                    console.error("Error al cargar fundación para edición:", err);
                    setError('No se pudo cargar la información de la fundación para editar.');
                    toast.error('Error al cargar la fundación.');
                } finally {
                    setLoading(false);
                }
            };
            fetchFundacion();
        } else {
            setIsEditing(false);
            setFormData({
                nombre: '', email: '', telefono: '', direccion: '', descripcion: '', sitio_web: '',
                logo: null, logo_url_preview: null, clear_logo: false,
            });
        }
    }, [id]);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: value
        }));
    };

    const handleFileChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            setFormData(prev => ({
                ...prev,
                logo: file,
                logo_url_preview: URL.createObjectURL(file),
                clear_logo: false
            }));
        }
    };

    const handleRemoveLogo = () => {
        setFormData(prev => ({
            ...prev,
            logo: null,
            logo_url_preview: null,
            clear_logo: true,
        }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError(null);

        const data = new FormData();
        for (const key in formData) {
            if (key === 'logo' && formData.logo) {
                data.append('logo', formData.logo);
            } else if (key === 'logo_url_preview') {
                // Skip this, it's just for preview
            } else {
                data.append(key, formData[key]);
            }
        }
        if (isEditing && formData.clear_logo) {
            data.append('clear_logo', 'true');
        }

        try {
            if (isEditing) {
                await updateFundacion(id, data);
                toast.success('¡Fundación actualizada con éxito!');
            } else {
                await createFundacion(data);
                toast.success('¡Fundación creada con éxito!');
            }
            navigate('/admin/fundaciones'); // Redirect after save
        } catch (err) {
            console.error("Error al guardar fundación:", err);
            const errorMessage = err.response?.data?.message || 'Ocurrió un error al guardar la fundación.';
            toast.error(errorMessage);
            setError(errorMessage);
        } finally {
            setLoading(false);
        }
    };

    if (loading && isEditing) return <div className="text-center py-8 text-lg text-gray-600">Cargando datos de la fundación...</div>;

    return (
        <div className="container mx-auto p-4 bg-white rounded-lg shadow-lg my-8 max-w-3xl">
            <h2 className="text-3xl font-bold text-gray-800 mb-6">{isEditing ? 'Editar Fundación' : 'Crear Nueva Fundación'}</h2>
            {error && <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative mb-4 text-sm">{error}</div>}
            <form onSubmit={handleSubmit} className="space-y-6">
                {/* Basic Info */}
                <div>
                    <label htmlFor="nombre" className="block text-sm font-medium text-gray-700">Nombre<span className="text-red-500">*</span></label>
                    <input type="text" id="nombre" name="nombre" value={formData.nombre} onChange={handleChange} required className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-orange-500 focus:ring-orange-500" />
                </div>
                <div>
                    <label htmlFor="email" className="block text-sm font-medium text-gray-700">Email<span className="text-red-500">*</span></label>
                    <input type="email" id="email" name="email" value={formData.email} onChange={handleChange} required className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-orange-500 focus:ring-orange-500" />
                </div>
                <div>
                    <label htmlFor="telefono" className="block text-sm font-medium text-gray-700">Teléfono</label>
                    <input type="text" id="telefono" name="telefono" value={formData.telefono} onChange={handleChange} className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-orange-500 focus:ring-orange-500" />
                </div>
                <div>
                    <label htmlFor="direccion" className="block text-sm font-medium text-gray-700">Dirección</label>
                    <input type="text" id="direccion" name="direccion" value={formData.direccion} onChange={handleChange} className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-orange-500 focus:ring-orange-500" />
                </div>
                <div>
                    <label htmlFor="sitio_web" className="block text-sm font-medium text-gray-700">Sitio Web</label>
                    <input type="text" id="sitio_web" name="sitio_web" value={formData.sitio_web} onChange={handleChange} className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-orange-500 focus:ring-orange-500" />
                </div>
                <div>
                    <label htmlFor="descripcion" className="block text-sm font-medium text-gray-700">Descripción</label>
                    <textarea id="descripcion" name="descripcion" value={formData.descripcion} onChange={handleChange} rows="4" className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-orange-500 focus:ring-orange-500"></textarea>
                </div>

                {/* Logo Upload */}
                <div className="border-t border-gray-200 pt-6 mt-6">
                    <h3 className="text-xl font-semibold text-gray-700 mb-4">Logo de la Fundación</h3>
                    <div className="flex flex-col items-center justify-center border-2 border-dashed border-gray-300 rounded-lg p-6 mb-4 relative bg-gray-50">
                        {formData.logo_url_preview ? (
                            <div className="relative w-32 h-32 mb-4">
                                <img src={formData.logo_url_preview} alt="Vista previa del logo" className="w-full h-full object-contain rounded-lg" />
                                <button type="button" className="absolute top-0 right-0 btn-danger btn-icon rounded-full h-6 w-6 flex items-center justify-center" onClick={handleRemoveLogo} aria-label="Eliminar logo">
                                    <XMarkIcon className="w-4 h-4" />
                                </button>
                            </div>
                        ) : (
                            <div className="text-center text-gray-500 mb-4">
                                <PhotoIcon className="w-12 h-12 mx-auto text-gray-400 mb-2" />
                                <p>Sube el logo de la fundación.</p>
                            </div>
                        )}
                        <input
                            type="file"
                            id="logo"
                            name="logo"
                            accept="image/*"
                            onChange={handleFileChange}
                            className="hidden"
                        />
                        <button
                            type="button"
                            className="btn-primary btn-icon"
                            onClick={() => document.getElementById('logo').click()}
                        >
                            <PhotoIcon className="w-5 h-5 mr-2" /> {formData.logo_url_preview ? 'Cambiar Logo' : 'Seleccionar Logo'}
                        </button>
                        {isEditing && formData.logo_url_preview && (
                            <p className="text-gray-500 text-xs mt-2">El logo actual se mantendrá si no subes uno nuevo.</p>
                        )}
                    </div>
                </div>

                <div className="flex justify-end space-x-4 mt-8">
                    <button type="submit" className="btn-primary" disabled={loading}>
                        {loading ? 'Guardando...' : (isEditing ? 'Guardar Cambios' : 'Crear Fundación')}
                    </button>
                    <button type="button" className="btn-secondary" onClick={() => navigate('/admin/fundaciones')} disabled={loading}>
                        Cancelar
                    </button>
                </div>
            </form>
        </div>
    );
};

export default FundacionForm;
