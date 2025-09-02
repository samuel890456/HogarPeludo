import React, { useEffect, useState } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import axios from 'axios';
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
    const [suggestedPets, setSuggestedPets] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [showAdoptSuccessModal, setShowAdoptSuccessModal] = useState(false);

    useEffect(() => {
        const fetchMascotaAndSuggestions = async () => {
            try {
                setLoading(true);
                const res = await axios.get(`http://localhost:5000/api/mascotas/${id}`);
                const fetchedMascota = {
                    ...res.data,
                    tags: res.data.tags ? JSON.parse(res.data.tags) : []
                };
                setMascota(fetchedMascota);

                const allPetsRes = await axios.get('http://localhost:5000/api/mascotas');
                const otherPets = allPetsRes.data.filter(pet => pet.id !== parseInt(id) && pet.disponible);
                const randomPets = otherPets.sort(() => 0.5 - Math.random()).slice(0, 4);
                setSuggestedPets(randomPets);

            } catch (err) {
                console.error("Error al cargar detalles de la mascota:", err);
                setError("No se pudo cargar la información de la mascota. Por favor, inténtalo de nuevo más tarde.");
            } finally {
                setLoading(false);
            }
        };
        fetchMascotaAndSuggestions();
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
        return <p className="text-center text-lg text-gray-600 py-8">Cargando detalles de la mascota...</p>;
    }

    if (error) {
        return <div className="text-center text-red-500 text-lg py-8">{error}</div>;
    }

    if (!mascota) {
        return <div className="text-center text-lg text-gray-600 py-8">Lo sentimos, esta mascota no fue encontrada.</div>;
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
        <div className="bg-gray-50 min-h-screen">
            <div className="container mx-auto p-4 max-w-6xl">
                <div className="bg-white rounded-lg shadow-lg overflow-hidden">
                    <div className="md:flex">
                        <div className="md:w-1/2">
                            <img
                                src={imageUrl}
                                alt={`Foto de ${mascota.nombre}`}
                                className="w-full h-full object-cover"
                                loading="lazy"
                                onError={(e) => { e.target.onerror = null; e.target.src = '/paw-icon.png'; }}
                            />
                        </div>
                        <div className="p-6 md:w-1/2">
                            <div className="flex justify-between items-start">
                                <div>
                                    <h1 className="text-4xl font-bold text-gray-800">{mascota.nombre}</h1>
                                    <p className={`mt-2 text-lg ${mascota.disponible ? 'text-green-600' : 'text-red-600'}`}>
                                        {mascota.disponible ? 'Disponible para Adopción' : '¡Adoptado!'}
                                    </p>
                                </div>
                                <button onClick={handleShare} className="p-2 rounded-full hover:bg-gray-200 transition">
                                    <FontAwesomeIcon icon={faShareNodes} className="text-gray-600" />
                                </button>
                            </div>

                            <div className="mt-4 grid grid-cols-2 sm:grid-cols-3 gap-4 text-gray-700">
                                <div className="flex items-center space-x-2">
                                    <FontAwesomeIcon icon={faPaw} className="text-orange-500" />
                                    <span>{mascota.especie}</span>
                                </div>
                                {mascota.raza && (
                                    <div className="flex items-center space-x-2">
                                        <span>{mascota.raza}</span>
                                    </div>
                                )}
                                <div className="flex items-center space-x-2">
                                    <FontAwesomeIcon icon={faCalendarDays} className="text-orange-500" />
                                    <span>{mascota.edad} años</span>
                                </div>
                                <div className="flex items-center space-x-2">
                                    <FontAwesomeIcon icon={mascota.sexo === 'Macho' ? faMars : faVenus} className="text-orange-500" />
                                    <span>{mascota.sexo}</span>
                                </div>
                                {mascota.tamano && (
                                    <div className="flex items-center space-x-2">
                                        <FontAwesomeIcon icon={faExpand} className="text-orange-500" />
                                        <span>{mascota.tamano}</span>
                                    </div>
                                )}
                                {mascota.peso && (
                                    <div className="flex items-center space-x-2">
                                        <FontAwesomeIcon icon={faWeightHanging} className="text-orange-500" />
                                        <span>{mascota.peso} kg</span>
                                    </div>
                                )}
                                {mascota.color && (
                                    <div className="flex items-center space-x-2">
                                        <FontAwesomeIcon icon={faPalette} className="text-orange-500" />
                                        <span>{mascota.color}</span>
                                    </div>
                                )}
                                <div className="flex items-center space-x-2 col-span-full">
                                    <FontAwesomeIcon icon={faMapMarkerAlt} className="text-orange-500" />
                                    <span>{mascota.ubicacion}</span>
                                </div>
                                <div className="flex items-center space-x-2">
                                    <FontAwesomeIcon icon={faSyringe} className="text-orange-500" />
                                    <span>Vacunado: {mascota.vacunas ? 'Sí' : 'No'}</span>
                                </div>
                                <div className="flex items-center space-x-2">
                                    <FontAwesomeIcon icon={faHeartCircleCheck} className="text-orange-500" />
                                    <span>Esterilizado: {mascota.esterilizado ? 'Sí' : 'No'}</span>
                                </div>
                            </div>

                            <div className="mt-6">
                                <h3 className="text-xl font-semibold text-gray-800 mb-2"><FontAwesomeIcon icon={faPaw} className="mr-2 text-orange-500" /> Sobre {mascota.nombre}</h3>
                                <p className="text-gray-600">{mascota.descripcion}</p>
                            </div>

                            {mascota.historia && (
                                <div className="mt-4">
                                    <h3 className="text-xl font-semibold text-gray-800 mb-2"><FontAwesomeIcon icon={faHouseChimneyUser} className="mr-2 text-orange-500" /> Mi Historia</h3>
                                    <p className="text-gray-600">{mascota.historia}</p>
                                </div>
                            )}

                            {mascota.estado_salud && (
                                <div className="mt-4">
                                    <h3 className="text-xl font-semibold text-gray-800 mb-2"><FontAwesomeIcon icon={faSyringe} className="mr-2 text-orange-500" /> Salud y Cuidados</h3>
                                    <p className="text-gray-600">{mascota.estado_salud}</p>
                                </div>
                            )}

                            {tags && Array.isArray(tags) && tags.length > 0 && (
                                <div className="mt-6">
                                    <h4 className="text-xl font-semibold text-gray-800 mb-2">Características Destacadas:</h4>
                                    <div className="flex flex-wrap gap-2">
                                        {tags.map(tag => (
                                            <span key={tag} className="bg-orange-100 text-orange-800 text-sm font-medium mr-2 px-2.5 py-0.5 rounded-full">{TAG_LABELS[tag] || tag}</span>
                                        ))}
                                    </div>
                                </div>
                            )}

                            {mascota.disponible ? (
                                <div className="mt-8 bg-orange-50 p-4 rounded-lg">
                                    <h3 className="text-xl font-bold text-orange-800">¡Quiero Adoptar a {mascota.nombre}!</h3>
                                    <p className="mt-2 text-orange-700">Si estás listo para darle un hogar lleno de amor a {mascota.nombre}, haz clic en "Solicitar Adopción".</p>
                                    <button
                                        className="mt-4 w-full btn-primary btn-icon"
                                        onClick={handleAdoptClick}
                                        disabled={!mascota.disponible} // Deshabilitar si no está disponible
                                    >
                                        <FontAwesomeIcon icon={faHeartCircleCheck} className="mr-2" /> Solicitar Adopción
                                    </button>
                                    <p className="mt-2 text-xs text-center text-orange-600">¿Dudas? Visita nuestra sección <Link to="/#como-funciona" className="font-bold hover:underline">"Cómo Adoptar"</Link>.</p>
                                </div>
                            ) : (
                                <div className="mt-8 bg-green-50 p-4 rounded-lg text-center">
                                    <h3 className="text-xl font-bold text-green-800">¡Felicidades! {mascota.nombre} ya ha encontrado un hogar.</h3>
                                    <p className="mt-2 text-green-700">Hay muchas otras mascotas maravillosas esperando. <Link to="/mascotas" className="font-bold hover:underline">Explora más mascotas</Link>.</p>
                                </div>
                            )}
                        </div>
                    </div>
                </div>

                <div className="mt-6 text-center">
                    <button className="btn-outline btn-icon" onClick={() => navigate(-1)}>
                        &larr; Volver al Listado
                    </button>
                </div>
            </div>

            {suggestedPets.length > 0 && (
                <div className="mt-12 max-w-6xl mx-auto">
                    <h2 className="text-2xl font-bold text-gray-800 mb-4">También te podría interesar</h2>
                    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6">
                        {suggestedPets.map(pet => (
                            <Link to={`/mascotas/${pet.id}`} key={pet.id} className="bg-white rounded-lg shadow-lg overflow-hidden transform hover:scale-105 transition duration-300">
                                <img src={`${UPLOADS_BASE_URL}${pet.imagen_url}`} alt={pet.nombre} className="w-full h-48 object-cover"/>
                                <div className="p-4">
                                    <h3 className="text-lg font-bold text-gray-800">{pet.nombre}</h3>
                                    <p className="text-gray-600">{pet.ubicacion}</p>
                                </div>
                            </Link>
                        ))}
                    </div>
                </div>
            )}

            {showAdoptSuccessModal && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
                    <div className="bg-white p-8 rounded-lg shadow-xl max-w-md w-full text-center">
                        <h2 className="text-2xl font-bold text-gray-800 mb-4"><FontAwesomeIcon icon={faHeartCircleCheck} className="mr-2 text-green-500" /> ¡Solicitud Enviada!</h2>
                        <p className="text-gray-700 mb-4">Tu solicitud de adopción para <span className="font-semibold">{mascota.nombre}</span> ha sido enviada con éxito.</p>
                        <p className="text-gray-700 mb-6">El publicador de la mascota ha sido notificado y pronto se pondrá en contacto contigo para los siguientes pasos.</p>
                        <p className="text-gray-600 text-sm mb-6">Agradecemos tu interés en darle un hogar lleno de amor a una mascota. ¡Te deseamos mucha suerte!</p>
                        <button
                            className="btn-primary rounded-full"
                            onClick={() => setShowAdoptSuccessModal(false)}
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