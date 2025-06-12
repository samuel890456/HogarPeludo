import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { iniciarSesion } from '../api/api.js';
import '../styles/AuthForms.css'; // Using a shared CSS file for both forms

const IniciarSesion = ({ onLogin }) => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState(''); // Changed to 'password' for consistency
    const [error, setError] = useState('');
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError(''); // Clear previous errors
        try {
            const userData = await iniciarSesion({ email, contraseña: password }); // Pass password to API
            onLogin(userData);
        } catch (err) {
            console.error('Error al iniciar sesión:', err);
            setError('Credenciales incorrectas. Por favor, verifica tu email y contraseña.');
        }
    };

    return (
        <div className="auth-container">
            <div className="auth-card">
                <h1 className="auth-title">Inicia Sesión</h1>
                <p className="auth-subtitle">¡Bienvenido de nuevo a Huellitas de Esperanza!</p>

                {error && <p className="auth-error-message">{error}</p>}

                <form onSubmit={handleSubmit} className="auth-form">
                    <div className="form-group">
                        <label htmlFor="email-login">Correo Electrónico</label>
                        <input
                            id="email-login"
                            type="email"
                            placeholder="tu@email.com"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            required
                            aria-label="Correo electrónico"
                        />
                    </div>
                    
                    <div className="form-group">
                        <label htmlFor="password-login">Contraseña</label>
                        <input
                            id="password-login"
                            type="password"
                            placeholder="Ingresa tu contraseña"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            required
                            aria-label="Contraseña"
                        />
                    </div>
                    
                    <button type="submit" className="auth-submit-button">
                        Entrar
                    </button>
                </form>

                <p className="auth-link-text">
                    ¿No tienes una cuenta? <Link to="/registrarse" className="auth-link">Regístrate aquí</Link>
                </p>
            </div>
            <div className="auth-image-banner">
                <Link to="/">
                <img src="/images/login-illustration.png" alt="Mascotas esperando ser adoptadas" className="auth-illustration" />
                </Link>
                <p className="banner-text">Conecta con tu próxima huella</p>
            </div>
        </div>
    );
};

export default IniciarSesion;