import React from 'react';
import { Link } from 'react-router-dom';
import '../styles/Home.css';

const Home = () => {
    return (
        <div className="home-container">
            <section className="hero-section">
                <div className="hero-content">
                    <h1>Encuentra a tu nuevo mejor amigo</h1>
                    <p>Adopta una mascota y cambia una vida para siempre.</p>
                    <Link to="/mascotas" className="btn btn-primary">Ver Mascotas</Link>
                </div>
            </section>

            <section className="how-it-works-section">
                <div className="container">
                    <h2>¿Cómo Funciona?</h2>
                    <div className="steps-grid">
                        <div className="step-item">
                            <i className="fas fa-search"></i>
                            <h3>1. Explora</h3>
                            <p>Navega por nuestra galería de mascotas disponibles.</p>
                        </div>
                        <div className="step-item">
                            <i className="fas fa-heart"></i>
                            <h3>2. Enamórate</h3>
                            <p>Encuentra a tu compañero ideal y conoce su historia.</p>
                        </div>
                        <div className="step-item">
                            <i className="fas fa-file-alt"></i>
                            <h3>3. Solicita</h3>
                            <p>Completa una solicitud de adopción sencilla.</p>
                        </div>
                        <div className="step-item">
                            <i className="fas fa-home"></i>
                            <h3>4. Adopta</h3>
                            <p>¡Dale la bienvenida a tu nuevo amigo a casa!</p>
                        </div>
                    </div>
                </div>
            </section>

            <section className="testimonials-section">
                <div className="container">
                    <h2>Lo que dicen nuestras familias</h2>
                    <div className="testimonials-grid">
                        <div className="testimonial-item">
                            <p>"Adoptar a Max fue la mejor decisión. Es un perro increíble y nos ha llenado de alegría. ¡Gracias, Hogar Peludo!"</p>
                            <h4>- Familia García</h4>
                        </div>
                        <div className="testimonial-item">
                            <p>"Nunca pensé que encontraría a mi alma gemela felina, pero Luna es perfecta. El proceso fue sencillo y lleno de apoyo."</p>
                            <h4>- Sofía R.</h4>
                        </div>
                        <div className="testimonial-item">
                            <p>"Hogar Peludo nos ayudó a encontrar a nuestro pequeño amigo. Son un equipo maravilloso y hacen una labor increíble."</p>
                            <h4>- Los Martínez</h4>
                        </div>
                    </div>
                </div>
            </section>

            <section className="foundations-section">
                <div className="container">
                    <h2>Nuestras Fundaciones</h2>
                    <p>Conoce a las fundaciones que hacen posible nuestra labor.</p>
                    <Link to="/fundaciones" className="btn btn-secondary">Ver Fundaciones</Link>
                </div>
            </section>
        </div>
    );
};

export default Home;