// src/components/RutaPrivada.js
import React from 'react';
import { Navigate } from 'react-router-dom';

const RutaPrivada = ({ children, rolRequerido }) => {
    const token = localStorage.getItem('token');
    const rol_id = parseInt(localStorage.getItem('rol_id'));

    // Si no hay token o no es el rol requerido, redirige
    if (!token || (rolRequerido && rol_id !== rolRequerido)) {
        return <Navigate to="/iniciar-sesion" replace />;
    }

    return children;
};

export default RutaPrivada;
