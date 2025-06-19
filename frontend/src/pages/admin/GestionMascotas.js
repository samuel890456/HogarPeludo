// frontend/src/pages/GestionMascotas.js
import React, { useEffect, useState } from 'react';
import AdminNav from '../../components/admin/AdminNav';
import { fetchMascotas, eliminarMascota } from '../../api/adminApi';
import { toast } from 'react-toastify';

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { 
    faDog, faCat, faPaw, faVenus, faMars, faCalendarAlt, 
    faMapMarkerAlt, faWeight, faExpandArrowsAlt, faPalette, 
    faHeartCircleCheck, faTrash,  faSearch, faFilter
} from '@fortawesome/free-solid-svg-icons';

import '../../styles/GestionMascotas.css';

// URL base para las imágenes
const UPLOADS_BASE_URL = 'http://localhost:5000/uploads/';

// Mapeo de valores de tags a etiquetas legibles (puedes unificarlo si ya lo tienes en otro lado)
const TAG_LABELS = {
    amigable_ninos: 'Amigable con niños',
    compatible_perros: 'Compatible con perros',
    patio_grande: 'Patio grande',
    entrenado_bano: 'Baño entrenado',
    energia_alta: 'Energía alta',
    jugueton: 'Juguetón',
    tranquilo: 'Tranquilo',
    requiere_medicacion: 'Requiere medicación',
};

const GestionMascotas = () => {
    const [mascotas, setMascotas] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    // Filtros y búsqueda
    const [filtroEspecie, setFiltroEspecie] = useState('');
    const [filtroEstado, setFiltroEstado] = useState('');
    const [filtroTamano, setFiltroTamano] = useState('');
    const [filtroSexo, setFiltroSexo] = useState(''); // Nuevo filtro de sexo
    const [busqueda, setBusqueda] = useState('');

    useEffect(() => {
        const cargarMascotas = async () => {
            try {
                const data = await fetchMascotas();
                // Asegúrate de parsear los tags si vienen como string JSON
                const mascotasParsed = data.map(mascota => ({
                    ...mascota,
                    tags: mascota.tags ? JSON.parse(mascota.tags) : []
                }));
                setMascotas(mascotasParsed);
            } catch (err) {
                setError('Error al cargar las mascotas: ' + err.message);
            } finally {
                setLoading(false);
            }
        };
        cargarMascotas();
    }, []);

    const handleEliminar = async (id) => {
        if (window.confirm('¿Estás seguro de que quieres eliminar esta mascota? Esta acción es irreversible.')) {
            try {
                await eliminarMascota(id);
                setMascotas(mascotas.filter(m => m.id !== id));
                toast.success('Mascota eliminada con éxito.');
            } catch (err) {
                toast.error('Error al eliminar la mascota: ' + (err.response?.data?.error || err.message));
            }
        }
    };

    // Filtrado y búsqueda avanzada
    const mascotasFiltradas = mascotas.filter(m => {
        const matchesEspecie = !filtroEspecie || m.especie === filtroEspecie;
        const matchesEstado = !filtroEstado || (filtroEstado === 'disponible' ? m.disponible : !m.disponible);
        const matchesTamano = !filtroTamano || m.tamano === filtroTamano;
        const matchesSexo = !filtroSexo || m.sexo === filtroSexo; // Aplica filtro de sexo

        const searchLower = busqueda.toLowerCase();
        const matchesBusqueda = !busqueda ||
                                m.nombre.toLowerCase().includes(searchLower) ||
                                (m.raza && m.raza.toLowerCase().includes(searchLower)) ||
                                (m.ubicacion && m.ubicacion.toLowerCase().includes(searchLower)); // Añadir búsqueda por ubicación

        return matchesEspecie && matchesEstado && matchesTamano && matchesSexo && matchesBusqueda;
    });

    if (loading) {
        return (
            <div className="gestion-mascotas">
                <AdminNav />
                <div className="loading-message-admin">Cargando mascotas...</div>
            </div>
        );
    }

    if (error) {
        return (
            <div className="gestion-mascotas">
                <AdminNav />
                <div className="error-message-admin">Error: {error}</div>
            </div>
        );
    }

    return (
        <div className="gestion-mascotas">
            <AdminNav />
            <h1 className="gestion-title">Gestión de Publicaciones de Mascotas</h1>

            {/* Sección de Filtros y Búsqueda */}
            <div className="filtros-container">
                <div className="search-bar">
                    <FontAwesomeIcon icon={faSearch} className="search-icon" />
                    <input
                        type="text"
                        placeholder="Buscar por nombre, raza o ubicación..."
                        value={busqueda}
                        onChange={e => setBusqueda(e.target.value)}
                        aria-label="Buscar mascotas"
                    />
                </div>

                <div className="filter-options">
                    <div className="filter-group">
                        <label htmlFor="especie-filter"><FontAwesomeIcon icon={faPaw} /> Especie:</label>
                        <select id="especie-filter" value={filtroEspecie} onChange={e => setFiltroEspecie(e.target.value)}>
                            <option value="">Todas</option>
                            <option value="Perro">Perro</option>
                            <option value="Gato">Gato</option>
                            <option value="Ave">Ave</option>
                            <option value="Roedor">Roedor</option>
                            <option value="Otro">Otro</option>
                        </select>
                    </div>

                    <div className="filter-group">
                        <label htmlFor="estado-filter"><FontAwesomeIcon icon={faHeartCircleCheck} /> Estado:</label>
                        <select id="estado-filter" value={filtroEstado} onChange={e => setFiltroEstado(e.target.value)}>
                            <option value="">Todos</option>
                            <option value="disponible">Disponible</option>
                            <option value="adoptado">Adoptado</option>
                        </select>
                    </div>

                    <div className="filter-group">
                        <label htmlFor="sexo-filter"><FontAwesomeIcon icon={faVenus} />/<FontAwesomeIcon icon={faMars} /> Sexo:</label>
                        <select id="sexo-filter" value={filtroSexo} onChange={e => setFiltroSexo(e.target.value)}>
                            <option value="">Todos</option>
                            <option value="Macho">Macho</option>
                            <option value="Hembra">Hembra</option>
                        </select>
                    </div>

                    <div className="filter-group">
                        <label htmlFor="tamano-filter"><FontAwesomeIcon icon={faExpandArrowsAlt} /> Tamaño:</label>
                        <select id="tamano-filter" value={filtroTamano} onChange={e => setFiltroTamano(e.target.value)}>
                            <option value="">Todos</option>
                            <option value="Pequeño">Pequeño</option>
                            <option value="Mediano">Mediano</option>
                            <option value="Grande">Grande</option>
                        </select>
                    </div>
                </div>
            </div> {/* Fin de filtros-container */}

            {mascotasFiltradas.length === 0 ? (
                <p className="no-results-message">No se encontraron mascotas que coincidan con los filtros.</p>
            ) : (
                <div className="mascota-grid">
                    {mascotasFiltradas.map(mascota => (
                        <div className="admin-mascota-card" key={mascota.id}>
                            <div className="card-image-wrapper">
                                <img 
                                    src={mascota.imagen_url ? `${UPLOADS_BASE_URL}${mascota.imagen_url}` : '/paw-icon.png'} 
                                    alt={mascota.nombre} 
                                    className="card-mascota-imagen" 
                                    onError={(e) => { e.target.onerror = null; e.target.src = '/paw-icon.png'; }}
                                />
                                <span className={`card-status ${mascota.disponible ? 'available' : 'adopted'}`}>
                                    {mascota.disponible ? 'Disponible' : 'Adoptado'}
                                </span>
                            </div>
                            <div className="card-content">
                                <h3 className="card-title">{mascota.nombre}</h3>
                                <p className="card-info"><FontAwesomeIcon icon={faPaw} /> **Especie:** {mascota.especie} {mascota.raza && `(${mascota.raza})`}</p>
                                <p className="card-info"><FontAwesomeIcon icon={faCalendarAlt} /> **Edad:** {mascota.edad} años</p>
                                <p className="card-info"><FontAwesomeIcon icon={mascota.sexo === 'Macho' ? faMars : faVenus} /> **Sexo:** {mascota.sexo}</p>
                                <p className="card-info"><FontAwesomeIcon icon={faMapMarkerAlt} /> **Ubicación:** {mascota.ubicacion}</p>
                                <p className="card-info"><FontAwesomeIcon icon={faExpandArrowsAlt} /> **Tamaño:** {mascota.tamano || 'N/A'}</p>
                                {/* Puedes añadir más detalles relevantes para la gestión aquí */}
                                
                                {mascota.tags && mascota.tags.length > 0 && (
                                    <div className="card-tags">
                                        <h4>Características:</h4>
                                        <div className="tag-list">
                                            {mascota.tags.map(tag => (
                                                <span key={tag} className="tag-badge">{TAG_LABELS[tag] || tag}</span>
                                            ))}
                                        </div>
                                    </div>
                                )}

                                <div className="card-actions">
                                    
                                    <button onClick={() => handleEliminar(mascota.id)} className="btn-eliminar-admin">
                                        <FontAwesomeIcon icon={faTrash} /> Eliminar
                                    </button>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
};

export default GestionMascotas;