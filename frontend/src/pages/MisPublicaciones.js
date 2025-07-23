import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import MascotaCard from '../components/MascotaCard';
import useAuthStore from '../store/authStore';

import { getMascotasByUserId, deleteMascota as apiDeleteMascota } from '../api/api';
import { toast } from 'react-toastify';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faEdit, faTrash } from '@fortawesome/free-solid-svg-icons';

const MisPublicaciones = () => {
    const { user } = useAuthStore();
    const [misMascotas, setMisMascotas] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [showConfirm, setShowConfirm] = useState(false);
    const [mascotaAEliminar, setMascotaAEliminar] = useState(null);
    const navigate = useNavigate();

    const fetchMisMascotas = async () => {
        setLoading(true);
        setError(null);
        try {
            if (!user?.id) {
                setError('Usuario no autenticado. Por favor, inicia sesión.');
                setLoading(false);
                return;
            }
            const data = await getMascotasByUserId(user.id);
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

    if (loading) return <div className="text-center py-8 text-lg text-gray-600">Cargando tus publicaciones...</div>;
    if (error) return <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative mx-auto max-w-4xl mt-8">{error}</div>;

    return (
        <div className="container mx-auto p-4">
            <h1 className="text-4xl font-bold text-gray-800 mb-6 text-center">Mis Publicaciones</h1>
            <div className="flex justify-center mb-6">
                <Link to="/publicar-mascota" className="bg-orange-500 hover:bg-orange-600 text-white font-bold py-2 px-4 rounded-full inline-flex items-center transition duration-300">
                    <i className="fas fa-plus-circle mr-2"></i> Publicar Nueva Mascota
                </Link>
            </div>

            {misMascotas.length === 0 ? (
                <div className="bg-white p-6 rounded-lg shadow-md text-center">
                    <p className="text-gray-600 mb-4">No tienes publicaciones activas.</p>
                    <Link to="/publicar-mascota" className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded-full transition duration-300">Publicar mi primera mascota</Link>
                </div>
            ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                    {misMascotas.map(mascota => (
                        <div key={mascota.id} className="bg-white rounded-lg shadow-md overflow-hidden flex flex-col">
                            <MascotaCard mascota={mascota} showDetailButton={false} />
                            <div className="p-4 border-t border-gray-200 flex justify-around space-x-2">
                                <button className="flex-1 bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded-full text-sm inline-flex items-center justify-center" onClick={() => handleEditClick(mascota)}>
                                    <FontAwesomeIcon icon={faEdit} className="mr-2" /> Editar
                                </button>
                                <button className="flex-1 bg-red-500 hover:bg-red-700 text-white font-bold py-2 px-4 rounded-full text-sm inline-flex items-center justify-center" onClick={() => handleDeleteClick(mascota.id)}>
                                    <FontAwesomeIcon icon={faTrash} className="mr-2" /> Eliminar
                                </button>
                            </div>
                        </div>
                    ))}
                </div>
            )}

            {showConfirm && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
                    <div className="bg-white p-8 rounded-lg shadow-xl max-w-sm w-full text-center">
                        <p className="text-gray-700 mb-6">¿Estás seguro de que quieres eliminar esta publicación?</p>
                        <div className="flex justify-center space-x-4">
                            <button className="bg-gray-300 hover:bg-gray-400 text-gray-800 font-bold py-2 px-4 rounded-full transition duration-300" onClick={cancelDelete}>Cancelar</button>
                            <button className="bg-red-500 hover:bg-red-700 text-white font-bold py-2 px-4 rounded-full transition duration-300" onClick={confirmDelete}>Sí, eliminar</button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default MisPublicaciones;