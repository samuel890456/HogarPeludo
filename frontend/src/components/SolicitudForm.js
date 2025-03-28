import React, { useState } from 'react';
import '../styles/SolicitudForm.css';

const SolicitudForm = ({ onSubmit }) => {
    const [comentarios, setComentarios] = useState('');

    const handleSubmit = (e) => {
        e.preventDefault();
        onSubmit({ comentarios });
    };

    return (
        <form onSubmit={handleSubmit} className="solicitud-form">
            <textarea
                placeholder="Comentarios"
                value={comentarios}
                onChange={(e) => setComentarios(e.target.value)}
                required
            />
            <button type="submit">Enviar Solicitud</button>
        </form>
    );
};

export default SolicitudForm;