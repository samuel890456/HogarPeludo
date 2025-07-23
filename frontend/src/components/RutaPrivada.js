// src/components/RutaPrivada.js
import React from 'react';
import { Navigate } from 'react-router-dom';
import useAuthStore from '../store/authStore';

const RutaPrivada = ({ children, allowedRoles }) => {
    const { isLoggedIn, user, isInitialized, isAuthenticated } = useAuthStore();

    // Si no está inicializado, mostrar loading
    if (!isInitialized) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-orange-50 to-pink-50">
                <div className="text-center">
                    <div className="w-12 h-12 mx-auto mb-4 bg-gradient-to-br from-orange-400 to-pink-500 rounded-xl flex items-center justify-center shadow-lg animate-pulse">
                        <svg className="w-6 h-6 text-white" fill="currentColor" viewBox="0 0 20 20">
                            <path fillRule="evenodd" d="M3.172 5.172a4 4 0 015.656 0L10 6.343l1.172-1.171a4 4 0 115.656 5.656L10 17.657l-6.828-6.829a4 4 0 010-5.656z" clipRule="evenodd" />
                        </svg>
                    </div>
                    <p className="text-gray-500">Verificando autenticación...</p>
                </div>
            </div>
        );
    }

    // 1. Check if user is authenticated
    if (!isAuthenticated()) {
        return <Navigate to="/iniciar-sesion" replace />;
    }

    // 2. If allowedRoles are specified, check if the user has at least one of them
    if (allowedRoles && Array.isArray(allowedRoles) && allowedRoles.length > 0) {
        const hasRequiredRole = allowedRoles.some(role => user?.roles?.includes(role));
        if (!hasRequiredRole) {
            // Redirect to home or an unauthorized page if roles don't match
            return <Navigate to="/" replace />; 
        }
    }

    // If authenticated and has the required roles (if any), render the children
    return children;
};

export default RutaPrivada;