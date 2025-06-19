import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { iniciarSesion, googleLogin } from '../api/api.js'; // <--- Importa googleLogin
import { GoogleLogin } from '@react-oauth/google'; // <--- Importa GoogleLogin
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
            // Captura el mensaje de error del backend si existe
            if (err.response && err.response.data && err.response.data.message) {
                setError(err.response.data.message);
            } else {
                setError('Credenciales incorrectas. Por favor, verifica tu email y contraseña.');
            }
        }
    };

    // Función que se ejecuta al iniciar sesión con Google exitosamente
    const handleGoogleSuccess = async (credentialResponse) => {
        setError('');
        try {
            // Envía el ID Token de Google a tu backend
            const userData = await googleLogin({ idToken: credentialResponse.credential });
            onLogin(userData); // Maneja el login con los datos de tu app
        } catch (err) {
            console.error('Error al iniciar sesión con Google:', err);
            // Captura el mensaje de error del backend si existe
            if (err.response && err.response.data && err.response.data.message) {
                setError(`Error al iniciar sesión con Google: ${err.response.data.message}`);
            } else {
                setError('No se pudo iniciar sesión con Google. Por favor, inténtalo de nuevo.');
            }
        }
    };

    // Función que se ejecuta si falla el inicio de sesión con Google
    const handleGoogleFailure = (error) => {
        console.error('Fallo el inicio de sesión con Google:', error);
        setError('Fallo el inicio de sesión con Google. Inténtalo de nuevo.');
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
                        Iniciar Sesión
                    </button>
                </form>

                {/* Separador o texto "O" */}
                <div className="auth-separator">
                    <span className="separator-text">O</span>
                </div>

                {/* Botón de Google Login */}
                <div className="google-login-button-container">
                    <GoogleLogin
                        onSuccess={handleGoogleSuccess}
                        onError={handleGoogleFailure}
                        text="signin_with" // Cambia el texto del botón (opcional)
                        width="350px" // Ajusta el ancho para que coincida con el formulario
                        type="standard" // 'standard' o 'icon'
                        size="large" // 'small', 'medium', 'large'
                        theme="filled_blue" // 'outline' o 'filled_blue'
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
