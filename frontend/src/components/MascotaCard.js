// File: frontend/src/components/MascotaCard.js
import React from 'react';
import { Link } from 'react-router-dom';
import '../styles/MascotaCard.css';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'; // Importar FontAwesomeIcon
import { faMapMarkerAlt, faMars, faVenus, faHeartCircleCheck, faSyringe, faPaw } from '@fortawesome/free-solid-svg-icons'; // Importar iconos específicos

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

    return (
        <div className="mascota-card">
            <div className="mascota-image-wrapper"> {/* Nuevo wrapper para la imagen y el estado */}
                <img
                    src={imageUrl}
                    alt={`Foto de ${mascota.nombre}`}
                    className="mascota-image"
                    onError={(e) => {
                        e.target.onerror = null;
                        e.target.src = '/paw-icon.png';
                    }}
                />
                {mascota.disponible !== undefined && (
                    <span className={`mascota-status-badge ${mascota.disponible ? 'available' : 'adopted'}`}>
                        {mascota.disponible ? 'Disponible' : 'Adoptado'}
                    </span>
                )}
            </div>
            <div className="mascota-info">
                <h3 className="mascota-name">{mascota.nombre}</h3>
                <p className="mascota-species-breed">
                    <FontAwesomeIcon icon={faPaw} /> {mascota.especie} {mascota.raza ? `- ${mascota.raza}` : ''}
                </p>
                <p className="mascota-location-card">
                    <FontAwesomeIcon icon={faMapMarkerAlt} /> {mascota.ubicacion}
                </p>
                <p className="mascota-sex-age-card">
                    <FontAwesomeIcon icon={mascota.sexo === 'Macho' ? faMars : faVenus} /> {mascota.sexo} | {mascota.edad} años
                </p>
                <p className="mascota-health-info">
                    <FontAwesomeIcon icon={faSyringe} /> Vacunado: {mascota.vacunas ? 'Sí' : 'No'} | <FontAwesomeIcon icon={faHeartCircleCheck} /> Esterilizado: {mascota.esterilizado ? 'Sí' : 'No'}
                </p>


                {tags && Array.isArray(tags) && tags.length > 0 && (
                    <div className="mascota-tags-card"> {/* Nuevo contenedor para los tags de la card */}
                        {tags.slice(0, 3).map(tag => ( /* Mostrar solo los primeros 3 tags */
                            <span key={tag} className="mascota-tag-card">{TAG_LABELS[tag] || tag}</span>
                        ))}
                        {tags.length > 3 && <span className="mascota-tag-card">+{tags.length - 3} más</span>} {/* Si hay más, indica la cantidad */}
                    </div>
                )}

                {showDetailButton && (
                    <Link to={`/mascotas/${mascota.id}`} className="btn-detail-card"> {/* Cambié a btn-detail-card */}
                        Ver Detalle
                    </Link>
                )}
            </div>
        </div>
    );
};

export default MascotaCard;