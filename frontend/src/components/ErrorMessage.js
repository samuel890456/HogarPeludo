// src/components/ErrorMessage.js
import React from 'react';
import '../styles/ErrorMessage.css'; // Crea este archivo CSS

const ErrorMessage = ({ message }) => {
    if (!message) return null;
    return (
        <div className="error-message-container">
            <p>{message}</p>
        </div>
    );
};

export default ErrorMessage;