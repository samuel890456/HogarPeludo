//src/pages/Perfil.js
import React, { useState, useEffect } from 'react';
import { getUsuario, updateUsuario } from '../api/api.js';
import '../styles/Perfil.css';

const Perfil = () => {
    const [usuario, setUsuario] = useState({});
    const [nombre, setNombre] = useState('');
    const [email, setEmail] = useState('');
    const [telefono, setTelefono] = useState('');
    const [direccion, setDireccion] = useState('');
    const [error, setError] = useState('');

    useEffect(() => {
        const fetchUsuario = async () => {
            try {
                const data = await getUsuario();
                setUsuario(data);
                setNombre(data.nombre);
                setEmail(data.email);
                setTelefono(data.telefono || '');
                setDireccion(data.direccion || '');
            } catch (error) {
                console.error('Error al cargar el perfil:', error);
            }
        };
        fetchUsuario();
    }, []);

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            await updateUsuario({ nombre, email, telefono, direccion });
            setError('Perfil actualizado correctamente');
        } catch (error) {
            setError('Error al actualizar el perfil');
        }
    };

    return (
        <div className="perfil">
            <h1>Mi Perfil</h1>
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
                    type="text"
                    placeholder="Teléfono"
                    value={telefono}
                    onChange={(e) => setTelefono(e.target.value)}
                />
                <input
                    type="text"
                    placeholder="Dirección"
                    value={direccion}
                    onChange={(e) => setDireccion(e.target.value)}
                />
                <button type="submit">Guardar Cambios</button>
            </form>
        </div>
    );
};

export default Perfil;