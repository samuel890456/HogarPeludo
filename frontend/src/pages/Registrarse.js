import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { registrarUsuario } from '../api/api';
import '../styles/AuthForms.css'; // Using a shared CSS file for both forms

const Registrarse = () => {
    const [nombre, setNombre] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState(''); // Changed to 'password' for consistency
    const [error, setError] = useState('');
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError(''); // Clear previous errors
        try {
            await registrarUsuario({ nombre, email, contraseña: password }); // Pass password to API
            alert('¡Registro exitoso! Ahora puedes iniciar sesión.'); // User feedback
            navigate('/iniciar-sesion');
        } catch (err) {
            console.error('Error al registrarse:', err);
            // Check if error response has a specific message
            if (err.response && err.response.data && err.response.data.message) {
                setError(`Error al registrarse: ${err.response.data.message}`);
            } else {
                setError('Error al registrarse. Por favor, inténtalo de nuevo.');
            }
        }
    };

    return (
        <div className="auth-container">
             <div className="auth-image-banner reverse-order"> {/* Added reverse-order for layout on register */}
                <Link to="/">
                <img src="/images/login-illustration.png" alt="Mascotas y dueños felices" className="auth-illustration" />
                </Link>
                <p className="banner-text">¡Tu nueva familia te espera!</p>
            </div>
            <div className="auth-card">
                <h1 className="auth-title">Regístrate</h1>
                <p className="auth-subtitle">Únete a nuestra comunidad y encuentra a tu compañero ideal.</p>

                {error && <p className="auth-error-message">{error}</p>}

                <form onSubmit={handleSubmit} className="auth-form">
                    <div className="form-group">
                        <label htmlFor="name-register">Nombre</label>
                        <input
                            id="name-register"
                            type="text"
                            placeholder="Tu nombre completo"
                            value={nombre}
                            onChange={(e) => setNombre(e.target.value)}
                            required
                            aria-label="Nombre"
                        />
                    </div>

                    <div className="form-group">
                        <label htmlFor="email-register">Correo Electrónico</label>
                        <input
                            id="email-register"
                            type="email"
                            placeholder="tu@email.com"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            required
                            aria-label="Correo electrónico"
                        />
                    </div>

                    <div className="form-group">
                        <label htmlFor="password-register">Contraseña</label>
                        <input
                            id="password-register"
                            type="password"
                            placeholder="Crea una contraseña segura"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            required
                            aria-label="Contraseña"
                        />
                    </div>
                    
                    <button type="submit" className="auth-submit-button">
                        Crear Cuenta
                    </button>
                </form>

                <p className="auth-link-text">
                    ¿Ya tienes una cuenta? <Link to="/iniciar-sesion" className="auth-link">Inicia Sesión</Link>
                </p>
            </div>
        </div>
    );
};

export default Registrarse;