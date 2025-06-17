// File: frontend/src/components/MascotaCard.js
import React from 'react';
import { Link } from 'react-router-dom';
import '../styles/MascotaCard.css';

// Definir la URL base de tus uploads del backend
const UPLOADS_BASE_URL = 'http://localhost:5000/uploads/';

const TAG_LABELS = {
    amigable_ninos: 'Amigable con niños',
    compatible_perros: 'Compatible con otros perros',
    patio_grande: 'Necesita patio grande',
    entrenado_bano: 'Entrenado para ir al baño',
    energia_alta: 'Nivel de energía: Alto',
    jugueton: 'Le encanta jugar',
    tranquilo: 'Tranquilo y cariñoso',
    requiere_medicacion: 'Requiere medicación',
    // ...etc
};

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

    const imageUrl = mascota.imagen_url 
        ? `${UPLOADS_BASE_URL}${mascota.imagen_url}` 
        : '/paw-icon.png';

    // --- NUEVO: Asegura que los tags sean un array ---
    let tags = [];
    if (mascota && mascota.tags) {
        if (Array.isArray(mascota.tags)) {
            tags = mascota.tags;
        } else if (typeof mascota.tags === 'string') {
            try {
                let parsed = JSON.parse(mascota.tags);
                if (typeof parsed === 'string') {
                    parsed = JSON.parse(parsed);
                }
                tags = Array.isArray(parsed) ? parsed : [];
            } catch {
                tags = [];
            }
        }
    }
    console.log('TAGS MascotaCard:', mascota.tags, '->', tags);
    // Ahora tags SIEMPRE es un array

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
                <p>Esterilizado: {mascota.esterilizado ? 'Sí' : 'No'}</p>
                <p>Vacunas: {mascota.vacunas ? 'Sí' : 'No'}</p>

                {/* INICIO: Bloque para mostrar los tags en MascotaCard */}
                {tags && Array.isArray(tags) && tags.length > 0 && (
                    <div className="mascota-tags">
                        {tags.map(tag => (
                            <span key={tag} className="mascota-tag">{TAG_LABELS[tag] || tag}</span>
                        ))}
                    </div>
                )}
                {/* FIN: Bloque para mostrar los tags */}

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