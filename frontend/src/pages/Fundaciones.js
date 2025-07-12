import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { getFundaciones } from '../api/api';
import '../styles/Fundaciones.css';
import LoadingSpinner from '../components/LoadingSpinner';
import ErrorMessage from '../components/ErrorMessage';

const Fundaciones = () => {
    const [fundaciones, setFundaciones] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchFundaciones = async () => {
            try {
                setLoading(true);
                const response = await getFundaciones();
                // Asegurarse de que response.data sea un array
                if (Array.isArray(response)) {
                    setFundaciones(response);
                } else if (response && Array.isArray(response.data)) {
                    setFundaciones(response.data);
                } else {
                    setFundaciones([]); // Si no es un array, establecer como vacío
                    console.warn("La respuesta de la API de fundaciones no es un array:", response);
                }
            } catch (err) {
                console.error('Error fetching fundaciones:', err);
                setError('No se pudieron cargar las fundaciones. Inténtalo de nuevo más tarde.');
            } finally {
                setLoading(false);
            }
        };

        fetchFundaciones();
    }, []);

    if (loading) {
        return <LoadingSpinner message="Cargando fundaciones..." />;
    }

    if (error) {
        return <ErrorMessage message={error} />;
    }

    return (
        <div className="fundaciones-container">
            <h1>Fundaciones</h1>
            <div className="fundaciones-list">
                {fundaciones.length === 0 ? (
                    <p className="no-fundaciones-message">No hay fundaciones registradas en este momento.</p>
                ) : (
                    fundaciones.map((fundacion) => (
                        <div key={fundacion.id} className="fundacion-card">
                            <img src={fundacion.logo_url} alt={fundacion.nombre} />
                            <h2>{fundacion.nombre}</h2>
                            <p>{fundacion.descripcion}</p>
                            <Link to={`/fundaciones/${fundacion.id}`} className="btn btn-outline-primary">Ver Perfil</Link>
                        </div>
                    ))
                )}
            </div>
        </div>
    );
};

export default Fundaciones;
