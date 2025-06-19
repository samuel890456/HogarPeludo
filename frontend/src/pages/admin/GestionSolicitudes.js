import React, { useEffect, useState, useCallback, memo } from 'react';
import AdminNav from '../../components/admin/AdminNav';
import { fetchSolicitudes, aprobarSolicitud, rechazarSolicitud } from '../../api/adminApi';
import { toast } from 'react-toastify'; // For user feedback notifications
import '../../styles/GestionSolicitudes.css';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faSpinner, faCheckCircle, faTimesCircle, faExclamationTriangle, faSadTear } from '@fortawesome/free-solid-svg-icons'; // Icons for states

// --- REUSABLE COMPONENTS ---

/**
 * SolicitudCard component: Displays details of a single adoption request.
 * @param {object} props - Component props.
 * @param {object} props.solicitud - The solicitud object containing details.
 * @param {function} props.onApprove - Callback for approving the request.
 * @param {function} props.onReject - Callback for rejecting the request.
 */
const SolicitudCard = memo(({ solicitud, onApprove, onReject }) => {
    return (
        <li className="solicitud-card" key={solicitud.id}>
            <h3 className="solicitud-adoptante">
                <span className="adoptante-label">Adoptante:</span> {solicitud.adoptante_nombre}
            </h3>
            <p className="solicitud-mascota">
                <span className="mascota-label">Solicita adoptar:</span>{' '}
                <strong>{solicitud.mascota_nombre}</strong>
            </p>
            {/* Optional: Add more details if available, e.g., email, phone of adoptante */}
            {/* <p className="solicitud-contact">Email: {solicitud.adoptante_email}</p> */}

            <div className="solicitud-buttons">
                <button
                    className="btn btn-aprobar" // Use 'btn' as base class
                    onClick={() => onApprove(solicitud.id)}
                    aria-label={`Aprobar solicitud de ${solicitud.adoptante_nombre} para ${solicitud.mascota_nombre}`}
                >
                    <FontAwesomeIcon icon={faCheckCircle} /> Aprobar
                </button>
                <button
                    className="btn btn-rechazar" // Use 'btn' as base class
                    onClick={() => onReject(solicitud.id)}
                    aria-label={`Rechazar solicitud de ${solicitud.adoptante_nombre} para ${solicitud.mascota_nombre}`}
                >
                    <FontAwesomeIcon icon={faTimesCircle} /> Rechazar
                </button>
            </div>
        </li>
    );
});

// --- CUSTOM HOOK FOR DATA LOGIC ---

/**
 * useSolicitudes custom hook: Handles fetching, state, and actions for adoption requests.
 */
const useSolicitudes = () => {
    const [solicitudes, setSolicitudes] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    const loadSolicitudes = useCallback(async () => {
        setLoading(true);
        setError(null); // Clear previous errors
        try {
            const data = await fetchSolicitudes();
            setSolicitudes(data);
        } catch (err) {
            console.error('Error al cargar solicitudes:', err);
            setError('No se pudieron cargar las solicitudes. Por favor, intenta de nuevo.');
            toast.error('Error al cargar solicitudes.'); // User-friendly error notification
        } finally {
            setLoading(false);
        }
    }, []); // No dependencies, memoizes the function

    useEffect(() => {
        loadSolicitudes(); // Initial data fetch
    }, [loadSolicitudes]); // Dependency on loadSolicitudes (memoized by useCallback)

    const handleAprobar = useCallback(async (id) => {
        try {
            await aprobarSolicitud(id);
            setSolicitudes(prevSolicitudes => prevSolicitudes.filter(s => s.id !== id));
            toast.success('Solicitud aprobada con éxito.'); // Success notification
        } catch (err) {
            console.error('Error al aprobar solicitud:', err);
            toast.error('Error al aprobar la solicitud.'); // Error notification
        }
    }, []); // No dependencies, memoizes the function

    const handleRechazar = useCallback(async (id) => {
        try {
            await rechazarSolicitud(id);
            setSolicitudes(prevSolicitudes => prevSolicitudes.filter(s => s.id !== id));
            toast.info('Solicitud rechazada.'); // Info notification
        } catch (err) {
            console.error('Error al rechazar solicitud:', err);
            toast.error('Error al rechazar la solicitud.'); // Error notification
        }
    }, []); // No dependencies, memoizes the function

    return {
        solicitudes,
        loading,
        error,
        handleAprobar,
        handleRechazar,
        loadSolicitudes // Expose reload function for retry button
    };
};

// --- MAIN COMPONENT ---

const GestionSolicitudes = () => {
    // Consume the custom hook
    const { solicitudes, loading, error, handleAprobar, handleRechazar, loadSolicitudes } = useSolicitudes();

    // Conditional rendering based on loading, error, and data presence
    const renderContent = () => {
        if (loading) {
            return (
                <div className="loading-state">
                    <FontAwesomeIcon icon={faSpinner} spin size="3x" />
                    <p>Cargando solicitudes...</p>
                </div>
            );
        }

        if (error) {
            return (
                <div className="error-state">
                    <FontAwesomeIcon icon={faExclamationTriangle} size="2x" />
                    <p>{error}</p>
                    <button onClick={loadSolicitudes} className="btn btn-retry">
                        Reintentar
                    </button>
                </div>
            );
        }

        if (solicitudes.length === 0) {
            return (
                <div className="no-data-state">
                    <FontAwesomeIcon icon={faSadTear} size="3x" />
                    <p>No hay solicitudes pendientes en este momento.</p>
                </div>
            );
        }

        return (
            <ul className="solicitud-list">
                {solicitudes.map(solicitud => (
                    <SolicitudCard
                        key={solicitud.id}
                        solicitud={solicitud}
                        onApprove={handleAprobar}
                        onReject={handleRechazar}
                    />
                ))}
            </ul>
        );
    };

    return (
        <div>
            <AdminNav />
            <div className="gestion-solicitudes-container">
                <h1>Gestión de Solicitudes de Adopción</h1>
                {renderContent()}
            </div>
        </div>
    );
};

export default GestionSolicitudes;