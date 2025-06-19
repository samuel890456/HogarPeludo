// src/components/LoadingSpinner.js
import React from 'react';
import '../styles/LoadingSpinner.css'; // Crea este archivo CSS

const LoadingSpinner = ({ message = "Cargando..." }) => {
    return (
        <div className="loading-container">
            <div className="spinner"></div>
            <p>{message}</p>
        </div>
    );
};

export default LoadingSpinner;