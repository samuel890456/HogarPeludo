/*import React, { useEffect, useState } from 'react';
import { getMisPublicaciones } from '../api/api.js';
import '../styles/MisPublicaciones.css';

const MisPublicaciones = ({ user }) => {
    const [publicaciones, setPublicaciones] = useState([]);

    useEffect(() => {
        const fetchPublicaciones = async () => {
            try {
                const data = await getMisPublicaciones(user.id);
                setPublicaciones(data);
            } catch (error) {
                console.error('Error al cargar las publicaciones:', error);
            }
        };
        fetchPublicaciones();
    }, [user.id]);

    return (
        <div className="mis-publicaciones">
            <h1>Mis Publicaciones</h1>
            {publicaciones.length > 0 ? (
                <ul className="publicacion-list">
                    {publicaciones.map(publicacion => (
                        <li key={publicacion.id} className="publicacion-item">
                            <h2>{publicacion.titulo}</h2>
                            <p>{publicacion.descripcion}</p>
                        </li>
                    ))}
                </ul>
            ) : (
                <p>No tienes publicaciones.</p>
            )}
        </div>
    );
};

export default MisPublicaciones;*/