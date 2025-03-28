//src/components/Header.js
import React, { useState } from "react";
import { Link } from "react-router-dom";
import "../styles/Header.css";

const Header = ({ isAuthenticated, user, onLogout }) => {
    const [showMenu, setShowMenu] = useState(false);

    const toggleMenu = () => {
        setShowMenu(!showMenu);
    };

    return (
        <header className="header">
            {/* Logo */}
            <div className="logo">
                <Link to="/">Adopta una Mascota</Link>
            </div>

            {/* Botón hamburguesa para móviles */}
            <button className="menu-toggle" onClick={toggleMenu}>
                ☰
            </button>

            {/* Menú de navegación */}
            <nav className={`nav ${showMenu ? "active" : ""}`}>
                <ul className="nav-list">
                    <li className="nav-item"><Link to="/">Inicio</Link></li>
                    <li className="nav-item"><Link to="/mascotas">Mascotas</Link></li>
                    <li className="nav-item"><Link to="/adopciones">Adopciones</Link></li>

                    {/* Para PC: Botones siempre visibles */}
                    {!isAuthenticated ? (
                        <div className="auth-buttons auth-pc">
                            <Link to="/iniciar-sesion" className="auth-button">Iniciar Sesión</Link>
                            <Link to="/registrarse" className="auth-button">Registrarse</Link>
                        </div>
                    ) : (
                        <div className="user-menu">
                            <button className="user-button" onClick={toggleMenu}>
                                Mi Perfil
                            </button>
                            {showMenu && (
                                <div className="dropdown-content">
                                    <Link to="/mis-publicaciones">Mis Publicaciones</Link>
                                    <button onClick={onLogout}>Cerrar Sesión</button>
                                </div>
                            )}
                        </div>
                    )}
                </ul>

                {/* Para móviles: Botones dentro del menú hamburguesa */}
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
