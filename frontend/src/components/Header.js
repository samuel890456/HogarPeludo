// frontend/src/components/Header.js
import React, { useState, useEffect } from "react"; // Asegúrate de importar useEffect
import { Link, useNavigate } from "react-router-dom"; // Importa useNavigate
import '../styles/Header.css';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faBell, faPaw } from '@fortawesome/free-solid-svg-icons';
import { getUnreadNotifications, markNotificationAsRead } from '../api/api';

const Header = ({ isAuthenticated, user, onLogout }) => {
    const [showMenu, setShowMenu] = useState(false);
    const [showDropdown, setShowDropdown] = useState(false);
    const [unreadNotifications, setUnreadNotifications] = useState([]); // Nuevo estado para notificaciones
    const [showNotificationsDropdown, setShowNotificationsDropdown] = useState(false); // Nuevo estado para el dropdown de notificaciones

    const navigate = useNavigate(); // Hook para la navegación programática

    const toggleMenu = () => setShowMenu(!showMenu);
    const toggleDropdown = () => setShowDropdown(!showDropdown);

    const hasRole = (roleId) => {
        return user?.roles?.includes(roleId.toString()) || false;
    };

    // Efecto para cargar notificaciones no leídas
    useEffect(() => {
        let intervalId;
        if (isAuthenticated) {
            const fetchNotifications = async () => {
                try {
                    const notifications = await getUnreadNotifications();
                    setUnreadNotifications(notifications);
                } catch (error) {
                    console.error('Error al cargar notificaciones:', error);
                }
            };

            fetchNotifications(); // Cargar al montar
            intervalId = setInterval(fetchNotifications, 60000); // Cargar cada 60 segundos
        }

        return () => {
            if (intervalId) {
                clearInterval(intervalId); // Limpiar el intervalo al desmontar o desloguear
            }
        };
    }, [isAuthenticated]); // Dependencia: re-ejecutar si el estado de autenticación cambia

    const handleNotificationClick = async (notification) => {
        try {
            await markNotificationAsRead(notification.id);
            setUnreadNotifications(prev => prev.filter(n => n.id !== notification.id)); // Eliminar de la lista de no leídas
            setShowNotificationsDropdown(false); // Cerrar el dropdown de notificaciones

            if (notification.enlace) {
                navigate(notification.enlace); // Navegar al enlace si existe
            }
        } catch (error) {
            console.error('Error al marcar notificación como leída o navegar:', error);
            // Opcional: Mostrar un mensaje de error al usuario
        }
    };

    const handleBellClick = (event) => {
        event.stopPropagation(); // Evitar que el clic en la campana cierre el menú de usuario
        setShowNotificationsDropdown(!showNotificationsDropdown);
        // Asegúrate de cerrar el menú de usuario si está abierto para evitar superposiciones
        setShowDropdown(false);
    };

    // Función para cerrar cualquier dropdown al hacer clic fuera
    useEffect(() => {
        const handleClickOutside = (event) => {
            if (showNotificationsDropdown && !event.target.closest('.notification-icon-container')) {
                setShowNotificationsDropdown(false);
            }
            if (showDropdown && !event.target.closest('.user-menu')) {
                setShowDropdown(false);
            }
        };

        document.addEventListener('mousedown', handleClickOutside);
        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
        };
    }, [showNotificationsDropdown, showDropdown]);


    return (
        <header className="header">
            <div className="logo">
                <Link to="/">
                    <img src="/images/logo-mascotas.ico" alt="Hogar Peludo Logo" className="logo-img" />
                    <div className="logo-text">
                        <span className="logo-main-text">HOGAR PELUDO</span>
                        <span className="logo-sub-text">ADOPCION ANIMAL</span>
                    </div>
                </Link>
            </div>

            <button className="menu-toggle" onClick={toggleMenu} aria-label="Toggle navigation menu">
                ☰
            </button>

            <nav className={`nav ${showMenu ? "active" : ""}`}>
                <ul className="nav-list">
                    <li className="nav-item"><Link to="/" onClick={() => setShowMenu(false)}>Inicio</Link></li>
                    <li className="nav-item"><Link to="/mascotas" onClick={() => setShowMenu(false)}>Mascotas</Link></li>
                    <li className="nav-item"><Link to="/fundaciones" onClick={() => setShowMenu(false)}>Fundaciones</Link></li>

                    {/* Show Admin Panel link if user is an Admin */}
                    {isAuthenticated && hasRole('1') && (
                        <li className="nav-item">
                            <Link to="/admin/dashboard" onClick={() => setShowMenu(false)}>Panel de Administración</Link>
                        </li>
                    )}

                    {/* Show Solicitudes link if user is Publicador OR Adoptante OR Admin */}
                    {isAuthenticated && (hasRole('2') || hasRole('3') || hasRole('1')) && (
                        <li className="nav-item">
                            <Link to="/solicitudes" onClick={() => setShowMenu(false)}>Solicitudes</Link>
                        </li>
                    )}

                    {/* Campana de Notificaciones */}
                    {isAuthenticated && ( // Solo si el usuario está autenticado
                        <li className="nav-item notification-icon-container" onClick={handleBellClick}>
                            <FontAwesomeIcon icon={faBell} className="notification-bell" />
                            {unreadNotifications.length > 0 && (
                                <span className="notification-badge">{unreadNotifications.length}</span>
                            )}
                            {showNotificationsDropdown && (
                                <div className="notifications-dropdown">
                                    {unreadNotifications.length === 0 ? (
                                        <p className="no-notifications">No tienes notificaciones nuevas.</p>
                                    ) : (
                                        <ul>
                                            {unreadNotifications.map(notif => (
                                                <li key={notif.id} onClick={(e) => { e.stopPropagation(); handleNotificationClick(notif); }}>
                                                    {notif.mensaje}
                                                    <span className="notification-date">
                                                        {new Date(notif.fecha_creacion).toLocaleString()}
                                                    </span>
                                                </li>
                                            ))}
                                        </ul>
                                    )}
                                </div>
                            )}
                        </li>
                    )}

                    {!isAuthenticated ? (
                        <div className="auth-buttons auth-pc">
                            <Link to="/iniciar-sesion" className="btn auth-button auth-button-login" onClick={() => setShowMenu(false)}>Iniciar Sesión</Link>
                            <Link to="/registrarse" className="btn auth-button auth-button-register" onClick={() => setShowMenu(false)}>Registrarse</Link>
                        </div>
                    ) : (
                        <div className="user-menu">
                            <button className="user-button" onClick={toggleDropdown} aria-expanded={showDropdown}>
                                {user?.nombre || "Mi Perfil"} {/* Muestra el nombre del usuario si está disponible */}
                                <span className="dropdown-arrow">{showDropdown ? '▲' : '▼'}</span>
                            </button>
                            <div className={`dropdown-content ${showDropdown ? "active" : ""}`}>
                                <Link to="/perfil" onClick={() => { setShowDropdown(false); setShowMenu(false); }}>Mi Perfil</Link>
                                <Link to="/mis-publicaciones" onClick={() => { setShowDropdown(false); setShowMenu(false); }}>Mis Publicaciones</Link>
                                <Link to="/notificaciones" onClick={() => { setShowDropdown(false); setShowMenu(false); setShowNotificationsDropdown(false); }}>
                                    Mis Notificaciones {/* Podrías añadir FontAwesomeIcon aquí también */}
                                </Link>
                                <button onClick={() => { onLogout(); setShowDropdown(false); setShowMenu(false); }}>Cerrar Sesión</button>
                            </div>
                        </div>
                    )}
                </ul>

                {/* Botones de autenticación para móvil dentro del menú deslizante */}
                {!isAuthenticated && (
                    <div className="auth-menu auth-mobile">
                        <Link to="/iniciar-sesion" className="btn auth-button auth-button-login" onClick={() => setShowMenu(false)}>Iniciar Sesión</Link>
                        <Link to="/registrarse" className="btn auth-button auth-button-register" onClick={() => setShowMenu(false)}>Registrarse</Link>
                    </div>
                )}
            </nav>
        </header>
    );
};

export default Header;