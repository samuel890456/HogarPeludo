import React, { useEffect, useMemo, useCallback } from 'react';
import { Link, useLocation } from 'react-router-dom';
import HeroCarousel from '../components/HeroCarousel';
import '../styles/Home.css'; // Estilos generales de la página Home

/**
 * Componente principal de la página de inicio.
 * Muestra un carrusel de héroe y secciones informativas sobre la misión y cómo funciona la plataforma.
 */
const Home = () => {
    const location = useLocation();

    // Optimización del efecto de scroll:
    // Utilizamos useCallback para memoizar la función y prevenir recreaciones innecesarias,
    // y el efecto solo se ejecuta si location.hash cambia.
    useEffect(() => {
        if (location.hash) {
            const element = document.querySelector(location.hash);
            if (element) {
                // Considera añadir un setTimeout si el elemento no se renderiza instantáneamente,
                // o si hay animaciones que retrasan su aparición.
                setTimeout(() => {
                    element.scrollIntoView({ behavior: 'smooth' });
                }, 100); // Pequeño retraso para asegurar que el DOM esté listo
            } else {
                console.warn(`Elemento con ID "${location.hash}" no encontrado para scroll.`);
            }
        }
    }, [location.hash]); // Dependencia clave: solo re-ejecutar si el hash de la URL cambia

    // Array de imágenes para el carrusel.
    // Usamos useMemo para asegurar que este array solo se cree una vez
    // y no en cada render, a menos que sus dependencias cambien (en este caso, no tiene).
    const carouselImages = useMemo(() => [
        'https://images.unsplash.com/photo-1514888286974-6c03e2ca1dba?q=80&w=2043&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D',
        'https://images.unsplash.com/photo-1564166174574-a9666f590437?q=80&w=1974&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D',
        'https://images.unsplash.com/photo-1552053831-71594a27632d?q=80&w=2062&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D',
        'https://images.unsplash.com/photo-1729500272640-96aac7d17f5e?q=80&w=1972&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D',
        'https://images.unsplash.com/photo-1583337130417-3346a1be7dee?q=80&w=2070&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D',
        'https://images.unsplash.com/photo-1583513702411-9dade5d3cb12?q=80&w=1976&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D',
    ], []);

    // Componente auxiliar para un paso del proceso.
    // Esto mejora la legibilidad y la reutilización si tuvieras muchos pasos.
    const HowItWorksStep = ({ iconClass, title, description }) => (
        <div className="step-item">
            <i className={`fas ${iconClass}`}></i> {/* Usamos el prefijo 'fas' para FontAwesome Solid */}
            <h3>{title}</h3>
            <p>{description}</p>
        </div>
    );

    return (
        <div className="home-page-container">
            {/* Carrusel de imágenes principal */}
            <HeroCarousel images={carouselImages} interval={6000} />

            {/* Sección "Nuestra Misión" */}
            <section className="about-us-section">
                <div className="container">
                    <h2>Nuestra Misión</h2>
                    <p>En **Hogar Peludo**, creemos que cada animal merece un hogar amoroso y una segunda oportunidad. Nos dedicamos a conectar mascotas necesitadas con familias dispuestas a brindarles cuidado, felicidad y un futuro lleno de amor.</p>
                    <p>Trabajamos incansablemente para asegurar que cada adopción sea un éxito, brindando apoyo y recursos tanto a los adoptantes como a los animales.</p>
                    <Link to="/nosotros" className="btn-secondary">Conoce Más Sobre Nosotros</Link>
                </div>
            </section>

            {/* Sección "¿Cómo Funciona?" */}
            <section className="how-it-works-section" id="como-funciona"> {/* ID en minúsculas y kebab-case por convención */}
                <div className="container">
                    <h2>¿Cómo Funciona?</h2>
                    <div className="steps-grid">
                        {/* Reutilizando el componente HowItWorksStep */}
                        <HowItWorksStep
                            iconClass="fa-search"
                            title="1. Explora"
                            description="Navega por nuestra galería de mascotas disponibles, filtra por especie, tamaño, ubicación y más."
                        />
                        <HowItWorksStep
                            iconClass="fa-heart"
                            title="2. Enamórate"
                            description="Encuentra a tu compañero ideal, conoce su historia y características en detalle."
                        />
                        <HowItWorksStep
                            iconClass="fa-file-alt"
                            title="3. Solicita"
                            description="Completa una solicitud de adopción sencilla y nuestro equipo la revisará cuidadosamente."
                        />
                        <HowItWorksStep
                            iconClass="fa-home"
                            title="4. Adopta"
                            description="¡Dale la bienvenida a tu nuevo amigo a casa y comienza una aventura juntos!"
                        />
                    </div>
                </div>
            </section>
        </div>
    );
};

export default Home;