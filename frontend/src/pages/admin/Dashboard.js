//frontend/src/pages/admin/Dashboard.js
import React, { useEffect, useState } from 'react';
import AdminNav from '../../components/admin/AdminNav';
import { fetchResumen } from '../../api/adminApi';
import '../../styles/Dashboard.css';

const Dashboard = () => {
    const [resumen, setResumen] = useState({ totalMascotas: 0, totalSolicitudes: 0, totalUsuarios: 0 });

    useEffect(() => {
        fetchResumen().then(setResumen).catch(console.error);
    }, []);

    return (
        <div>
            <AdminNav />
            <div className="dashboard">
                <h1>Panel de Administración</h1>
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
            </div>
        </div>
    );
};

export default Dashboard;
