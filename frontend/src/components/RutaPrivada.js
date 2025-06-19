// src/components/RutaPrivada.js
import React from 'react';
import { Navigate } from 'react-router-dom';

const RutaPrivada = ({ children, allowedRoles }) => {
    const token = localStorage.getItem('token');
    const userRolesString = localStorage.getItem('userRoles');
    let userRoles = [];

    if (userRolesString) {
        try {
            userRoles = JSON.parse(userRolesString);
        } catch (e) {
            console.error("Error parsing user roles from localStorage:", e);
            // Optionally, log out the user if roles are corrupted
            localStorage.removeItem('token');
            localStorage.removeItem('userId');
            localStorage.removeItem('userRoles');
            return <Navigate to="/iniciar-sesion" replace />;
        }
    }

    // 1. Check if user is authenticated (has a token)
    if (!token) {
        return <Navigate to="/iniciar-sesion" replace />;
    }

    // 2. If allowedRoles are specified, check if the user has at least one of them
    if (allowedRoles && Array.isArray(allowedRoles) && allowedRoles.length > 0) {
        const hasRequiredRole = allowedRoles.some(role => userRoles.includes(role));
        if (!hasRequiredRole) {
            // Redirect to home or an unauthorized page if roles don't match
            return <Navigate to="/" replace />; 
        }
    }

    // If authenticated and has the required roles (if any), render the children
    return children;
};

export default RutaPrivada;