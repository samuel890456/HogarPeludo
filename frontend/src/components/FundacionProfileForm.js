import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
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
        aprobacion: '',
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
                setFormData(data);
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
            <h2 className="text-3xl font-bold text-gray-800 mb-2">Mi Perfil de Fundación</h2>
            {/* Badge de estado */}
            {formData.aprobacion && (
                <span className={`inline-block px-3 py-1 rounded-full text-xs font-semibold mb-4 
                    ${formData.aprobacion === 'aprobada' ? 'bg-green-100 text-green-700' : ''}
                    ${formData.aprobacion === 'pendiente' ? 'bg-yellow-100 text-yellow-700' : ''}
                    ${formData.aprobacion === 'rechazada' ? 'bg-red-100 text-red-700' : ''}
                `}>
                    {formData.aprobacion.charAt(0).toUpperCase() + formData.aprobacion.slice(1)}
                </span>
            )}
            {/* Previsualización del logo */}
            <div className="flex items-center mb-6">
                {formData.logo_url ? (
                    <div className="relative mr-4">
                        <img src={formData.logo_url} alt="Logo de la fundación" className="w-24 h-24 object-cover rounded-full border-2 border-orange-300" />
                        <button type="button" onClick={() => setFormData(prev => ({ ...prev, logo_url: '' }))} className="absolute top-0 right-0 bg-red-500 text-white rounded-full p-1 shadow hover:bg-red-700" title="Eliminar logo">
                            ×
                        </button>
                    </div>
                ) : (
                    <div className="w-24 h-24 flex items-center justify-center bg-gray-100 rounded-full border-2 border-dashed border-orange-200 text-gray-400 mr-4">
                        Sin logo
                    </div>
                )}
            </div>
            <form onSubmit={handleSubmit} className="space-y-6">
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
                <div>
                    <label htmlFor="descripcion" className="block text-sm font-medium text-gray-700 mb-1">Descripción</label>
                    <textarea id="descripcion" name="descripcion" value={formData.descripcion} onChange={handleChange} rows="4" className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-orange-500 focus:ring-orange-500 sm:text-sm p-2"></textarea>
                </div>
                <div>
                    <label htmlFor="sitio_web" className="block text-sm font-medium text-gray-700 mb-1">Sitio Web</label>
                    <input type="url" id="sitio_web" name="sitio_web" value={formData.sitio_web} onChange={handleChange} className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-orange-500 focus:ring-orange-500 sm:text-sm p-2" />
                </div>
                <div>
                    <label htmlFor="logo_url" className="block text-sm font-medium text-gray-700 mb-1">URL del Logo</label>
                    <input type="url" id="logo_url" name="logo_url" value={formData.logo_url} onChange={handleChange} className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-orange-500 focus:ring-orange-500 sm:text-sm p-2" />
                </div>
                <div className="flex justify-end">
                    <button type="submit" className="inline-flex justify-center py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-orange-600 hover:bg-orange-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-orange-500" disabled={loading}>
                        {loading ? 'Guardando...' : 'Guardar Cambios'}
                    </button>
                </div>
            </form>
        </div>
    );
};

export default FundacionProfileForm;