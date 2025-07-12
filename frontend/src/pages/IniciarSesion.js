import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { iniciarSesion, googleLogin } from '../api/api.js';
import { GoogleLogin } from '@react-oauth/google';
import '../styles/AuthForms.css';

const IniciarSesion = ({ onLogin }) => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        try {
            const userData = await iniciarSesion({ email, contraseña: password });
            onLogin(userData);
        } catch (err) {
            console.error('Error al iniciar sesión:', err);
            if (err.response && err.response.data && err.response.data.message) {
                setError(err.response.data.message);
            } else {
                setError('Credenciales incorrectas. Por favor, verifica tu email y contraseña.');
            }
        }
    };

    const handleGoogleSuccess = async (credentialResponse) => {
        setError('');
        try {
            const userData = await googleLogin({ idToken: credentialResponse.credential });
            onLogin(userData);
        } catch (err) {
            console.error('Error al iniciar sesión con Google:', err);
            if (err.response && err.response.data && err.response.data.message) {
                setError(`Error al iniciar sesión con Google: ${err.response.data.message}`);
            } else {
                setError('No se pudo iniciar sesión con Google. Por favor, inténtalo de nuevo.');
            }
        }
    };

    const handleGoogleFailure = (error) => {
        console.error('Fallo el inicio de sesión con Google:', error);
        setError('Fallo el inicio de sesión con Google. Inténtalo de nuevo.');
    };

    return (
        <div className="auth-container">
            <div className="auth-card">
                <h1 className="auth-title">Inicia Sesión</h1>
                <p className="auth-subtitle">¡Bienvenido de nuevo a Hogar Peludo!</p>

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

                    <button type="submit" className="btn auth-submit-button">
                        Iniciar Sesión
                    </button>
                </form>

                <div className="auth-separator">
                    <span className="separator-text">O</span>
                </div>

                <div className="google-login-button-container">
                    <GoogleLogin
                        onSuccess={handleGoogleSuccess}
                        onError={handleGoogleFailure}
                        text="signin_with"
                        width="350px"
                        type="standard"
                        size="large"
                        theme="filled_blue"
                    />
                </div>

                <p className="auth-additional-link">
                    <Link to="/olvide-contrasena" className="auth-link">¿Olvidaste tu contraseña?</Link>
                </p>

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
