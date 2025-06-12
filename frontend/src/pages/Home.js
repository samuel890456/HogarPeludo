// frontend/src/pages/Home.js
import React from 'react';
import { Link } from 'react-router-dom'; // Asegúrate de importar Link si lo usas en el botón
import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import HeroCarousel from '../components/HeroCarousel'; // Importa el componente del carrusel
import '../styles/Home.css'; // Puedes seguir usando este archivo para otros estilos de Home
// Ya no necesitarás HeroCarousel.css si no hay otros elementos en Home.js aparte del carrusel.
// Pero lo mantendremos para otros elementos que puedas agregar en el futuro.


const Home = () => {
    const location = useLocation();

    useEffect(() => {
        if (location.hash) {
            const element = document.querySelector(location.hash);
            if (element) {
                element.scrollIntoView({ behavior: 'smooth' });
            }
        }
    }, [location]);

    // Array de imágenes para el carrusel
    // ¡IMPORTANTE!: Reemplaza estas URLs con las rutas a tus propias imágenes de alta calidad
    // Puedes ponerlas en tu carpeta `public/images/` o importarlas desde `src/assets/`.
    const carouselImages = [
        'https://images.unsplash.com/photo-1514888286974-6c03e2ca1dba?q=80&w=2043&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D', // Perro y gato en casa
        'https://images.unsplash.com/photo-1564166174574-a9666f590437?q=80&w=1974&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D', // Primer plano de un perro feliz
        'https://images.unsplash.com/photo-1552053831-71594a27632d?q=80&w=2062&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D', // Perro corriendo en la playa
        'https://images.unsplash.com/photo-1729500272640-96aac7d17f5e?q=80&w=1972&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D', // Gato acurrucado
        'https://images.unsplash.com/photo-1583337130417-3346a1be7dee?q=80&w=2070&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D',
        'https://images.unsplash.com/photo-1583513702411-9dade5d3cb12?q=80&w=1976&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D',
        // Añade tantas imágenes como quieras
    ];

    return (
        <div className="home-page-container"> {/* Un contenedor para el home */}
            <HeroCarousel images={carouselImages} interval={6000} /> {/* Pasa las imágenes y el intervalo */}

            {/* Aquí puedes añadir más secciones a tu Home.js si lo deseas */}
            {/* Ejemplo: */}
            <section className="about-us-section">
                <div className="container">
                    <h2>Nuestra Misión</h2>
                    <p>En Hogar Peludo, creemos que cada animal merece un hogar amoroso y una segunda oportunidad. Nos dedicamos a conectar mascotas necesitadas con familias dispuestas a brindarles cuidado, felicidad y un futuro lleno de amor.</p>
                    <p>Trabajamos incansablemente para asegurar que cada adopción sea un éxito, brindando apoyo y recursos tanto a los adoptantes como a los animales.</p>
                    <Link to="/nosotros" className="btn-secondary">Conoce Más Sobre Nosotros</Link>
                </div>
            </section>

            <section className="how-it-works-section" id="ComoFunciona">
                <div className="container">
                    <h2>¿Cómo Funciona?</h2>
                    <div className="steps-grid">
                        <div className="step-item">
                            <i className="fas fa-search"></i> {/* Icono de búsqueda */}
                            <h3>1. Explora</h3>
                            <p>Navega por nuestra galería de mascotas disponibles, filtra por especie, tamaño, ubicación y más.</p>
                        </div>
                        <div className="step-item">
                            <i className="fas fa-heart"></i> {/* Icono de corazón */}
                            <h3>2. Enamórate</h3>
                            <p>Encuentra a tu compañero ideal, conoce su historia y características en detalle.</p>
                        </div>
                        <div className="step-item">
                            <i className="fas fa-file-alt"></i> {/* Icono de formulario */}
                            <h3>3. Solicita</h3>
                            <p>Completa una solicitud de adopción sencilla y nuestro equipo la revisará cuidadosamente.</p>
                        </div>
                        <div className="step-item">
                            <i className="fas fa-home"></i> {/* Icono de casa */}
                            <h3>4. Adopta</h3>
                            <p>¡Dale la bienvenida a tu nuevo amigo a casa y comienza una aventura juntos!</p>
                        </div>
                    </div>
                </div>
            </section>
        </div>
    );
};

export default Home;