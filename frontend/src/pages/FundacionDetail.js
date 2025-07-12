import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { getFundacionById } from '../api/api';
import LoadingSpinner from '../components/LoadingSpinner';
import '../styles/FundacionDetail.css';

const FundacionDetail = () => {
    const { id } = useParams();
    const [fundacion, setFundacion] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchFundacion = async () => {
            try {
                setLoading(true);
                const response = await getFundacionById(id);
                setFundacion(response.data);
            } catch (err) {
                console.error('Error fetching fundacion:', err);
                setError('No se pudo cargar la información de la fundación.');
            } finally {
                setLoading(false);
            }
        };

        fetchFundacion();
    }, [id]);

    if (loading) {
        return <LoadingSpinner message="Cargando detalles de la fundación..." />;
    }

    if (error) {
        return <div className="error-message">{error}</div>;
    }

    if (!fundacion) {
        return <div className="not-found-message">Lo sentimos, esta fundación no fue encontrada.</div>;
    }

    return (
        <div className="fundacion-detail-container">
            <div className="fundacion-header">
                <img src={fundacion.logo_url} alt={fundacion.nombre} />
                <h1>{fundacion.nombre}</h1>
            </div>
            <div className="fundacion-content">
                <p>{fundacion.descripcion}</p>
                <p><strong>Email:</strong> {fundacion.email}</p>
                <p><strong>Teléfono:</strong> {fundacion.telefono}</p>
                <p><strong>Dirección:</strong> {fundacion.direccion}</p>
                <p><strong>Sitio Web:</strong> <a href={fundacion.sitio_web} target="_blank" rel="noopener noreferrer">{fundacion.sitio_web}</a></p>
            </div>
        </div>
    );
};

export default FundacionDetail;
