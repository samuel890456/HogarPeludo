import React, { useEffect, useState } from 'react';
import { getSolicitudes } from '../api/api'; // Asegúrate de que la ruta sea correcta
import '../styles/Adopciones.css';

const Adopciones = () => {
    const [solicitudes, setSolicitudes] = useState([]);

    useEffect(() => {
        const fetchSolicitudes = async () => {
            try {
                const data = await getSolicitudes();
                setSolicitudes(data);
            } catch (error) {
                console.error('Error al cargar las solicitudes:', error);
            }
        };
        fetchSolicitudes();
    }, []);

    return (
        <div className="adopciones">
            <h1>Mis Solicitudes de Adopción</h1>
            {solicitudes.length > 0 ? (
                <ul className="solicitud-list">
                    {solicitudes.map(solicitud => (
                        <li key={solicitud.id} className="solicitud-item">
                            <p>Mascota: {solicitud.mascota.nombre}</p>
                            <p>Estado: {solicitud.estado}</p>
                        </li>
                    ))}
                </ul>
            ) : (
                <p>No tienes solicitudes de adopción.</p>
            )}
        </div>
    );
};

export default Adopciones;