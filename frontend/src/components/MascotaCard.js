// File: frontend/src/components/MascotaCard.js
import React from 'react';
import { Link } from 'react-router-dom';
import '../styles/MascotaCard.css';

// Definir la URL base de tus uploads del backend
const UPLOADS_BASE_URL = 'http://localhost:5000/uploads/';

const MascotaCard = ({ mascota, showDetailButton = true }) => {
    if (!mascota) {
        return (
            <div className="mascota-card skeleton">
                <div className="skeleton-image"></div>
                <div className="skeleton-info">
                    <div className="skeleton-line"></div>
                    <div className="skeleton-line short"></div>
                    <div className="skeleton-line"></div>
                </div>
            </div>
        );
    }

    // AQUI: Construye la URL completa
    // Si mascota.imagen_url es 'null', 'undefined' o una cadena vacía, usa la imagen de fallback.
    // Si tiene un nombre de archivo, prefija con UPLOADS_BASE_URL.
    const imageUrl = mascota.imagen_url 
        ? `${UPLOADS_BASE_URL}${mascota.imagen_url}` 
        : '/paw-icon.png'; // Asegúrate de que '/paw-icon.png' existe en tu carpeta 'public'

    return (
        <div className="mascota-card">
            <img
                src={imageUrl}
                alt={`Foto de ${mascota.nombre}`}
                className="mascota-image"
                onError={(e) => {
                    e.target.onerror = null;
                    e.target.src = '/paw-icon.png'; 
                }}
            />
            <div className="mascota-info">
                <h3 className="mascota-name">{mascota.nombre}</h3>
                <p className="mascota-species">{mascota.especie} - {mascota.raza}</p>
                <p className="mascota-location"><i className="fas fa-map-marker-alt"></i> {mascota.ubicacion}</p>
                <p className="mascota-sex-age">
                    <i className={`fas fa-${mascota.sexo === 'Macho' ? 'mars' : 'venus'}`}></i> {mascota.sexo} | {mascota.edad} años
                </p>
                {mascota.disponible !== undefined && (
                    <p className={`mascota-status ${mascota.disponible ? 'available' : 'adopted'}`}>
                        Estado: {mascota.disponible ? 'Disponible' : 'Adoptado'}
                    </p>
                )}

                {showDetailButton && (
                    <Link to={`/mascotas/${mascota.id}`} className="btn-detail">
                        Ver Detalle
                    </Link>
                )}
            </div>
        </div>
    );
};

export default MascotaCard;