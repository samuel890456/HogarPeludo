import React, { useEffect, useState, useMemo, useCallback } from 'react';
import AdminNav from '../../components/admin/AdminNav';
import { fetchResumen } from '../../api/adminApi'; 
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import '../../styles/Dashboard.css';
import { Bar } from 'react-chartjs-2'; // Moved to top
import { Chart, BarElement, CategoryScale, LinearScale, Tooltip, Legend } from 'chart.js'; // Moved to top
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faDog, faCat, faPaw, faCrow } from '@fortawesome/free-solid-svg-icons';

Chart.register(BarElement, CategoryScale, LinearScale, Tooltip, Legend); // This line stays where it is, as it's not an import.



// --- NUEVOS COMPONENTES REUTILIZABLES ---

// Componente para las tarjetas de resumen
const DashboardCard = ({ title, value, description, className, onClick }) => (
    <div className={`card ${className}`} onClick={onClick} role="button" tabIndex={0}>
        <h2>{value}</h2>
        <p>{description}</p>
        {onClick && <button className="card-button">{title}</button>}
    </div>
);

// Componente para las tablas de dashboard
const DashboardTable = ({ title, headers, data, renderRow, infoText }) => (
    <div className="dashboard-table-container">
        <h3>
            {title}{' '}
            {infoText && (
                <span title={infoText} style={{ fontSize: '1rem', color: '#888', cursor: 'help' }}>
                    🛈
                </span>
            )}
        </h3>
        {data && data.length > 0 ? (
            <div className="dashboard-ranking-card"> {/* Reutilizamos la clase para estilos de tabla */}
                <table className="dashboard-table">
                    <thead>
                        <tr>
                            {headers.map(header => (
                                <th key={header}>{header}</th>
                            ))}
                        </tr>
                    </thead>
                    <tbody>
                        {data.map(renderRow)}
                    </tbody>
                </table>
            </div>
        ) : (
            <p className="no-data-message">No hay datos disponibles para mostrar en esta tabla.</p>
        )}
    </div>
);

// --- UTILIDADES ---

// Función para mapear especie a icono (se mantiene igual, podría ser un util)
const getEspecieIcon = especie => {
    if (especie.toLowerCase().includes('perro')) return faDog;
    if (especie.toLowerCase().includes('gato')) return faCat;
    if (especie.toLowerCase().includes('ave')) return faCrow;
    return faPaw;
};

// Función para hacer fetch con token de autorización
// Esto es una simplificación; idealmente, tu `api.js` ya manejaría esto.
const fetchWithAuth = async (url) => {
    const token = localStorage.getItem('token');
    const response = await fetch(url, {
        headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json' // Generalmente útil
        }
    });
    if (!response.ok) {
        // Mejorar el manejo de errores de la API
        const errorData = await response.json().catch(() => ({ message: 'Error desconocido' }));
        throw new Error(errorData.message || `Error al cargar ${url.split('/').pop().replace(/-/g, ' ')}`);
    }
    return response.json();
};

// --- HOOK PERSONALIZADO PARA GESTIONAR LA LÓGICA DE DATOS ---
const useDashboardData = () => {
    const [resumen, setResumen] = useState({ totalMascotas: 0, totalSolicitudes: 0, totalUsuarios: 0 });
    const [mascotasPorEspecie, setMascotasPorEspecie] = useState([]);
    const [rankingAdopciones, setRankingAdopciones] = useState([]);
    const [adopcionesPorMes, setAdopcionesPorMes] = useState([]);
    const [topMascotas, setTopMascotas] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const loadAllDashboardData = async () => {
            setLoading(true);
            setError(null);
            try {
                // Fetch principal de resumen (asumiendo que ya está en adminApi.js)
                const resumenData = await fetchResumen();
                setResumen(resumenData);

                // Fetch de datos detallados con Promise.all para cargarlos en paralelo
                const [
                    mascotasData,
                    rankingData,
                    adopcionesMesData,
                    topMascotasData
                ] = await Promise.all([
                    fetchWithAuth('http://localhost:5000/admin/mascotas'),
                    fetchWithAuth('http://localhost:5000/admin/ranking-adopciones'),
                    fetchWithAuth('http://localhost:5000/admin/adopciones-por-mes'),
                    fetchWithAuth('http://localhost:5000/admin/top-mascotas-populares')
                ]);

                // Procesamiento de datos de mascotas por especie
                const conteoEspecie = {};
                mascotasData.forEach(m => {
                    conteoEspecie[m.especie] = (conteoEspecie[m.especie] || 0) + 1;
                });
                setMascotasPorEspecie(Object.entries(conteoEspecie).map(([especie, total]) => ({ especie, total })));

                setRankingAdopciones(rankingData);
                setAdopcionesPorMes(adopcionesMesData);
                setTopMascotas(topMascotasData);

            } catch (err) {
                console.error("Error al cargar datos del dashboard:", err);
                setError(err.message || "Ocurrió un error al cargar los datos del dashboard.");
                toast.error(err.message || "Error al cargar datos del dashboard.");
            } finally {
                setLoading(false);
            }
        };

        loadAllDashboardData();
    }, []); // Se ejecuta una sola vez al montar el componente

    // Cálculo del porcentaje de adopción, ahora es una memoized value
    const porcentajeAdopcion = useMemo(() => {
        if (resumen.totalMascotas === 0) return 0;
        // Asumo que totalSolicitudes son solicitudes pendientes, no adopciones completadas.
        // Si totalSolicitudes fueran adopciones exitosas, la fórmula sería diferente.
        // Si quieres el porcentaje de 'Mascotas Publicadas' que *no* tienen solicitudes pendientes,
        // o porcentaje de 'adopciones exitosas' sobre 'mascotas publicadas', deberías aclararlo.
        // Por ahora, mantengo tu lógica original (mascotas publicadas - solicitudes pendientes) / total mascotas
        return Math.round((resumen.totalMascotas - resumen.totalSolicitudes) / resumen.totalMascotas * 100);
    }, [resumen.totalMascotas, resumen.totalSolicitudes]);

    return {
        resumen,
        mascotasPorEspecie,
        rankingAdopciones,
        adopcionesPorMes,
        topMascotas,
        loading,
        error,
        porcentajeAdopcion
    };
};

// --- COMPONENTE PRINCIPAL Dashboard ---
const Dashboard = () => {
    const navigate = useNavigate();
    const {
        resumen,
        mascotasPorEspecie,
        rankingAdopciones,
        adopcionesPorMes,
        topMascotas,
        loading,
        error,
        porcentajeAdopcion
    } = useDashboardData(); // Usamos el hook personalizado

    // Datos para Chart.js - memoizados para evitar recálculos innecesarios
    const chartDataMascotas = useMemo(() => ({
        labels: mascotasPorEspecie.map(e => e.especie),
        datasets: [
            {
                label: 'Mascotas por especie',
                data: mascotasPorEspecie.map(e => e.total),
                backgroundColor: '#1976d2',
            }
        ]
    }), [mascotasPorEspecie]);

    const chartOptions = useMemo(() => ({
        responsive: true,
        plugins: {
            legend: { display: false },
            tooltip: { enabled: true }
        },
        maintainAspectRatio: false, // Permite controlar el tamaño del gráfico con el CSS del div padre
    }), []);

    const chartDataAdopcionesMes = useMemo(() => ({
        labels: adopcionesPorMes.map(e => e.mes),
        datasets: [
            {
                label: 'Adopciones por mes',
                data: adopcionesPorMes.map(e => e.total),
                fill: false,
                borderColor: '#ff9800',
                backgroundColor: '#ff9800',
                tension: 0.2,
            }
        ]
    }), [adopcionesPorMes]);

    const chartOptionsAdopcionesMes = useMemo(() => ({
        responsive: true,
        plugins: {
            legend: { display: true }, // Generalmente, en un gráfico de líneas, la leyenda es útil
            tooltip: { enabled: true }
        },
        maintainAspectRatio: false,
    }), []);

    return (
        <div>
            <AdminNav />
            <div className="dashboard">
                <h1>Panel de Administración</h1>

                {loading && <div className="dashboard-loading">Cargando resumen del sistema...</div>}
                {error && <p className="error-message">{error}</p>}

                {!loading && !error && (
                    <>
                        {/* Tarjetas de Resumen */}
                        <div className="dashboard-cards">
                            <DashboardCard
                                title="Gestionar Mascotas"
                                value={resumen.totalMascotas}
                                description="Mascotas Publicadas"
                                className="card-mascotas"
                                onClick={() => navigate('/admin/mascotas')}
                            />
                            <DashboardCard
                                title="Gestionar Solicitudes"
                                value={resumen.totalSolicitudes}
                                description="Solicitudes Pendientes"
                                className="card-solicitudes"
                                onClick={() => navigate('/admin/solicitudes')}
                            />
                            <DashboardCard
                                title="Gestionar Usuarios"
                                value={resumen.totalUsuarios}
                                description="Usuarios Registrados"
                                className="card-usuarios"
                                onClick={() => navigate('/admin/usuarios')}
                            />
                            <DashboardCard
                                title="Tasa de Adopción" // Este título es más descriptivo para la tarjeta
                                value={`${porcentajeAdopcion}%`}
                                description="Porcentaje de Adopción Estimado"
                                className="card-adopcion"
                                // No hay navegación para este, solo muestra información
                            />
                        </div>

                        {/* Gráficos */}
                        <div className="dashboard-charts-grid">
                            <div className="chart-card">
                                <h3>Mascotas por Especie</h3>
                                <div className="chart-container">
                                    <Bar data={chartDataMascotas} options={chartOptions} />
                                </div>
                            </div>
                            <div className="chart-card">
                                <DashboardTable
                                    title="Adopciones por Especie"
                                    infoText="Cantidad de adopciones exitosas por especie (basado en solicitudes resueltas)"
                                    headers={['Especie', 'Adopciones']}
                                    data={rankingAdopciones}
                                    renderRow={row => (
                                        <tr key={row.especie}>
                                            <td>
                                                <FontAwesomeIcon icon={getEspecieIcon(row.especie)} style={{ marginRight: 8, color: '#1976d2' }} />
                                                {row.especie}
                                            </td>
                                            <td>
                                                <span className="adopciones-badge" title="Total de adopciones">{row.total}</span>
                                            </td>
                                        </tr>
                                    )}
                                />
                            </div>
                            <div className="chart-card full-width">
                                <h3>Evolución de Adopciones por Mes</h3>
                                <div className="chart-container">
                                    <Bar data={chartDataAdopcionesMes} options={chartOptionsAdopcionesMes} />
                                </div>
                            </div>
                            <div className="chart-card full-width">
                                <DashboardTable
                                    title="Mascotas Más Populares"
                                    infoText="Mascotas con la mayor cantidad de solicitudes de adopción"
                                    headers={['Nombre', 'Especie', 'Solicitudes']}
                                    data={topMascotas}
                                    renderRow={m => (
                                        <tr key={m.id}>
                                            <td>{m.nombre}</td>
                                            <td>{m.especie}</td>
                                            <td>{m.solicitudes}</td>
                                        </tr>
                                    )}
                                />
                            </div>
                        </div>
                    </>
                )}
            </div>
        </div>
    );
};

export default Dashboard;