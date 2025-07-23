import React from 'react';

const ErrorMessage = ({ message }) => {
    if (!message) return null;
    return (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative" role="alert">
            <p className="text-sm">{message}</p>
        </div>
    );
};

export default ErrorMessage;