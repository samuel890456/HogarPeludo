// frontend/src/pages/admin/GestionUsuarios.js
import React, { useEffect, useState, useCallback, memo } from 'react';
import AdminNav from '../../components/admin/AdminNav';
import { getUsuarios, toggleUsuario } from '../../api/adminApi';
import { toast } from 'react-toastify';
import '../../styles/GestionUsuarios.css';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCheckCircle, faBan, faSpinner } from '@fortawesome/free-solid-svg-icons';

// --- REUSABLE COMPONENTS ---

// Component for displaying user status with an icon
const StatusBadge = ({ status }) => {
    const isBlocked = status.toLowerCase() === 'bloqueado';
    const icon = isBlocked ? faBan : faCheckCircle;
    const className = isBlocked ? 'estado-bloqueado' : 'estado-activo';
    const text = isBlocked ? 'Bloqueado' : 'Activo';

    return (
        <span className={className}>
            <FontAwesomeIcon icon={icon} />
            {text}
        </span>
    );
};

// Component for the action button (Block/Unblock)
const ActionButton = ({ userId, currentStatus, onToggle }) => {
    const isBlocked = currentStatus.toLowerCase() === 'bloqueado';
    const buttonText = isBlocked ? 'Desbloquear' : 'Bloquear';
    const buttonClass = isBlocked ? 'desbloquear' : 'bloquear'; // Specific classes for styles

    return (
        <button
            onClick={() => onToggle(userId)}
            className={`action-button ${buttonClass}`} // Use a base class and modifier
            aria-label={`${buttonText} usuario con ID ${userId}`} // Accessibility label
        >
            {buttonText}
        </button>
    );
};

// Memoized component for each table row to prevent re-renders if props don't change
const UserTableRow = memo(({ user, onToggleUserStatus }) => (
    <tr key={user.id}>
        <td data-label="Nombre">{user.nombre}</td>
        <td data-label="Email">{user.email}</td>
        <td data-label="Teléfono">{user.telefono || 'N/A'}</td> {/* Handle missing phone/address */}
        <td data-label="Dirección">{user.direccion || 'N/A'}</td>
        <td data-label="Estado">
            <StatusBadge status={user.estado} />
        </td>
        <td data-label="Acción">
            <ActionButton
                userId={user.id}
                currentStatus={user.estado}
                onToggle={onToggleUserStatus}
            />
        </td>
    </tr>
));

// Main table component
const UserTable = ({ users, onToggleUserStatus }) => {
    if (!users || users.length === 0) {
        return <p className="no-data-message">No hay usuarios registrados para mostrar.</p>;
    }

    return (
        <div className="table-responsive-container"> {/* Container for responsive overflow */}
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
                    {users.map(user => (
                        <UserTableRow key={user.id} user={user} onToggleUserStatus={onToggleUserStatus} />
                    ))}
                </tbody>
            </table>
        </div>
    );
};

// --- CUSTOM HOOK FOR DATA LOGIC ---
const useUsersManagement = () => {
    const [users, setUsers] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    const loadUsers = useCallback(async () => {
        setLoading(true);
        setError(null);
        try {
            const data = await getUsuarios();
            setUsers(data);
        } catch (err) {
            console.error('Error al cargar usuarios:', err);
            setError('No se pudieron cargar los usuarios. Por favor, intenta de nuevo.');
            toast.error('Error al cargar usuarios.');
        } finally {
            setLoading(false);
        }
    }, []);

    useEffect(() => {
        loadUsers();
    }, [loadUsers]);

    const toggleUserStatus = useCallback(async (id) => {
        try {
            await toggleUsuario(id);
            toast.success('Estado del usuario actualizado con éxito.');
            loadUsers();
        } catch (err) {
            console.error('Error al cambiar estado del usuario:', err);
            toast.error('Error al actualizar el estado del usuario.');
        }
    }, [loadUsers]);

    return {
        users,
        loading,
        error,
        toggleUserStatus,
        loadUsers // Make loadUsers accessible to the component
    };
};

// --- MAIN COMPONENT ---
const GestionUsuarios = () => {
    // Call the hook unconditionally at the top level
    const { users, loading, error, toggleUserStatus, loadUsers } = useUsersManagement(); // <--- FIX HERE

    return (
        <div>
            <AdminNav />
            <div className="gestion-usuarios-container">
                <h2>Gestión de Usuarios</h2>

                {loading && (
                    <div className="loading-state">
                        <FontAwesomeIcon icon={faSpinner} spin size="2x" />
                        <p>Cargando usuarios...</p>
                    </div>
                )}

                {error && (
                    <div className="error-state">
                        <p>{error}</p>
                        {/* Use the loadUsers function returned from the hook */}
                        <button onClick={loadUsers} className="retry-button"> {/* <--- FIX HERE */}
                            Reintentar Carga
                        </button>
                    </div>
                )}

                {!loading && !error && (
                    <UserTable users={users} onToggleUserStatus={toggleUserStatus} />
                )}
            </div>
        </div>
    );
};

export default GestionUsuarios;