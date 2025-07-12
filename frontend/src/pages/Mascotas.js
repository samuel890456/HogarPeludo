// frontend/src/pages/Mascotas.js
import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import MascotaCard from '../components/MascotaCard';
import '../styles/Mascotas.css';

const Mascotas = () => {
    const [mascotas, setMascotas] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [filters, setFilters] = useState({
        nombre: '',
        especie: '',
        raza: '',
        sexo: '',
        edadMin: '',
        edadMax: '',
    });
    const [isAuthenticated, setIsAuthenticated] = useState(false);

    useEffect(() => {
        const token = localStorage.getItem('token');
        if (token) {
            setIsAuthenticated(true);
        }

        const fetchMascotas = async () => {
            try {
                const response = await axios.get('http://localhost:5000/api/mascotas');
                setMascotas(response.data);
                setLoading(false);
            } catch (err) {
                setError('No se pudieron cargar las mascotas. Inténtalo de nuevo más tarde.');
                setLoading(false);
                console.error("Error fetching mascotas:", err);
            }
        };

        fetchMascotas();
    }, []);

    const handleFilterChange = (e) => {
        const { name, value } = e.target;
        setFilters(prevFilters => ({
            ...prevFilters,
            [name]: value
        }));
    };

    const handleClearFilters = () => {
        setFilters({
            nombre: '',
            especie: '',
            raza: '',
            sexo: '',
            edadMin: '',
            edadMax: '',
        });
    };

    if (loading) return <div className="loading-message">Cargando mascotas...</div>;
    if (error) return <div className="error-message">{error}</div>;

    const filteredMascotas = mascotas.filter(mascota => {
        const { nombre, especie, raza, sexo, edadMin, edadMax } = filters;

        const nombreMatch = nombre ? mascota.nombre.toLowerCase().includes(nombre.toLowerCase()) : true;
        const especieMatch = especie ? mascota.especie.toLowerCase() === especie.toLowerCase() : true;
        const razaMatch = raza ? mascota.raza.toLowerCase().includes(raza.toLowerCase()) : true;
        const sexoMatch = sexo ? mascota.sexo.toLowerCase() === sexo.toLowerCase() : true;
        const edadMatchMin = edadMin ? mascota.edad >= parseInt(edadMin) : true;
        const edadMatchMax = edadMax ? mascota.edad <= parseInt(edadMax) : true;

        return nombreMatch && especieMatch && razaMatch && sexoMatch && edadMatchMin && edadMatchMax;
    });

    return (
        <div className="mascotas-page">
            <div className="mascotas-header-section">
                <h1>Encuentra a tu Nuevo Compañero</h1>
                <p>Navega entre nuestros adorables animales en busca de un hogar amoroso.</p>
                {isAuthenticated && (
                    <Link to="/publicar-mascota" className="btn btn-primary publish-btn">
                        <i className="fas fa-plus-circle"></i> Publicar una Mascota
                    </Link>
                )}
            </div>

            <div className="filters-section">
                <form className="filters-form">
                    <div className="filter-group">
                        <label htmlFor="nombre">Nombre:</label>
                        <input
                            type="text"
                            id="nombre"
                            name="nombre"
                            placeholder="Buscar por nombre..."
                            value={filters.nombre}
                            onChange={handleFilterChange}
                        />
                    </div>
                    <div className="filter-group">
                        <label htmlFor="especie">Especie:</label>
                        <select
                            id="especie"
                            name="especie"
                            value={filters.especie}
                            onChange={handleFilterChange}
                        >
                            <option value="">Todas</option>
                            <option value="perro">Perro</option>
                            <option value="gato">Gato</option>
                            <option value="otro">Otro</option>
                        </select>
                    </div>
                    <div className="filter-group">
                        <label htmlFor="raza">Raza:</label>
                        <input
                            type="text"
                            id="raza"
                            name="raza"
                            placeholder="Buscar por raza..."
                            value={filters.raza}
                            onChange={handleFilterChange}
                        />
                    </div>
                    <div className="filter-group">
                        <label htmlFor="sexo">Sexo:</label>
                        <select
                            id="sexo"
                            name="sexo"
                            value={filters.sexo}
                            onChange={handleFilterChange}
                        >
                            <option value="">Cualquiera</option>
                            <option value="macho">Macho</option>
                            <option value="hembra">Hembra</option>
                        </select>
                    </div>
                    <div className="filter-group age-filters">
                        <label>Edad (años):</label>
                        <input
                            type="number"
                            placeholder="Min"
                            name="edadMin"
                            value={filters.edadMin}
                            onChange={handleFilterChange}
                            min="0"
                        />
                        <input
                            type="number"
                            placeholder="Max"
                            name="edadMax"
                            value={filters.edadMax}
                            onChange={handleFilterChange}
                            min="0"
                        />
                    </div>
                    <button type="button" className="btn btn-secondary filter-btn" onClick={handleClearFilters}>
                        Limpiar Filtros
                    </button>
                </form>
            </div>

            {filteredMascotas.length === 0 ? (
                <div className="no-mascotas-message">
                    <p>No se encontraron mascotas que coincidan con tus criterios.</p>
                    <button className="btn btn-secondary" onClick={handleClearFilters}>
                        Ver todas las mascotas
                    </button>
                </div>
            ) : (
                <div className="mascotas-grid">
                    {filteredMascotas.map(mascota => (
                        <MascotaCard key={mascota.id} mascota={mascota} />
                    ))}
                </div>
            )}
        </div>
    );
};

export default Mascotas;