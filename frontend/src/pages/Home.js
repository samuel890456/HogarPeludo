import React from 'react';
import { Link } from 'react-router-dom';
import '../styles/Home.css';

const Home = () => {
    return (
        <div className="home">
            <h1>Bienvenido a Adopta una Mascota</h1>
            <p>Encuentra a tu compañero perfecto y dale un hogar lleno de amor.</p>
            <Link to="/mascotas" className="btn-primary">Ver Mascotas</Link>
        </div>
    );
};

export default Home;