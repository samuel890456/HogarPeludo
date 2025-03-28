//src/pages/IniciarSesion.js
import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { iniciarSesion } from '../api/api.js';
import '../styles/IniciarSesion.css';

const IniciarSesion = ({ onLogin }) => {
    const [email, setEmail] = useState('');
    const [contraseña, setContraseña] = useState('');
    const [error, setError] = useState('');
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const userData = await iniciarSesion({ email, contraseña });
            onLogin(userData); // Llamar a la función para guardar los datos y redirigir
        } catch (error) {
            setError('Credenciales incorrectas');
        }
    };
    

    return (
        <div className="iniciar-sesion">
            <h1>Iniciar Sesión</h1>
            {error && <p className="error">{error}</p>}
            <form onSubmit={handleSubmit}>
                <input
                    type="email"
                    placeholder="Correo electrónico"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                />
                <input
                    type="password"
                    placeholder="Contraseña"
                    value={contraseña}
                    onChange={(e) => setContraseña(e.target.value)}
                    required
                />
                <button type="submit">Iniciar Sesión</button>
            </form>
            <p>¿No tienes una cuenta? <Link to="/registrarse">Regístrate</Link></p>
        </div>
    );
};

export default IniciarSesion;