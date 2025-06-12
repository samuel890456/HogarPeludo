import React, { useEffect, useState } from 'react';
import AdminNav from '../../components/admin/AdminNav';
import { fetchMascotas, eliminarMascota } from '../../api/adminApi';
import '../../styles/GestionMascotas.css'; // Asegúrate de que este CSS maneje la nueva estructura

const GestionMascotas = () => {
    const [mascotas, setMascotas] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const cargarMascotas = async () => {
            try {
                const data = await fetchMascotas();
                setMascotas(data);
            } catch (err) {
                setError('Error al cargar las mascotas: ' + err.message);
            } finally {
                setLoading(false);
            }
        };
        cargarMascotas();
    }, []);

    const handleEliminar = async (id) => {
        if (window.confirm('¿Estás seguro de que quieres eliminar esta mascota?')) {
            try {
                await eliminarMascota(id);
                setMascotas(mascotas.filter(m => m.id !== id));
                alert('Mascota eliminada con éxito.');
            } catch (err) {
                alert('Error al eliminar la mascota: ' + err.message);
            }
        }
    };

    if (loading) {
        return <div className="gestion-mascotas"><AdminNav />Cargando mascotas...</div>;
    }

    if (error) {
        return <div className="gestion-mascotas"><AdminNav />Error: {error}</div>;
    }

    return (
        <div className="gestion-mascotas">
            <AdminNav />
            <h1>Gestión de Mascotas</h1>
            {mascotas.length === 0 ? (
                <p>No hay mascotas publicadas.</p>
            ) : (
                <div className="mascota-grid"> {/* Cambiado a grid para mejor visualización */}
                    {mascotas.map(mascota => (
                        <div className="mascota-card" key={mascota.id}>
                            {mascota.imagen_url && (
                                <img src={mascota.imagen_url} alt={mascota.nombre} className="mascota-imagen" />
                            )}
                            <h3>{mascota.nombre}</h3>
                            <p><strong>Especie:</strong> {mascota.especie}</p>
                            <p><strong>Raza:</strong> {mascota.raza || 'N/A'}</p>
                            <p><strong>Edad:</strong> {mascota.edad} años</p>
                            <p><strong>Sexo:</strong> {mascota.sexo}</p>
                            <p><strong>Tamaño:</strong> {mascota.tamano || 'N/A'}</p>
                            <p><strong>Peso:</strong> {mascota.peso ? `${mascota.peso} kg` : 'N/A'}</p>
                            <p><strong>Color:</strong> {mascota.color || 'N/A'}</p>
                            <p><strong>Descripción:</strong> {mascota.descripcion || 'Sin descripción.'}</p>
                            <p><strong>Estado de Salud:</strong> {mascota.estado_salud || 'Desconocido.'}</p>
                            <p><strong>Historia:</strong> {mascota.historia || 'Sin historia.'}</p>
                            <p><strong>Ubicación:</strong> {mascota.ubicacion}</p>
                            <p><strong>Publicado por ID:</strong> {mascota.publicado_por_id}</p>
                            <p><strong>Fecha Publicación:</strong> {new Date(mascota.fecha_publicacion).toLocaleDateString()}</p>
                            <p><strong>Disponible:</strong> {mascota.disponible ? 'Sí' : 'No'}</p>
                            <button onClick={() => handleEliminar(mascota.id)} className="btn-eliminar">Eliminar</button>
                            {/* Aquí podrías añadir un botón para editar si implementas esa funcionalidad */}
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
};

export default GestionMascotas;