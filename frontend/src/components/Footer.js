// frontend/src/components/Footer.js
import React from 'react';
import { Link } from 'react-router-dom';
import '../styles/Footer.css'; // Asegúrate de crear este archivo CSS
// En Footer.js, arriba del todo
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faFacebookF, faInstagram, faTwitter } from '@fortawesome/free-brands-svg-icons';
import { faMapMarkerAlt, faEnvelope, faPhone } from '@fortawesome/free-solid-svg-icons';

// ... y luego en el JSX, usas:
// <FontAwesomeIcon icon={faFacebookF} />
const Footer = () => {
    // Puedes personalizar la información de contacto y enlaces
    const currentYear = new Date().getFullYear();

    return (
        <footer className="footer">
            <div className="footer-content">
                <div className="footer-section footer-about">
                    <h3>Adopta una Mascota</h3>
                    <p>Conectando corazones, salvando vidas. Ayúdanos a encontrar un hogar amoroso para cada peludo.</p>
                    <div className="social-links">
                        <a href="https://facebook.com" target="_blank" rel="noopener noreferrer">
                            <i className="fab fa-facebook-f"></i> {/* Icono de Facebook */}
                        </a>
                        <a href="https://instagram.com" target="_blank" rel="noopener noreferrer">
                            <i className="fab fa-instagram"></i> {/* Icono de Instagram */}
                        </a>
                        <a href="https://twitter.com" target="_blank" rel="noopener noreferrer">
                            <i className="fab fa-twitter"></i> {/* Icono de Twitter/X */}
                        </a>
                    </div>
                </div>

                <div className="footer-section footer-links">
                    <h3>Enlaces Rápidos</h3>
                    <ul>
                        <li><Link to="/">Inicio</Link></li>
                        <li><Link to="/mascotas">Mascotas Disponibles</Link></li>
                        <li><Link to="/adopciones">Proceso de Adopción</Link></li>
                        {/* Puedes añadir más enlaces relevantes aquí */}
                        <li><Link to="/contacto">Contacto</Link></li>
                    </ul>
                </div>

                <div className="footer-section footer-contact">
                    <h3>Contáctanos</h3>
                    <p><i className="fas fa-map-marker-alt"></i> Turbo, Antioquia, Colombia</p>
                    <p><i className="fas fa-envelope"></i> info@adoptanamascota.com</p>
                    <p><i className="fas fa-phone"></i> +57 300 123 4567</p>
                </div>
            </div>

            <div className="footer-bottom">
                <p>&copy; {currentYear} Adopta una Mascota. Todos los derechos reservados.</p>
                <div className="legal-links">
                    <Link to="/politica-privacidad">Política de Privacidad</Link>
                    <Link to="/terminos-servicio">Términos de Servicio</Link>
                </div>
            </div>
        </footer>
    );
};

export default Footer;