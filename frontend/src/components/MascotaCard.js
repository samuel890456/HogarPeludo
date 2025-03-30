import React from 'react';
import { Link } from 'react-router-dom';
import '../styles/MascotaCard.css';

const MascotaCard = ({ mascota }) => {
    return (
        <div className="mascota-card">
            <img src={`http://localhost:5000/uploads/${mascota.foto}`} alt={mascota.nombre} />
            <h2>{mascota.nombre}</h2>
            <p>{mascota.especie} - {mascota.raza}</p>
            <p>Edad: {mascota.edad} años</p>
            <p>{mascota.descripcion}</p>
            <Link to={`/mascotas/${mascota.id}`} className="btn-primary">Ver Detalles</Link>
        </div>
    );
};

export default MascotaCard;