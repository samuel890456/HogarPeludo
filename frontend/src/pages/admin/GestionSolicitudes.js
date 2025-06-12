//file: frontend/src/pages/admin/GestionSolicitudes.js
import React, { useEffect, useState } from 'react';
import AdminNav from '../../components/admin/AdminNav';
import { fetchSolicitudes, aprobarSolicitud, rechazarSolicitud } from '../../api/adminApi';
import '../../styles/GestionSolicitudes.css';

const GestionSolicitudes = () => {
    const [solicitudes, setSolicitudes] = useState([]);

    useEffect(() => {
        fetchSolicitudes().then(setSolicitudes);
    }, []);

    const handleAprobar = async (id) => {
        await aprobarSolicitud(id);
        setSolicitudes(solicitudes.filter(s => s.id !== id));
    };

    const handleRechazar = async (id) => {
        await rechazarSolicitud(id);
        setSolicitudes(solicitudes.filter(s => s.id !== id));
    };

    return (
        <div className="gestion-solicitudes">
            <AdminNav />
            <h1>Gestión de Solicitudes</h1>
            <ul className="solicitud-list">
                {solicitudes.map(solicitud => (
                    <li className="solicitud-card" key={solicitud.id}>
                        <h3>{solicitud.usuario}</h3>
                        <p>Solicita adoptar: <strong>{solicitud.mascota}</strong></p>
                        <div className="solicitud-buttons">
                            <button className="btn-aprobar" onClick={() => handleAprobar(solicitud.id)}>Aprobar</button>
                            <button className="btn-rechazar" onClick={() => handleRechazar(solicitud.id)}>Rechazar</button>
                        </div>
                    </li>
                ))}
            </ul>
        </div>
    );
};

export default GestionSolicitudes;
