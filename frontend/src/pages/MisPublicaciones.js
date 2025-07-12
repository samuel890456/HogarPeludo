// frontend/src/pages/MisPublicaciones.js
import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom'; // Importa useNavigate
import MascotaCard from '../components/MascotaCard';

import { getMascotasByUserId, deleteMascota as apiDeleteMascota } from '../api/api';
import { toast } from 'react-toastify';
import '../styles/MisPublicaciones.css';

const MisPublicaciones = () => {
    const [misMascotas, setMisMascotas] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [showConfirm, setShowConfirm] = useState(false);
    const [mascotaAEliminar, setMascotaAEliminar] = useState(null);
    const navigate = useNavigate(); // Hook para la navegación

    const fetchMisMascotas = async () => {
        setLoading(true);
        setError(null);
        try {
            const userId = localStorage.getItem('userId');
            if (!userId) {
                setError('Usuario no autenticado. Por favor, inicia sesión.');
                setLoading(false);
                return;
            }
            const data = await getMascotasByUserId(userId);
            setMisMascotas(data);
        } catch (err) {
            console.error("Error fetching mis mascotas:", err);
            setError('No se pudieron cargar tus publicaciones. ' + (err.response?.data?.message || err.message));
        } finally {
            setLoading(false);
        }
    };
    useEffect(() => {
        fetchMisMascotas();
    }, []);

    const handleEditClick = (mascota) => {
        // Redirigir a la ruta de edición con el ID de la mascota
        navigate(`/mascotas/${mascota.id}/editar`);
    };

    const handleDeleteClick = (mascotaId) => {
        setMascotaAEliminar(mascotaId);
        setShowConfirm(true);
    };

    const confirmDelete = async () => {
        setShowConfirm(false);
        if (!mascotaAEliminar) return;
        try {
            setLoading(true);
            await apiDeleteMascota(mascotaAEliminar);
            toast.success('Mascota eliminada con éxito.');
            fetchMisMascotas();
        } catch (err) {
            console.error("Error al eliminar mascota:", err);
            setError('Error al eliminar la publicación: ' + (err.response?.data?.error || err.message));
            toast.error('Error al eliminar la publicación.');
        } finally {
            setLoading(false);
            setMascotaAEliminar(null);
        }
    };

    const cancelDelete = () => {
        setShowConfirm(false);
        setMascotaAEliminar(null);
    };

    if (loading) return <div className="loading-message">Cargando tus publicaciones...</div>;
    if (error) return <div className="error-message">{error}</div>;

    return (
        <div className="mis-publicaciones-page">
            <h1>Mis Publicaciones</h1>
            {/* Si editingMascota ya no se usa aquí, eliminamos el condicional de renderizado */}
            <>
                {misMascotas.length === 0 ? (
                    <div className="no-mascotas-message">
                        <p>No tienes publicaciones activas.</p>
                        <Link to="/publicar-mascota" className="btn btn-primary">Publicar mi primera mascota</Link>
                    </div>
                ) : (
                    <div className="mascotas-grid-mis-publicaciones">
                        {misMascotas.map(mascota => (
                            <div key={mascota.id} className="mi-publicacion-item-wrapper">
                                <MascotaCard mascota={mascota} showDetailButton={false} />
                                <div className="item-actions">
                                    <button className="btn btn-primary" onClick={() => handleEditClick(mascota)}>
                                        <i className="fas fa-edit"></i> Editar
                                    </button>
                                    <button className="btn btn-danger" onClick={() => handleDeleteClick(mascota.id)}>
                                        <i className="fas fa-trash"></i> Eliminar
                                    </button>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </>
            {showConfirm && (
                <div className="modal-confirm">
                    <div className="modal-content">
                        <p>¿Estás seguro de que quieres eliminar esta publicación?</p>
                        <div className="modal-actions">
                            <button className="btn btn-secondary" onClick={cancelDelete}>Cancelar</button>
                            <button className="btn btn-danger" onClick={confirmDelete}>Sí, eliminar</button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default MisPublicaciones;