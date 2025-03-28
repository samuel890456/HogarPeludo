import React, { useEffect, useState } from 'react';
import { getMascotas } from '../api/api'; // Asegúrate de que la ruta sea correcta
import MascotaCard from './MascotaCard';
import '../styles/MascotaList.css';

const MascotaList = () => {
    const [mascotas, setMascotas] = useState([]);

    useEffect(() => {
        const fetchMascotas = async () => {
            try {
                const data = await getMascotas();
                setMascotas(data);
            } catch (error) {
                console.error('Error al cargar las mascotas:', error);
            }
        };
        fetchMascotas();
    }, []);

    return (
        <div className="mascota-list">
            {mascotas.length > 0 ? (
                mascotas.map(mascota => (
                    <MascotaCard key={mascota.id} mascota={mascota} />
                ))
            ) : (
                <p>No hay mascotas disponibles.</p>
            )}
        </div>
    );
};

export default MascotaList;