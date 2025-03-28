import React from 'react';
import { Link } from 'react-router-dom';
import '../styles/UserMenu.css';

const UserMenu = ({ user, onLogout }) => {
    return (
        <div className="user-menu">
            <button className="user-button">{user.nombre}</button>
            <div className="dropdown-content">
                <Link to="/perfil">Perfil</Link>
                <button onClick={onLogout}>Cerrar Sesión</button>
            </div>
        </div>
    );
};

export default UserMenu;