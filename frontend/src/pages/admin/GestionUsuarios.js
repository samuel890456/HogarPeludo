// frontend/components/GestionUsuarios.js
import React, { useEffect, useState } from 'react';
import { getUsuarios, toggleUsuario } from '../../api/adminApi';
import AdminNav from '../../components/admin/AdminNav';
import '../../styles/GestionUsuarios.css';

const GestionUsuarios = () => {
    const [usuarios, setUsuarios] = useState([]);

    useEffect(() => {
        cargarUsuarios();
    }, []);

    const cargarUsuarios = async () => {
        try {
            const data = await getUsuarios();
            setUsuarios(data);
        } catch (error) {
            console.error('Error al cargar usuarios:', error.message);
        }
    };

    const handleToggle = async (id) => {
        try {
            await toggleUsuario(id);
            cargarUsuarios(); // Recargar lista para reflejar cambio
        } catch (error) {
            console.error('Error al cambiar estado del usuario:', error.message);
        }
    };

    return (
        <div className="gestion-usuarios">
            <AdminNav />
            <h2>Gestión de Usuarios</h2>
            <table>
                <thead>
                    <tr>
                        <th>Nombre</th>
                        <th>Email</th>
                        <th>Teléfono</th>
                        <th>Dirección</th>
                        <th>Estado</th>
                        <th>Acción</th>
                    </tr>
                </thead>
                <tbody>
                    {usuarios.map((user) => (
                        <tr key={user.id}>
                            <td data-label>{user.nombre}</td>
                            <td data-label>{user.email}</td>
                            <td data-label>{user.telefono}</td>
                            <td data-label>{user.direccion}</td>
                            <td data-label>{user.estado}</td>
                            <td data-label="Acción">
                                <button onClick={() => handleToggle(user.id)}>
                                    {user.estado === 'activo' ? 'Bloquear' : 'Desbloquear'}
                                </button>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
};

export default GestionUsuarios;
