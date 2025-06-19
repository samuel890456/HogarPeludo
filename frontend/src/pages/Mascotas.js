// frontend/src/pages/Mascotas.js
import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import MascotaCard from '../components/MascotaCard'; // Tu componente de tarjeta
import '../styles/Mascotas.css'; // Crearemos/actualizaremos este archivo CSS
// Importar componentes de formulario si PublicarMascota es un componente separado
import PublicarMascota from './PublicarMascota';

const Mascotas = () => {
    const [mascotas, setMascotas] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [filtroNombre, setFiltroNombre] = useState('');
    const [filtroEspecie, setFiltroEspecie] = useState('');
    const [filtroRaza, setFiltroRaza] = useState('');
    const [filtroSexo, setFiltroSexo] = useState('');
    const [filtroEdadMin, setFiltroEdadMin] = useState('');
    const [filtroEdadMax, setFiltroEdadMax] = useState('');
    const [isAuthenticated, setIsAuthenticated] = useState(false); // Para mostrar botón de publicación

    useEffect(() => {
        // Verificar autenticación (similar a como lo haces en App.js)
        const token = localStorage.getItem('token');
        if (token) {
            setIsAuthenticated(true);
        }

        const fetchMascotas = async () => {
            try {
                // Aquí necesitarías una API real para obtener las mascotas
                // Por ahora, usamos un placeholder o datos de prueba
                const response = await axios.get('http://localhost:5000/api/mascotas'); // Ajusta tu endpoint API
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

    const handleSearch = (e) => {
        e.preventDefault();
        // Implementar la lógica de búsqueda aquí, quizás refetching de la API con parámetros
        // o filtrado en el cliente si el dataset es pequeño.
        console.log('Filtros aplicados:', {
            filtroNombre, filtroEspecie, filtroRaza, filtroSexo, filtroEdadMin, filtroEdadMax
        });
        // Aquí podrías refetch de la API con los query params
        // O si ya tienes todas las mascotas, filtra en el cliente:
        // const filtered = mascotas.filter(...)
        // setMascotas(filtered); // Si filtras en cliente
    };

    if (loading) return <div className="loading-message">Cargando mascotas...</div>;
    if (error) return <div className="error-message">{error}</div>;

    const filteredMascotas = mascotas.filter(mascota => {
        // Lógica de filtrado de ejemplo (adapta según tus datos y necesidades)
        const nombreMatch = filtroNombre ? mascota.nombre.toLowerCase().includes(filtroNombre.toLowerCase()) : true;
        const especieMatch = filtroEspecie ? mascota.especie.toLowerCase() === filtroEspecie.toLowerCase() : true;
        const razaMatch = filtroRaza ? mascota.raza.toLowerCase().includes(filtroRaza.toLowerCase()) : true;
        const sexoMatch = filtroSexo ? mascota.sexo.toLowerCase() === filtroSexo.toLowerCase() : true;
        const edadMatchMin = filtroEdadMin ? mascota.edad >= parseInt(filtroEdadMin) : true;
        const edadMatchMax = filtroEdadMax ? mascota.edad <= parseInt(filtroEdadMax) : true;

        return nombreMatch && especieMatch && razaMatch && sexoMatch && edadMatchMin && edadMatchMax;
    });


    return (
        <div className="mascotas-page">
            <div className="mascotas-header-section">
                <h1>Encuentra a tu Nuevo Compañero</h1>
                <p>Navega entre nuestros adorables animales en busca de un hogar amoroso.</p>
                {isAuthenticated && (
                    <Link to="/publicar-mascota" className="btn-primary publish-btn">
                        <i className="fas fa-plus-circle"></i> Publicar una Mascota
                    </Link>
                )}
            </div>

            <div className="filters-section">
                <form onSubmit={handleSearch} className="filters-form">
                    <div className="filter-group">
                        <label htmlFor="nombre">Nombre:</label>
                        <input
                            type="text"
                            id="nombre"
                            placeholder="Buscar por nombre..."
                            value={filtroNombre}
                            onChange={(e) => setFiltroNombre(e.target.value)}
                        />
                    </div>
                    <div className="filter-group">
                        <label htmlFor="especie">Especie:</label>
                        <select
                            id="especie"
                            value={filtroEspecie}
                            onChange={(e) => setFiltroEspecie(e.target.value)}
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
                            placeholder="Buscar por raza..."
                            value={filtroRaza}
                            onChange={(e) => setFiltroRaza(e.target.value)}
                        />
                    </div>
                    <div className="filter-group">
                        <label htmlFor="sexo">Sexo:</label>
                        <select
                            id="sexo"
                            value={filtroSexo}
                            onChange={(e) => setFiltroSexo(e.target.value)}
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
                            value={filtroEdadMin}
                            onChange={(e) => setFiltroEdadMin(e.target.value)}
                            min="0"
                        />
                        <input
                            type="number"
                            placeholder="Max"
                            value={filtroEdadMax}
                            onChange={(e) => setFiltroEdadMax(e.target.value)}
                            min="0"
                        />
                    </div>
                    <button type="submit" className="btn-secondary filter-btn">
                        <i className="fas fa-filter"></i> Aplicar Filtros
                    </button>
                    <button type="button" className="btn-clear-filters" onClick={() => {
                        setFiltroNombre(''); setFiltroEspecie(''); setFiltroRaza('');
                        setFiltroSexo(''); setFiltroEdadMin(''); setFiltroEdadMax('');
                        // Opcional: refetch de todas las mascotas aquí
                    }}>
                        Limpiar Filtros
                    </button>
                </form>
            </div>

            {filteredMascotas.length === 0 ? (
                <div className="no-mascotas-message">
                    <p>No se encontraron mascotas que coincidan con tus criterios.</p>
                    <button className="btn-secondary" onClick={() => {
                        setFiltroNombre(''); setFiltroEspecie(''); setFiltroRaza('');
                        setFiltroSexo(''); setFiltroEdadMin(''); setFiltroEdadMax('');
                        // Aquí deberías re-cargar todas las mascotas si filtras en cliente
                        // o simplemente el usuario ya limpió los filtros con el botón de limpiar
                    }}>Ver todas las mascotas</button>
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