import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { solicitarRestablecimientoContrasena } from '../api/api'; // Necesitarás crear esta función
import '../styles/AuthForms.css'; // Reutilizamos los estilos

const OlvideContrasena = () => {
    const [email, setEmail] = useState('');
    const [message, setMessage] = useState('');
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setMessage('');
        setError('');
        setLoading(true);

        try {
            // Llama a la API para solicitar el restablecimiento
            await solicitarRestablecimientoContrasena({ email });
            setMessage('Si tu correo electrónico está registrado, recibirás un enlace para restablecer tu contraseña.');
        } catch (err) {
            console.error('Error al solicitar restablecimiento:', err);
            setError('Error al procesar tu solicitud. Por favor, inténtalo de nuevo.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="auth-container">
            <div className="auth-card">
                <h1 className="auth-title">¿Olvidaste tu Contraseña?</h1>
                <p className="auth-subtitle">
                    Ingresa tu correo electrónico y te enviaremos un enlace para restablecerla.
                </p>

                {message && <p className="auth-success-message">{message}</p>}
                {error && <p className="auth-error-message">{error}</p>}

                <form onSubmit={handleSubmit} className="auth-form">
                    <div className="form-group">
                        <label htmlFor="email-forgot">Correo Electrónico</label>
                        <input
                            id="email-forgot"
                            type="email"
                            placeholder="tu@email.com"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            required
                            aria-label="Correo electrónico"
                            disabled={loading}
                        />
                    </div>
                    
                    <button type="submit" className="btn auth-submit-button" disabled={loading}>
                        {loading ? 'Enviando...' : 'Enviar Enlace'}
                    </button>
                </form>

                <p className="auth-link-text">
                    <Link to="/iniciar-sesion" className="auth-link">Volver al inicio de sesión</Link>
                </p>
            </div>
            {/* Puedes usar la misma imagen o una diferente para esta página */}
            <div className="auth-image-banner">
                <Link to="/">
                    <img src="/images/forgot-password-illustration.png" alt="Mascota con signo de interrogación" className="auth-illustration" />
                </Link>
                <p className="banner-text">Recupera el acceso a tu cuenta</p>
            </div>
        </div>
    );
};

export default OlvideContrasena;