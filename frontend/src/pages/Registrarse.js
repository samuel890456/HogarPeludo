import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { registrarUsuario  } from '../api/api'; // Asegúrate de que la ruta sea correcta
import '../styles/Registrarse.css';

const Registrarse = () => {
    const [nombre, setNombre] = useState('');
    const [email, setEmail] = useState('');
    const [contraseña, setContraseña] = useState('');
    const [error, setError] = useState('');
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            await registrarUsuario({ nombre, email, contraseña });
            navigate('/iniciar-sesion');
        } catch (error) {
            setError('Error al registrarse');
        }
    };

    return (
        <div className="registrarse">
            <h1>Registrarse</h1>
            {error && <p className="error">{error}</p>}
            <form onSubmit={handleSubmit}>
                <input
                    type="text"
                    placeholder="Nombre"
                    value={nombre}
                    onChange={(e) => setNombre(e.target.value)}
                    required
                />
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
                <button type="submit">Registrarse</button>
            </form>
            <p>¿Ya tienes una cuenta? <Link to="/iniciar-sesion">Inicia Sesión</Link></p>
        </div>
    );
};

export default Registrarse;