import React, { useState } from 'react';
import { Link, useParams, useNavigate } from 'react-router-dom';
import { restablecerContrasena } from '../api/api'; // Necesitarás crear esta función
import '../styles/AuthForms.css'; // Reutilizamos los estilos

const RestablecerContrasena = () => {
    const { token } = useParams(); // Obtiene el token de la URL
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [message, setMessage] = useState('');
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        setMessage('');
        setError('');
        setLoading(true);

        if (password !== confirmPassword) {
            setError('Las contraseñas no coinciden.');
            setLoading(false);
            return;
        }

        try {
            // Llama a la API para restablecer la contraseña
            await restablecerContrasena(token, { newPassword: password });
            setMessage('¡Tu contraseña ha sido restablecida con éxito! Serás redirigido al inicio de sesión.');
            setTimeout(() => {
                navigate('/iniciar-sesion');
            }, 3000); // Redirige después de 3 segundos
        } catch (err) {
            console.error('Error al restablecer contraseña:', err);
            setError('No se pudo restablecer la contraseña. El enlace puede ser inválido o haber expirado.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="auth-container">
            <div className="auth-card">
                <h1 className="auth-title">Restablecer Contraseña</h1>
                <p className="auth-subtitle">
                    Ingresa tu nueva contraseña.
                </p>

                {message && <p className="auth-success-message">{message}</p>}
                {error && <p className="auth-error-message">{error}</p>}

                <form onSubmit={handleSubmit} className="auth-form">
                    <div className="form-group">
                        <label htmlFor="new-password">Nueva Contraseña</label>
                        <input
                            id="new-password"
                            type="password"
                            placeholder="Mínimo 6 caracteres"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            required
                            minLength="6"
                            aria-label="Nueva contraseña"
                            disabled={loading}
                        />
                    </div>
                    
                    <div className="form-group">
                        <label htmlFor="confirm-password">Confirmar Contraseña</label>
                        <input
                            id="confirm-password"
                            type="password"
                            placeholder="Repite tu nueva contraseña"
                            value={confirmPassword}
                            onChange={(e) => setConfirmPassword(e.target.value)}
                            required
                            minLength="6"
                            aria-label="Confirmar contraseña"
                            disabled={loading}
                        />
                    </div>
                    
                    <button type="submit" className="auth-submit-button" disabled={loading}>
                        {loading ? 'Restableciendo...' : 'Restablecer Contraseña'}
                    </button>
                </form>

                <p className="auth-link-text">
                    <Link to="/iniciar-sesion" className="auth-link">Volver al inicio de sesión</Link>
                </p>
            </div>
            <div className="auth-image-banner">
                <Link to="/">
                    <img src="/images/reset-password-illustration.png" alt="Candado y llave de seguridad" className="auth-illustration" />
                </Link>
                <p className="banner-text">Asegura tu cuenta</p>
            </div>
        </div>
    );
};

export default RestablecerContrasena;