//frontend/src/pages/admin/Dashboard.js
import React, { useEffect, useState } from 'react';
import AdminNav from '../../components/admin/AdminNav';
import { fetchResumen } from '../../api/adminApi';
import '../../styles/Dashboard.css';

const Dashboard = () => {
    const [resumen, setResumen] = useState({ totalMascotas: 0, totalSolicitudes: 0, totalUsuarios: 0 });
    const [error, setError] = useState(null); // Nuevo estado para manejar errores

    useEffect(() => {
        const getDashboardResumen = async () => { // Función asíncrona para manejar el fetch
            try {
                const data = await fetchResumen();
                setResumen(data);
            } catch (err) {
                console.error("Error al cargar el resumen:", err);
                setError("No se pudo cargar el resumen del dashboard. Intenta de nuevo más tarde.");
            }
        };
        getDashboardResumen(); // Llama a la función
    }, []); // El array vacío asegura que se ejecute solo una vez al montar el componente

    return (
        <div>
            <AdminNav />
            <div className="dashboard">
                <h1>Panel de Administración</h1>
                {error ? ( // Muestra un mensaje de error si existe
                    <p className="error-message">{error}</p>
                ) : (
                    <div className="dashboard-cards">
                        <div className="card">
                            <h2>{resumen.totalMascotas}</h2>
                            <p>Mascotas Publicadas</p>
                        </div>
                        <div className="card">
                            <h2>{resumen.totalSolicitudes}</h2>
                            <p>Solicitudes Pendientes</p>
                        </div>
                        <div className="card">
                            <h2>{resumen.totalUsuarios}</h2>
                            <p>Usuarios Registrados</p>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};

export default Dashboard;