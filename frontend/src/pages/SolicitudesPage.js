import React, { useEffect, useState } from 'react';
import { Link } from "react-router-dom";
import { getSolicitudes, updateSolicitudEstado, deleteSolicitud } from '../api/api';
import '../styles/SolicitudesPage.css'; // Make sure this path is correct

const UPLOADS_BASE_URL = 'http://localhost:5000/uploads/';

const SolicitudesPage = () => {
    const [solicitudes, setSolicitudes] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [activeTab, setActiveTab] = useState('');

    const userId = parseInt(localStorage.getItem('userId'));
    const userRoles = JSON.parse(localStorage.getItem('userRoles') || '[]');

    const isAdmin = userRoles.includes('1');
    const isPublicador = userRoles.includes('2');
    const isAdoptante = userRoles.includes('3');

    useEffect(() => {
        if (isAdoptante) {
            setActiveTab('adoptante');
        } else if (isPublicador) {
            setActiveTab('publicador');
        } else if (isAdmin) {
            setActiveTab('admin');
        }
    }, [isAdoptante, isPublicador, isAdmin]);


    useEffect(() => {
        const fetchSolicitudes = async () => {
            try {
                const data = await getSolicitudes();
                setSolicitudes(data);
            } catch (err) {
                setError('Error al cargar las solicitudes. Por favor, inténtalo de nuevo más tarde.');
                console.error(err);
            } finally {
                setLoading(false);
            }
        };

        fetchSolicitudes();
    }, []);

    const handleEstadoChange = async (solicitudId, newEstado) => {
        try {
            await updateSolicitudEstado(solicitudId, newEstado);
            setSolicitudes(solicitudes.map(sol =>
                sol.id === solicitudId ? { ...sol, estado: newEstado } : sol
            ));
            alert('Estado de la solicitud actualizado con éxito.');
        } catch (err) {
            setError('Error al actualizar el estado de la solicitud.');
            console.error(err);
            alert('No se pudo actualizar el estado de la solicitud. Revisa los permisos.');
        }
    };

    const handleDeleteSolicitud = async (solicitudId) => {
        if (window.confirm('¿Estás seguro de que quieres eliminar esta solicitud?')) {
            try {
                await deleteSolicitud(solicitudId);
                setSolicitudes(solicitudes.filter(sol => sol.id !== solicitudId));
                alert('Solicitud eliminada con éxito.');
            } catch (err) {
                setError('Error al eliminar la solicitud.');
                console.error(err);
                alert('No se pudo eliminar la solicitud. Revisa los permisos.');
            }
        }
    };

    if (loading) {
        return <div className="solicitudes-container loading"><p>Cargando solicitudes...</p></div>;
    }

    if (error) {
        return <div className="solicitudes-container error-message"><p>{error}</p></div>;
    }

    const solicitudesComoAdoptante = solicitudes.filter(
        sol => sol.adoptante_id === userId
    );

    const solicitudesParaMisMascotas = solicitudes.filter(
        sol => sol.publicador_id === userId
    );

    let solicitudesAMostrar = [];
    let tituloSeccion = "";

    if (activeTab === 'adoptante') {
        solicitudesAMostrar = solicitudesComoAdoptante;
        tituloSeccion = "Mis Solicitudes de Adopción";
    } else if (activeTab === 'publicador') {
        solicitudesAMostrar = solicitudesParaMisMascotas;
        tituloSeccion = "Solicitudes Recibidas para Mis Mascotas";
    } else if (isAdmin) {
        solicitudesAMostrar = solicitudes;
        tituloSeccion = "Todas las Solicitudes (Admin)";
    }

    return (
        <div className="solicitudes-container">
            <h2 className="page-title">Gestión de Solicitudes</h2>

            <div className="solicitudes-tabs-navigation">
                {isAdoptante && (
                    <button
                        className={`tab-button ${activeTab === 'adoptante' ? 'active' : ''}`}
                        onClick={() => setActiveTab('adoptante')}
                    >
                        Mis Solicitudes
                    </button>
                )}
                {isPublicador && (
                    <button
                        className={`tab-button ${activeTab === 'publicador' ? 'active' : ''}`}
                        onClick={() => setActiveTab('publicador')}
                    >
                        Solicitudes para Mis Mascotas
                    </button>
                )}
                {isAdmin && (
                    <button
                        className={`tab-button ${activeTab === 'admin' ? 'active' : ''}`}
                        onClick={() => setActiveTab('admin')}
                    >
                        Todas las Solicitudes
                    </button>
                )}
            </div>

            <h3 className="section-title">{tituloSeccion}</h3>

            {solicitudesAMostrar.length === 0 ? (
                <div className="no-solicitudes-message">
                    <p>No hay solicitudes disponibles en esta sección.</p>
                    <Link to="/">
                        <img src="/images/nada.gif" alt="No hay solicitudes" className="empty-state-image" />
                    </Link>
                </div>
            ) : (
                <div className="solicitudes-grid">
                    {solicitudesAMostrar.map((solicitud) => (
                        <div key={solicitud.id} className="solicitud-card">
                            <div className="card-header">
                                <img
                                    src={
                                        solicitud.mascota_imagen_url
                                            ? `${UPLOADS_BASE_URL}${solicitud.mascota_imagen_url}`
                                            : '/nada.gif' // Default placeholder if no image
                                    }
                                    alt={solicitud.mascota_nombre}
                                    className="mascota-img"
                                />
                                <div className="mascota-info">
                                    <h4>{solicitud.mascota_nombre} <span className="species-tag">({solicitud.mascota_especie})</span></h4>
                                    <p className="card-date">Solicitud el: {new Date(solicitud.fecha_solicitud).toLocaleDateString()}</p>
                                    <p className="card-status">Estado: <span className={`status-${solicitud.estado}`}>{solicitud.estado}</span></p>
                                </div>
                            </div>
                            <div className="card-details">
                                {(activeTab === 'publicador' || isAdmin) && (
                                    <>
                                        <h5 className="details-title">Detalles del Adoptante:</h5>
                                        <p><strong>Nombre:</strong> {solicitud.adoptante_nombre}</p>
                                        <p><strong>Email:</strong> {solicitud.adoptante_email}</p>
                                        <p><strong>Teléfono:</strong> {solicitud.adoptante_telefono || 'N/A'}</p>
                                        {solicitud.motivo && <p><strong>Motivo:</strong> {solicitud.motivo}</p>}
                                    </>
                                )}

                                {activeTab === 'adoptante' && solicitud.adoptante_id === userId && (
                                    <>
                                        <h5 className="details-title">Detalles del Publicador:</h5>
                                        <p><strong>Publicador:</strong> {solicitud.publicador_nombre} ({solicitud.publicador_email})</p>
                                        <p><strong>Ubicación Mascota:</strong> {solicitud.mascota_ubicacion || 'N/A'}</p> {/* Assuming mascota_ubicacion is available */}
                                        <p><strong>Motivo de tu Solicitud:</strong> {solicitud.motivo || 'No especificado'}</p>
                                    </>
                                )}

                                {((isPublicador && activeTab === 'publicador') || isAdmin) && (
                                    <div className="card-actions">
                                        <label htmlFor={`estado-${solicitud.id}`}>Cambiar Estado:</label>
                                        <select
                                            id={`estado-${solicitud.id}`}
                                            value={solicitud.estado}
                                            onChange={(e) => handleEstadoChange(solicitud.id, e.target.value)}
                                            disabled={solicitud.estado === 'aceptada' || solicitud.estado === 'rechazada'}
                                        >
                                            <option value="pendiente">Pendiente</option>
                                            <option value="aceptada">Aceptar</option>
                                            <option value="rechazada">Rechazar</option>
                                        </select>
                                        {solicitud.publicador_id === userId && (isPublicador || isAdmin) && (
                                            <button onClick={() => handleDeleteSolicitud(solicitud.id)} className="btn btn-delete">
                                                Eliminar Solicitud
                                            </button>
                                        )}
                                    </div>
                                )}

                                {isAdoptante && activeTab === 'adoptante' && solicitud.adoptante_id === userId && solicitud.estado === 'pendiente' && (
                                    <div className="card-actions">
                                        <button onClick={() => handleDeleteSolicitud(solicitud.id)} className="btn btn-cancel">
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