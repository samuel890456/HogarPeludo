import React, { useState } from "react";
import { Link } from "react-router-dom";
import "../styles/Header.css";

const Header = ({ isAuthenticated, user, onLogout }) => {
    const [showMenu, setShowMenu] = useState(false);
    const [showDropdown, setShowDropdown] = useState(false);

    const toggleMenu = () => setShowMenu(!showMenu);
    const toggleDropdown = () => setShowDropdown(!showDropdown);

    return (
        <header className="header">
            <div className="logo">
                <Link to="/">Adopta una Mascota</Link>
            </div>

            <button className="menu-toggle" onClick={toggleMenu}>☰</button>

            <nav className={`nav ${showMenu ? "active" : ""}`}>
                <ul className="nav-list">
                    <li className="nav-item"><Link to="/">Inicio</Link></li>
                    <li className="nav-item"><Link to="/mascotas">Mascotas</Link></li>
                    <li className="nav-item"><Link to="/adopciones">Adopciones</Link></li>

                    {isAuthenticated && user?.rol_id === "1" && (
                        <li className="nav-item">
                            <Link to="/admin/dashboard">Panel de Administración</Link>
                        </li>
                    )}

                    {!isAuthenticated ? (
                        <div className="auth-buttons auth-pc">
                            <Link to="/iniciar-sesion" className="auth-button">Iniciar Sesión</Link>
                            <Link to="/registrarse" className="auth-button">registrarse</Link>
                        </div>
                    ) : (
                        <div className="user-menu">
                            <button className="user-button" onClick={toggleDropdown}>
                                Mi Perfil
                            </button>
                            {showDropdown && (
                                <div className="dropdown-content active">
                                    <Link to="/mis-publicaciones">Mis Publicaciones</Link>
                                    <button onClick={onLogout}>Cerrar Sesión</button>
                                </div>
                            )}
                        </div>
                    )}
                </ul>

                {!isAuthenticated && (
                    <div className="auth-menu auth-mobile">
                        <Link to="/iniciar-sesion" className="auth-button">Iniciar Sesión</Link>
                        <Link to="/registrarse" className="auth-button">Registrarse</Link>
                    </div>
                )}
            </nav>
        </header>
    );
};


export default Header;
