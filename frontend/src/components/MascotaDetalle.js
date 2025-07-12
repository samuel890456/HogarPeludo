import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import '../styles/MascotaDetalle.css';
import { Link } from 'react-router-dom';
import {
    faMars, faVenus, faMapMarkerAlt, faSyringe, faPaw, faShareNodes,
    faCalendarDays, faWeightHanging, faExpand, faPalette, faHeartCircleCheck, faHouseChimneyUser
} from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { toast } from 'react-toastify';

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
};

const MascotaDetalle = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const [mascota, setMascota] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [showAdoptSuccessModal, setShowAdoptSuccessModal] = useState(false);

    useEffect(() => {
        const fetchMascota = async () => {
            try {
                setLoading(true);
                const res = await axios.get(`http://localhost:5000/api/mascotas/${id}`);
                const fetchedMascota = {
                    ...res.data,
                    tags: res.data.tags ? JSON.parse(res.data.tags) : []
                };
                setMascota(fetchedMascota);
            } catch (err) {
                console.error("Error al cargar detalles de la mascota:", err);
                setError("No se pudo cargar la información de la mascota. Por favor, inténtalo de nuevo más tarde.");
            } finally {
                setLoading(false);
            }
        };
        fetchMascota();
    }, [id]);

    const handleAdoptClick = async () => {
        const usuarioId = localStorage.getItem('userId');
        const token = localStorage.getItem('token');

        if (!usuarioId || !token) {
            toast.info("Para solicitar la adopción, por favor inicia sesión. Si no tienes una cuenta, puedes registrarte.");
            navigate('/iniciar-sesion');
            return;
        }

        if (mascota.publicado_por_id === parseInt(usuarioId)) {
            toast.warn("No puedes solicitar la adopción de tu propia mascota publicada.");
            return;
        }

        try {
            const response = await fetch('http://localhost:5000/api/adopciones', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify({ mascota_id: mascota.id, adoptante_id: parseInt(usuarioId) }),
            });

            if (!response.ok) {
                const errorData = await response.json();

                if (response.status === 409) {
                    toast.warn(errorData.error);
                } else {
                    toast.error("Error al enviar solicitud de adopción: " + (errorData.error || 'Inténtalo de nuevo.'));
                }
                return;
            }

            const data = await response.json();
            setShowAdoptSuccessModal(true);
            toast.success('Solicitud de adopción enviada con éxito.');
        } catch (err) {
            console.error("Error enviando solicitud:", err);
            toast.error("Error de conexión al enviar solicitud de adopción. Por favor, inténtalo de nuevo más tarde.");
        }
    };

    const handleShare = async () => {
        if (navigator.share) {
            try {
                await navigator.share({
                    title: `¡Adopta a ${mascota.nombre} en Hogar Peludo!`,
                    text: `Conoce a ${mascota.nombre}, un(a) ${mascota.especie} de ${mascota.edad} años, que busca un hogar lleno de amor.`,
                    url: window.location.href,
                });
                console.log('Contenido compartido con éxito');
            } catch (shareError) {
                console.error('Error al compartir:', shareError);
            }
        } else {
            prompt("Copia este enlace para compartir:", window.location.href);
        }
    };

    if (loading) {
        return <p className="loading-message">Cargando detalles de la mascota...</p>;
    }

    if (error) {
        return <div className="error-message">{error}</div>;
    }

    if (!mascota) {
        return <div className="not-found-message">Lo sentimos, esta mascota no fue encontrada.</div>;
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
        <div className="mascota-detalle-container">
            <div className="mascota-detalle-header">
                <h1>{mascota.nombre}</h1>
                <p className="mascota-status-detail">
                    Estado: <span className={mascota.disponible ? 'available' : 'adopted'}>
                        {mascota.disponible ? 'Disponible para Adopción' : '¡Adoptado!'}
                    </span>
                </p>
            </div>

            <div className="mascota-detalle-content">
                <div className="mascota-image-gallery">
                    <img
                        src={imageUrl}
                        alt={`Foto de ${mascota.nombre}`}
                        className="main-mascota-image"
                        loading="lazy"
                        onError={(e) => { e.target.onerror = null; e.target.src = '/paw-icon.png'; }}
                    />
                </div>

                <div className="mascota-info-section">
                    <div className="info-grid">
                        <div className="info-item">
                            <p><FontAwesomeIcon icon={faPaw} /> Especie:</p>
                            <span>{mascota.especie}</span>
                        </div>
                        {mascota.raza && (
                            <div className="info-item">
                                <p>Raza:</p>
                                <span>{mascota.raza}</span>
                            </div>
                        )}
                        <div className="info-item">
                            <p><FontAwesomeIcon icon={faCalendarDays} /> Edad:</p>
                            <span>{mascota.edad} años</span>
                        </div>
                        <div className="info-item">
                            <p><FontAwesomeIcon icon={mascota.sexo === 'Macho' ? faMars : faVenus} /> Sexo:</p>
                            <span>{mascota.sexo}</span>
                        </div>
                        {mascota.tamano && (
                            <div className="info-item">
                                <p><FontAwesomeIcon icon={faExpand} /> Tamaño:</p>
                                <span>{mascota.tamano}</span>
                            </div>
                        )}
                        {mascota.peso && (
                            <div className="info-item">
                                <p><FontAwesomeIcon icon={faWeightHanging} /> Peso:</p>
                                <span>{mascota.peso} kg</span>
                            </div>
                        )}
                        {mascota.color && (
                            <div className="info-item">
                                <p><FontAwesomeIcon icon={faPalette} /> Color:</p>
                                <span>{mascota.color}</span>
                            </div>
                        )}
                        <div className="info-item full-width">
                            <p><FontAwesomeIcon icon={faMapMarkerAlt} /> Ubicación:</p>
                            <span>{mascota.ubicacion}</span>
                        </div>
                        <div className="info-item">
                            <p><FontAwesomeIcon icon={faSyringe} /> Vacunado:</p>
                            <span>{mascota.vacunas ? 'Sí' : 'No'}</span>
                        </div>
                        <div className="info-item">
                            <p><FontAwesomeIcon icon={faHeartCircleCheck} /> Esterilizado:</p>
                            <span>{mascota.esterilizado ? 'Sí' : 'No'}</span>
                        </div>
                    </div>

                    <div className="info-block">
                        <h3><FontAwesomeIcon icon={faPaw} /> Sobre {mascota.nombre}</h3>
                        <p>{mascota.descripcion}</p>
                    </div>

                    {mascota.historia && (
                        <div className="info-block">
                            <h3><FontAwesomeIcon icon={faHouseChimneyUser} /> Mi Historia</h3>
                            <p>{mascota.historia}</p>
                        </div>
                    )}

                    {mascota.estado_salud && (
                        <div className="info-block">
                            <h3><FontAwesomeIcon icon={faSyringe} /> Salud y Cuidados</h3>
                            <p>{mascota.estado_salud}</p>
                        </div>
                    )}

                    {tags && Array.isArray(tags) && tags.length > 0 && (
                        <div className="mascota-tags">
                            <h4>Características Destacadas:</h4>
                            <div className="tag-list-detail">
                                {tags.map(tag => (
                                    <span key={tag} className="mascota-tag-detail">{TAG_LABELS[tag] || tag}</span>
                                ))}
                            </div>
                        </div>
                    )}

                    {mascota.disponible ? (
                        <div className="adoption-cta-section">
                            <h3>¡Quiero Adoptar a {mascota.nombre}!</h3>
                            <p>Si estás listo para darle un hogar lleno de amor a {mascota.nombre}, haz clic en "Solicitar Adopción". ¡Es el primer paso hacia una hermosa amistad!</p>
                            <button
                                className="btn btn-primary"
                                onClick={handleAdoptClick}
                            >
                                <FontAwesomeIcon icon={faHeartCircleCheck} /> Solicitar Adopción
                            </button>
                            <button className="btn btn-secondary" onClick={handleShare}>
                                <FontAwesomeIcon icon={faShareNodes} /> Compartir Publicación
                            </button>
                            <p className="contact-tip">¿Dudas sobre el proceso? Visita nuestra sección <Link to="/#como-funciona">"Cómo Adoptar"</Link> o <Link to="/contacto">contáctanos</Link>.</p>
                        </div>
                    ) : (
                        <div className="adopted-message-section">
                            <h3>¡Felicidades! {mascota.nombre} ya ha encontrado un hogar.</h3>
                            <p>Nos alegra mucho que {mascota.nombre} tenga una nueva familia. ¡Hay muchas otras mascotas maravillosas esperando! <a href="/mascotas">Explora más mascotas disponibles</a>.</p>
                        </div>
                    )}
                </div>
            </div>

            <div className="back-button-container">
                <button className="btn-back" onClick={() => navigate(-1)}>
                    &larr; Volver al Listado de Mascotas
                </button>
            </div>

            {showAdoptSuccessModal && (
                <div className="modal-overlay">
                    <div className="modal-content">
                        <h2><FontAwesomeIcon icon={faHeartCircleCheck} /> ¡Solicitud Enviada!</h2>
                        <p>Tu solicitud de adopción para **{mascota.nombre}** ha sido enviada con éxito.</p>
                        <p>El publicador de la mascota ha sido notificado y pronto se pondrá en contacto contigo para los siguientes pasos.</p>
                        <p>Agradecemos tu interés en darle un hogar amoroso a una mascota. ¡Te deseamos mucha suerte!</p>
                        <button
                            className="btn btn-primary"
                            onClick={() => setShowAdoptSuccessModal(false)}
                            style={{ marginTop: '20px' }}
                        >
                            Cerrar y Volver
                        </button>
                    </div>
                </div>
            )}
        </div>
    );
};

export default MascotaDetalle;