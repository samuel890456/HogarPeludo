import React, { useEffect, useState } from 'react';
import { getSolicitudes, updateSolicitudEstado, deleteSolicitud } from '../api/api';
import { toast } from 'react-toastify';
import useAuthStore from '../store/authStore'; // Importar el store de autenticación

const UPLOADS_BASE_URL = 'http://localhost:5000/uploads/'; // Asegúrate de que esta URL sea correcta

const SolicitudesPage = () => {
    const [solicitudes, setSolicitudes] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [activeTab, setActiveTab] = useState('');

    const { user, isLoggedIn } = useAuthStore(); // Obtener el usuario y el estado de login del store

    // Determinar roles usando los nombres de rol mapeados del store
    const isAdmin = user?.roles?.includes('admin');
    const isRefugio = user?.roles?.includes('refugio'); // Fundaciones - solo publican
    const isUsuario = user?.roles?.includes('usuario'); // Usuarios - adoptan y publican
    
    // Lógica para determinar qué pestañas mostrar
    const isPublicador = isRefugio || isUsuario; // Ambos pueden publicar
    const isAdoptante = isUsuario; // Solo usuarios pueden adoptar

    useEffect(() => {
        if (!isLoggedIn) {
            // Redirigir o mostrar mensaje si no está logueado
            setError('Debes iniciar sesión para ver las solicitudes.');
            setLoading(false);
            return;
        }

        // Establecer la pestaña activa por defecto basada en el rol principal
        if (isAdmin) {
            setActiveTab('admin');
        } else if (isRefugio) {
            // Fundaciones solo ven solicitudes para sus mascotas
            setActiveTab('publicador');
        } else if (isUsuario) {
            // Usuarios pueden ver tanto sus solicitudes como las de sus mascotas
            // Por defecto mostrar sus solicitudes de adopción
            setActiveTab('adoptante');
        }
    }, [isLoggedIn, isAdmin, isPublicador, isAdoptante, user]);

    useEffect(() => {
        if (!isLoggedIn || !activeTab) return; // No cargar si no está logueado o no hay pestaña activa

        const fetchSolicitudes = async () => {
            try {
                const data = await getSolicitudes();
                setSolicitudes(data);
            } catch (err) {
                setError('Error al cargar las solicitudes. Por favor, inténtalo de nuevo más tarde.');
                console.error('Error al cargar solicitudes:', err);
            } finally {
                setLoading(false);
            }
        };

        fetchSolicitudes();
    }, [isLoggedIn, activeTab]); // Recargar si el estado de login o la pestaña activa cambian

    const handleEstadoChange = async (solicitudId, newEstado) => {
        try {
            await updateSolicitudEstado(solicitudId, newEstado);
            setSolicitudes(solicitudes.map(sol =>
                sol.id === solicitudId ? { ...sol, estado: newEstado } : sol
            ));
            toast.success('Estado de la solicitud actualizado con éxito.');
        } catch (err) {
            setError('Error al actualizar el estado de la solicitud.');
            console.error(err);
            toast.error('No se pudo actualizar el estado de la solicitud. Revisa los permisos.');
        }
    };

    const handleDeleteSolicitud = async (solicitudId) => {
        if (window.confirm('¿Estás seguro de que quieres eliminar esta solicitud?')) {
            try {
                await deleteSolicitud(solicitudId);
                setSolicitudes(solicitudes.filter(sol => sol.id !== solicitudId));
                toast.success('Solicitud eliminada con éxito.');
            } catch (err) {
                setError('Error al eliminar la solicitud.');
                console.error(err);
                toast.error('No se pudo eliminar la solicitud. Revisa los permisos.');
            }
        }
    };

    if (loading) {
        return <div className="text-center py-8 text-lg text-gray-600"><p>Cargando solicitudes...</p></div>;
    }

    if (error) {
        return <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative mx-auto max-w-4xl mt-8"><p>{error}</p></div>;
    }

    // Solicitudes que el usuario ha enviado como adoptante
    const solicitudesComoAdoptante = solicitudes.filter(
        sol => sol.adoptante_id === user?.id
    );

    // Solicitudes que otros han enviado para las mascotas del usuario
    const solicitudesParaMisMascotas = solicitudes.filter(
        sol => sol.publicador_id === user?.id
    );

    let solicitudesAMostrar = [];
    let tituloSeccion = "";

    if (activeTab === 'adoptante') {
        solicitudesAMostrar = solicitudesComoAdoptante;
        tituloSeccion = "Mis Solicitudes de Adopción";
    } else if (activeTab === 'publicador') {
        solicitudesAMostrar = solicitudesParaMisMascotas;
        tituloSeccion = "Solicitudes Recibidas para Mis Mascotas";
    } else if (activeTab === 'admin') {
        solicitudesAMostrar = solicitudes;
        tituloSeccion = "Todas las Solicitudes (Admin)";
    }

    return (
        <div className="container mx-auto p-4">
            <h2 className="text-3xl font-bold text-gray-800 mb-6">Gestión de Solicitudes</h2>

            <div className="flex justify-center space-x-4 mb-6">
                {isUsuario && (
                    <button
                        className={`px-6 py-2 rounded-full text-lg font-semibold transition-colors duration-300 ${activeTab === 'adoptante' ? 'bg-orange-500 text-white' : 'bg-gray-200 text-gray-700 hover:bg-gray-300'}`}
                        onClick={() => setActiveTab('adoptante')}
                    >
                        Mis Solicitudes de Adopción
                    </button>
                )}
                {(isRefugio || isUsuario) && (
                    <button
                        className={`px-6 py-2 rounded-full text-lg font-semibold transition-colors duration-300 ${activeTab === 'publicador' ? 'bg-orange-500 text-white' : 'bg-gray-200 text-gray-700 hover:bg-gray-300'}`}
                        onClick={() => setActiveTab('publicador')}
                    >
                        Solicitudes para Mis Mascotas
                    </button>
                )}
                {isAdmin && (
                    <button
                        className={`px-6 py-2 rounded-full text-lg font-semibold transition-colors duration-300 ${activeTab === 'admin' ? 'bg-orange-500 text-white' : 'bg-gray-200 text-gray-700 hover:bg-gray-300'}`}
                        onClick={() => setActiveTab('admin')}
                    >
                        Todas las Solicitudes
                    </button>
                )}
            </div>

            <h3 className="text-2xl font-semibold text-gray-700 mb-4 text-center">{tituloSeccion}</h3>

            {solicitudesAMostrar.length === 0 ? (
                <div className="bg-white p-6 rounded-lg shadow-md text-center">
                    <p className="text-gray-600">No hay solicitudes disponibles en esta sección.</p>
                </div>
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {solicitudesAMostrar.map((solicitud) => (
                        <div key={solicitud.id} className="bg-white rounded-lg shadow-md overflow-hidden flex flex-col">
                            <div className="p-4 border-b border-gray-200 flex items-center">
                                <img
                                    src={`${UPLOADS_BASE_URL}${solicitud.mascota_imagen_url}`}
                                    alt={solicitud.mascota_nombre}
                                    className="w-16 h-16 object-cover rounded-full mr-4"
                                />
                                <div className="flex-grow">
                                    <h4 className="text-lg font-semibold text-gray-800">{solicitud.mascota_nombre} <span className="text-gray-500 text-sm">({solicitud.mascota_especie})</span></h4>
                                    <p className="text-gray-500 text-sm">Solicitud el: {new Date(solicitud.fecha_solicitud).toLocaleDateString()}</p>
                                    <p className="text-gray-600 text-sm">Estado: <span className={`font-semibold ${solicitud.estado === 'aprobada' ? 'text-green-600' : solicitud.estado === 'rechazada' ? 'text-red-600' : 'text-yellow-600'}`}>{solicitud.estado}</span></p>
                                </div>
                            </div>
                            <div className="p-4 flex-grow">
                                {(activeTab === 'publicador' || isAdmin) && (
                                    <div className="mb-4">
                                        <h5 className="text-md font-semibold text-gray-700 mb-2">Detalles del Adoptante:</h5>
                                        <p className="text-gray-600"><strong>Nombre:</strong> {solicitud.adoptante_nombre}</p>
                                        <p className="text-gray-600"><strong>Email:</strong> {solicitud.adoptante_email}</p>
                                        <p className="text-gray-600"><strong>Teléfono:</strong> {solicitud.adoptante_telefono || 'N/A'}</p>
                                        {solicitud.motivo && <p className="text-gray-600"><strong>Motivo:</strong> {solicitud.motivo}</p>}
                                    </div>
                                )}

                                {activeTab === 'adoptante' && solicitud.adoptante_id === user?.id && (
                                    <div className="mb-4">
                                        <h5 className="text-md font-semibold text-gray-700 mb-2">Detalles del Publicador:</h5>
                                        <p className="text-gray-600">
                                            <strong>Publicador:</strong> {solicitud.publicador_nombre}
                                            {solicitud.publicador_email && ` (${solicitud.publicador_email})`}
                                        </p>
                                        <p className="text-gray-600">
                                            <strong>Ubicación Mascota:</strong> {solicitud.mascota_ubicacion || 'No especificada'}
                                        </p>
                                        <p className="text-gray-600">
                                            <strong>Motivo de tu Solicitud:</strong> {solicitud.motivo || 'No especificado'}
                                        </p>
                                    </div>
                                )}

                                {((isPublicador && activeTab === 'publicador') || isAdmin) && (
                                    <div className="mt-auto pt-4 border-t border-gray-200">
                                        <label htmlFor={`estado-${solicitud.id}`} className="block text-gray-700 text-sm font-bold mb-2">Cambiar Estado:</label>
                                        <select
                                            id={`estado-${solicitud.id}`}
                                            value={solicitud.estado}
                                            onChange={(e) => handleEstadoChange(solicitud.id, e.target.value)}
                                            disabled={solicitud.estado === 'aceptada' || solicitud.estado === 'rechazada'}
                                            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline mb-2"
                                        >
                                            <option value="pendiente">Pendiente</option>
                                            <option value="aceptada">Aceptar</option>
                                            <option value="rechazada">Rechazar</option>
                                        </select>
                                        {solicitud.publicador_id === user?.id && (isPublicador || isAdmin) && (
                                            <button onClick={() => handleDeleteSolicitud(solicitud.id)} className="bg-red-500 hover:bg-red-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline w-full">
                                                Eliminar Solicitud
                                            </button>
                                        )}
                                    </div>
                                )}

                                {isAdoptante && activeTab === 'adoptante' && solicitud.adoptante_id === user?.id && solicitud.estado === 'pendiente' && (
                                    <div className="mt-auto pt-4 border-t border-gray-200">
                                        <button onClick={() => handleDeleteSolicitud(solicitud.id)} className="bg-gray-300 hover:bg-gray-400 text-gray-800 font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline w-full">
                                            Cancelar Solicitud
                                        </button>
                                    </div>
                                )}
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
};

export default SolicitudesPage;
