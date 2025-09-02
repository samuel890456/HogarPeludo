import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import { PhotoIcon, TrashIcon, BuildingOfficeIcon, EnvelopeIcon, PhoneIcon, MapPinIcon, GlobeAltIcon, DocumentTextIcon, CalendarIcon, UserGroupIcon, CurrencyDollarIcon, LinkIcon, ClockIcon, TagIcon } from '@heroicons/react/24/outline';
import Switch from "react-switch";
import useAuthStore from '../store/authStore';
import { getFundacionByUserId, updateFundacionByUserId } from '../api/api';

const FundacionProfileForm = () => {
    const navigate = useNavigate();
    const { user, isAuthenticated } = useAuthStore();
    const [formData, setFormData] = useState({
        nombre: '',
        email: '',
        telefono: '',
        direccion: '',
        descripcion: '',
        sitio_web: '',
        logo_url: '',
        numero_registro_legal: '',
        acepta_voluntarios: false,
        acepta_donaciones: false,
        facebook: '',
        instagram: '',
        whatsapp: '',
        horario: '',
        especialidad: '',
        fundacion_desde: '',
    });
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        if (!isAuthenticated() || user?.roles?.includes('refugio') === false) { // Check for 'refugio' role
            toast.error('Acceso denegado. Solo las fundaciones pueden acceder a esta página.');
            navigate('/');
            return;
        }

        const fetchFundacionData = async () => {
            try {
                const data = await getFundacionByUserId(user.id);
                // Reemplazar null por '' en todos los campos
                const safeData = Object.fromEntries(
                    Object.entries(data).map(([k, v]) => {
                        if (k === 'acepta_voluntarios' || k === 'acepta_donaciones') {
                            return [k, Boolean(Number(v))];
                        }
                        return [k, v == null ? '' : v];
                    })
                );
                setFormData(safeData);
            } catch (err) {
                console.error('Error fetching foundation data:', err);
                setError('No se pudo cargar la información de la fundación.');
                toast.error('Error al cargar la información de la fundación.');
            } finally {
                setLoading(false);
            }
        };

        if (user?.id) {
            fetchFundacionData();
        }
    }, [user, isAuthenticated, navigate]);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: value
        }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError(null);
        try {
            await updateFundacionByUserId(user.id, formData);
            toast.success('Información de la fundación actualizada con éxito!');
        } catch (err) {
            console.error('Error updating foundation data:', err);
            setError('Error al actualizar la información de la fundación.');
            toast.error('Error al actualizar la información de la fundación.');
        } finally {
            setLoading(false);
        }
    };

    if (loading) {
        return <div className="text-center py-8 text-lg text-gray-600">Cargando información de la fundación...</div>;
    }

    if (error) {
        return <div className="text-center py-8 text-lg text-red-600">{error}</div>;
    }

    return (
        <div className="container mx-auto p-6 bg-white rounded-xl shadow-2xl my-8 max-w-4xl">
            <h2 className="text-3xl font-bold text-gray-800 mb-6">Mi Perfil de Fundación</h2>
            {error && <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative mb-4 text-sm">{error}</div>}
            <form onSubmit={handleSubmit} className="space-y-8">

                {/* Sección 1: Información Básica */}
                <div className="space-y-6 p-6 border border-gray-200 rounded-lg shadow-sm bg-gray-50">
                    <h3 className="text-2xl font-bold text-gray-800 border-b pb-3 mb-4 flex items-center"><BuildingOfficeIcon className="w-6 h-6 mr-2 text-orange-500" /> Información General</h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                    <label htmlFor="nombre" className="block text-sm font-medium text-gray-700 mb-1">Nombre de la Fundación<span className="text-red-500">*</span></label>
                    <input type="text" id="nombre" name="nombre" value={formData.nombre} onChange={handleChange} required className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-orange-500 focus:ring-orange-500 sm:text-sm p-2" />
                </div>
                <div>
                    <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">Email de Contacto<span className="text-red-500">*</span></label>
                    <input type="email" id="email" name="email" value={formData.email} onChange={handleChange} required className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-orange-500 focus:ring-orange-500 sm:text-sm p-2" />
                </div>
                <div>
                    <label htmlFor="telefono" className="block text-sm font-medium text-gray-700 mb-1">Teléfono</label>
                    <input type="text" id="telefono" name="telefono" value={formData.telefono} onChange={handleChange} className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-orange-500 focus:ring-orange-500 sm:text-sm p-2" />
                </div>
                <div>
                    <label htmlFor="direccion" className="block text-sm font-medium text-gray-700 mb-1">Dirección</label>
                    <input type="text" id="direccion" name="direccion" value={formData.direccion} onChange={handleChange} className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-orange-500 focus:ring-orange-500 sm:text-sm p-2" />
                </div>
                        <div className="md:col-span-2">
                    <label htmlFor="descripcion" className="block text-sm font-medium text-gray-700 mb-1">Descripción</label>
                    <textarea id="descripcion" name="descripcion" value={formData.descripcion} onChange={handleChange} rows="4" className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-orange-500 focus:ring-orange-500 sm:text-sm p-2"></textarea>
                        </div>
                    </div>
                </div>

                {/* Sección 2: Detalles Adicionales */}
                <div className="space-y-6 p-6 border border-gray-200 rounded-lg shadow-sm bg-gray-50">
                    <h3 className="text-2xl font-bold text-gray-800 border-b pb-3 mb-4 flex items-center"><DocumentTextIcon className="w-6 h-6 mr-2 text-orange-500" /> Detalles Adicionales</h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                    <label htmlFor="sitio_web" className="block text-sm font-medium text-gray-700 mb-1">Sitio Web</label>
                    <input type="url" id="sitio_web" name="sitio_web" value={formData.sitio_web} onChange={handleChange} className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-orange-500 focus:ring-orange-500 sm:text-sm p-2" />
                </div>
                <div>
                            <label htmlFor="numero_registro_legal" className="block text-sm font-medium text-gray-700 mb-1">Número de registro legal</label>
                            <input type="text" id="numero_registro_legal" name="numero_registro_legal" value={formData.numero_registro_legal} onChange={handleChange} className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-orange-500 focus:ring-orange-500 sm:text-sm p-2" />
                        </div>
                        <div>
                            <label htmlFor="horario" className="block text-sm font-medium text-gray-700 mb-1">Horario de Atención</label>
                            <input type="text" id="horario" name="horario" value={formData.horario} onChange={handleChange} className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-orange-500 focus:ring-orange-500 sm:text-sm p-2" />
                        </div>
                        <div>
                            <label htmlFor="especialidad" className="block text-sm font-medium text-gray-700 mb-1">Especialidad (ej. Perros, Gatos, Aves)</label>
                            <input type="text" id="especialidad" name="especialidad" value={formData.especialidad} onChange={handleChange} className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-orange-500 focus:ring-orange-500 sm:text-sm p-2" />
                        </div>
                        <div>
                            <label htmlFor="fundacion_desde" className="block text-sm font-medium text-gray-700 mb-1">Año de Fundación</label>
                            <input type="date" id="fundacion_desde" name="fundacion_desde" value={formData.fundacion_desde} onChange={handleChange} className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-orange-500 focus:ring-orange-500 sm:text-sm p-2" />
                        </div>
                    </div>
                </div>

                {/* Sección 3: Redes Sociales y Contacto Directo */}
                <div className="space-y-6 p-6 border border-gray-200 rounded-lg shadow-sm bg-gray-50">
                    <h3 className="text-2xl font-bold text-gray-800 border-b pb-3 mb-4 flex items-center"><LinkIcon className="w-6 h-6 mr-2 text-orange-500" /> Redes Sociales y Contacto</h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div>
                            <label htmlFor="facebook" className="block text-sm font-medium text-gray-700 mb-1">Facebook URL</label>
                            <input type="url" id="facebook" name="facebook" value={formData.facebook} onChange={handleChange} className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-orange-500 focus:ring-orange-500 sm:text-sm p-2" placeholder="https://facebook.com/tu_fundacion" />
                        </div>
                        <div>
                            <label htmlFor="instagram" className="block text-sm font-medium text-gray-700 mb-1">Instagram URL</label>
                            <input type="url" id="instagram" name="instagram" value={formData.instagram} onChange={handleChange} className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-orange-500 focus:ring-orange-500 sm:text-sm p-2" placeholder="https://instagram.com/tu_fundacion" />
                        </div>
                        <div>
                            <label htmlFor="whatsapp" className="block text-sm font-medium text-gray-700 mb-1">Número de WhatsApp (con código de país)</label>
                            <input type="text" id="whatsapp" name="whatsapp" value={formData.whatsapp} onChange={handleChange} className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-orange-500 focus:ring-orange-500 sm:text-sm p-2" placeholder="+57 300 1234567" />
                        </div>
                    </div>
                </div>

                {/* Sección 4: Opciones de Colaboración */}
                <div className="space-y-6 p-6 border border-gray-200 rounded-lg shadow-sm bg-gray-50">
                    <h3 className="text-2xl font-bold text-gray-800 border-b pb-3 mb-4 flex items-center"><UserGroupIcon className="w-6 h-6 mr-2 text-orange-500" /> Opciones de Colaboración</h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div className="flex items-center justify-between">
                            <label htmlFor="acepta_voluntarios" className="block text-sm font-medium text-gray-700">¿Acepta voluntarios?</label>
                            <Switch
                                id="acepta_voluntarios"
                                checked={formData.acepta_voluntarios}
                                onChange={checked => setFormData(prev => ({ ...prev, acepta_voluntarios: checked }))}
                                onColor="#F97316" // Tailwind orange-500
                                onHandleColor="#EA580C" // Tailwind orange-600
                                handleDiameter={20}
                                uncheckedIcon={false}
                                checkedIcon={false}
                                boxShadow="0px 1px 5px rgba(0, 0, 0, 0.6)"
                                activeBoxShadow="0px 0px 1px 10px rgba(0, 0, 0, 0.2)"
                                height={24}
                                width={48}
                            />
                        </div>
                        <div className="flex items-center justify-between">
                            <label htmlFor="acepta_donaciones" className="block text-sm font-medium text-gray-700">¿Acepta donaciones?</label>
                            <Switch
                                id="acepta_donaciones"
                                checked={formData.acepta_donaciones}
                                onChange={checked => setFormData(prev => ({ ...prev, acepta_donaciones: checked }))}
                                onColor="#F97316" // Tailwind orange-500
                                onHandleColor="#EA580C" // Tailwind orange-600
                                handleDiameter={20}
                                uncheckedIcon={false}
                                checkedIcon={false}
                                boxShadow="0px 1px 5px rgba(0, 0, 0, 0.6)"
                                activeBoxShadow="0px 0px 1px 10px rgba(0, 0, 0, 0.2)"
                                height={24}
                                width={48}
                            />
                        </div>
                    </div>
                </div>

                {/* Sección 5: Logo de la Fundación */}
                <div className="space-y-6 p-6 border border-gray-200 rounded-lg shadow-sm bg-gray-50">
                    <h3 className="text-2xl font-bold text-gray-800 border-b pb-3 mb-4 flex items-center"><PhotoIcon className="w-6 h-6 mr-2 text-orange-500" /> Logo de la Fundación</h3>
                    <div className="flex flex-col items-center justify-center border-2 border-dashed border-gray-300 rounded-lg p-6 relative bg-gray-50">
                        {formData.logo_url_preview ? (
                            <div className="relative w-32 h-32 mb-4">
                                <img src={formData.logo_url_preview} alt="Vista previa del logo" className="w-full h-full object-contain rounded-lg" />
                                <button type="button" className="absolute top-0 right-0 btn-danger btn-icon rounded-full h-6 w-6 flex items-center justify-center" onClick={() => {}} aria-label="Eliminar logo">
                                    <TrashIcon className="w-4 h-4" />
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
                            onChange={() => {}}
                            className="hidden"
                        />
                        <button
                            type="button"
                            className="btn-primary btn-icon"
                            onClick={() => document.getElementById('logo').click()}
                        >
                            <PhotoIcon className="w-5 h-5 mr-2" /> {formData.logo_url_preview ? 'Cambiar Logo' : 'Seleccionar Logo'}
                        </button>
                        {/* Eliminar o comentar cualquier referencia a handleRemoveLogo, XMarkIcon, handleFileChange, isEditing que no esté implementada. */}
                    </div>
                </div>

                <div className="flex justify-end space-x-4 mt-8">
                    <button type="submit" className="btn-primary" disabled={loading}>
                        {loading ? 'Guardando...' : 'Guardar Cambios'}
                    </button>
                    <button type="button" className="btn-secondary" onClick={() => navigate('/mi-fundacion')} disabled={loading}>
                        Cancelar
                    </button>
                </div>
            </form>
        </div>
    );
};

export default FundacionProfileForm;