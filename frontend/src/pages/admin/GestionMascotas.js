import React, { useEffect, useState } from 'react';
import AdminNav from '../../components/admin/AdminNav';
import { fetchMascotas, eliminarMascota } from '../../api/adminApi';
import '../../styles/GestionMascotas.css';

const GestionMascotas = () => {
    const [mascotas, setMascotas] = useState([]);

    useEffect(() => {
        fetchMascotas().then(setMascotas);
    }, []);

    const handleEliminar = (id) => {
        eliminarMascota(id).then(() => {
            setMascotas(mascotas.filter(m => m.id !== id));
        });
    };

    return (
        <div className="gestion-mascotas">
            <AdminNav />
            <h1>Gestión de Mascotas</h1>
            <ul className="mascota-list">
                {mascotas.map(mascota => (
                    <li className="mascota-card" key={mascota.id}>
                        <h3>{mascota.nombre}</h3>
                        <p>Especie: {mascota.especie}</p>
                        <p>Edad: {mascota.edad} años</p>
                        <button onClick={() => handleEliminar(mascota.id)}>Eliminar</button>
                    </li>
                ))}
            </ul>
        </div>
    );
    
};

export default GestionMascotas;
