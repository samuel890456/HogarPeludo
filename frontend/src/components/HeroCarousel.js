// frontend/src/components/HeroCarousel.js
import React, { useState, useEffect } from 'react';
import '../styles/HeroCarousel.css'; // Crearemos este archivo CSS

const HeroCarousel = ({ images, interval = 5000 }) => {
    const [currentIndex, setCurrentIndex] = useState(0);

    // Efecto para el cambio automático de diapositivas
    useEffect(() => {
        const timer = setInterval(() => {
            setCurrentIndex((prevIndex) =>
                prevIndex === images.length - 1 ? 0 : prevIndex + 1
            );
        }, interval);

        return () => clearInterval(timer); // Limpia el temporizador al desmontar el componente
    }, [images, interval]);

    const goToPrevious = () => {
        const isFirstSlide = currentIndex === 0;
        const newIndex = isFirstSlide ? images.length - 1 : currentIndex - 1;
        setCurrentIndex(newIndex);
    };

    const goToNext = () => {
        const isLastSlide = currentIndex === images.length - 1;
        const newIndex = isLastSlide ? 0 : currentIndex + 1;
        setCurrentIndex(newIndex);
    };

    const goToSlide = (slideIndex) => {
        setCurrentIndex(slideIndex);
    };

    return (
        <div className="hero-carousel">
            <div className="carousel-slide" style={{ backgroundImage: `url(${images[currentIndex]})` }}>
                {/* Contenido superpuesto si lo deseas, como el título y botón */}
                <div className="hero-content">
                    <h1>Tu Mejor Amigo te Está Esperando</h1>
                    <p>Miles de peluditos buscan un hogar lleno de amor. ¡Encuentra el tuyo hoy!</p>
                    {/* El botón lo manejará el Home.js, o puedes pasar un children para este contenido */}
                </div>
            </div>

            {/* Flechas de navegación */}
            <button className="carousel-arrow left-arrow" onClick={goToPrevious} aria-label="Anterior">
                &#10094; {/* Carácter de flecha izquierda */}
            </button>
            <button className="carousel-arrow right-arrow" onClick={goToNext} aria-label="Siguiente">
                &#10095; {/* Carácter de flecha derecha */}
            </button>

            {/* Puntos de navegación (indicadores) */}
            <div className="carousel-dots">
                {images.map((_, slideIndex) => (
                    <span
                        key={slideIndex}
                        className={`dot ${currentIndex === slideIndex ? 'active' : ''}`}
                        onClick={() => goToSlide(slideIndex)}
                        aria-label={`Ir a la diapositiva ${slideIndex + 1}`}
                    ></span>
                ))}
            </div>
        </div>
    );
};

export default HeroCarousel;