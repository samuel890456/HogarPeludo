import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { getFundacionById } from '../api/api';
import LoadingSpinner from '../components/LoadingSpinner';
import ErrorMessage from '../components/ErrorMessage';

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
                setFundacion(response);
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
        return <ErrorMessage message={error} />;
    }

    if (!fundacion) {
        return <div className="text-center text-lg text-gray-600 py-8">Lo sentimos, esta fundación no fue encontrada.</div>;
    }

    return (
        <div className="container mx-auto p-4 bg-gray-100 min-h-screen">
            <div className="bg-white rounded-lg shadow-lg p-6 mb-6 text-center">
                <img src={fundacion.logo_url || '/paw-icon.png'} alt={fundacion.nombre} className="w-32 h-32 object-cover rounded-full mx-auto mb-4 border-2 border-orange-300" />
                <h1 className="text-4xl font-bold text-gray-800 mb-2">{fundacion.nombre}</h1>
            </div>
            <div className="bg-white rounded-lg shadow-lg p-6">
                <p className="text-gray-700 mb-4">{fundacion.descripcion}</p>
                <p className="text-gray-700 mb-2"><strong>Email:</strong> {fundacion.email}</p>
                <p className="text-gray-700 mb-2"><strong>Teléfono:</strong> {fundacion.telefono}</p>
                <p className="text-gray-700 mb-2"><strong>Dirección:</strong> {fundacion.direccion}</p>
                <p className="text-gray-700 mb-2"><strong>Sitio Web:</strong> <a href={fundacion.sitio_web} target="_blank" rel="noopener noreferrer" className="text-blue-500 hover:underline">{fundacion.sitio_web}</a></p>
            </div>
        </div>
    );
};

export default FundacionDetail;