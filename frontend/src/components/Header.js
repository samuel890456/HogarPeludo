// frontend/src/components/Header.js
import React, { useState } from "react";
import { Link } from "react-router-dom";
import '../styles/Header.css';

const Header = ({ isAuthenticated, user, onLogout }) => {
    const [showMenu, setShowMenu] = useState(false);
    const [showDropdown, setShowDropdown] = useState(false);

    const toggleMenu = () => setShowMenu(!showMenu);
    const toggleDropdown = () => setShowDropdown(!showDropdown);

    const hasRole = (roleId) => {
        return user?.roles?.includes(roleId.toString()) || false;
    };
    return (
        <header className="header">
            <div className="logo">
                <Link to="/">
                    {/* Tu imagen de logo (sin texto) */}
                    <img src="/images/logo-mascotas.ico" alt="Hogar Peludo Logo" className="logo-img" />
                    {/* El texto de la marca */}
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


                    {/* Show Admin Panel link if user is an Admin */}
                    {isAuthenticated && hasRole('1') && ( // Check if user has '1' (admin) role
                        <li className="nav-item">
                            <Link to="/admin/dashboard" onClick={() => setShowMenu(false)}>Panel de Administración</Link>
                        </li>
                    )}

                    {/* Show Solicitudes link if user is Publicador OR Adoptante OR Admin */}
                    {isAuthenticated && (hasRole('2') || hasRole('3') || hasRole('1')) && ( // Check for Publicador, Adoptante, or Admin
                        <li className="nav-item">
                            <Link to="/solicitudes" onClick={() => setShowMenu(false)}>Solicitudes</Link>
                        </li>
                    )}

                    {!isAuthenticated ? (
                        <div className="auth-buttons auth-pc">
                            <Link to="/iniciar-sesion" className="auth-button auth-button-login" onClick={() => setShowMenu(false)}>Iniciar Sesión</Link>
                            <Link to="/registrarse" className="auth-button auth-button-register" onClick={() => setShowMenu(false)}>Registrarse</Link>
                        </div>
                    ) : (
                        <div className="user-menu">
                            <button className="user-button" onClick={toggleDropdown} aria-expanded={showDropdown}>
                                Mi Perfil {/* O user.nombre si lo tienes disponible */}
                                <span className="dropdown-arrow">{showDropdown ? '▲' : '▼'}</span> {/* Pequeña flecha para indicar dropdown */}
                            </button>
                            <div className={`dropdown-content ${showDropdown ? "active" : ""}`}>
                                <Link to="/perfil" onClick={() => { setShowDropdown(false); setShowMenu(false); }}>Mi Perfil</Link> {/* Enlace a Perfil General */}
                                <Link to="/mis-publicaciones" onClick={() => { setShowDropdown(false); setShowMenu(false); }}>Mis Publicaciones</Link>
                                <button onClick={() => { onLogout(); setShowDropdown(false); setShowMenu(false); }}>Cerrar Sesión</button>
                            </div>
                        </div>
                    )}
                </ul>

                {/* Botones de autenticación para móvil dentro del menú deslizante */}
                {!isAuthenticated && (
                    <div className="auth-menu auth-mobile">
                        <Link to="/iniciar-sesion" className="auth-button auth-button-login" onClick={() => setShowMenu(false)}>Iniciar Sesión</Link>
                        <Link to="/registrarse" className="auth-button auth-button-register" onClick={() => setShowMenu(false)}>Registrarse</Link>
                    </div>
                )}
            </nav>
        </header>
    );
};

export default Header;