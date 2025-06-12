// frontend/src/pages/MisPublicaciones.js
import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom'; // Importa useNavigate
import MascotaCard from '../components/MascotaCard';
// import MascotaForm from '../components/MascotaForm'; // Ya no lo importamos aquí directamente para edición
import { getMascotasByUserId, deleteMascota as apiDeleteMascota } from '../api/api';
import '../styles/MisPublicaciones.css';

const MisPublicaciones = () => {
    const [misMascotas, setMisMascotas] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    // const [editingMascota, setEditingMascota] = useState(null); // Ya no es necesario si redirigimos
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

    const handleDeleteClick = async (mascotaId) => {
        if (window.confirm('¿Estás seguro de que quieres eliminar esta publicación? Esta acción no se puede deshacer.')) {
            try {
                setLoading(true);
                await apiDeleteMascota(mascotaId);
                alert('Mascota eliminada con éxito.');
                fetchMisMascotas(); // Recarga la lista después de eliminar
            } catch (err) {
                console.error("Error al eliminar mascota:", err);
                setError('Error al eliminar la publicación: ' + (err.response?.data?.error || err.message));
            } finally {
                setLoading(false);
            }
        }
    };

    // const handleMascotaSaved = () => { ... } // Esto ya no es necesario aquí si MascotaForm maneja la redirección

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
                        <Link to="/publicar-mascota" className="btn-primary">Publicar mi primera mascota</Link>
                    </div>
                ) : (
                    <div className="mascotas-grid-mis-publicaciones">
                        {misMascotas.map(mascota => (
                            <div key={mascota.id} className="mi-publicacion-item-wrapper">
                                <MascotaCard mascota={mascota} showDetailButton={false} />
                                <div className="item-actions">
                                    <button className="btn-edit" onClick={() => handleEditClick(mascota)}>
                                        <i className="fas fa-edit"></i> Editar
                                    </button>
                                    <button className="btn-delete" onClick={() => handleDeleteClick(mascota.id)}>
                                        <i className="fas fa-trash"></i> Eliminar
                                    </button>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </>
        </div>
    );
};

export default MisPublicaciones;