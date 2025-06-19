import React, { useMemo } from 'react';
import { Link } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faFacebookF, faInstagram, faTwitter } from '@fortawesome/free-brands-svg-icons';
import { faMapMarkerAlt, faEnvelope, faPhone } from '@fortawesome/free-solid-svg-icons';
import '../styles/Footer.css';

/**
 * Componente de pie de página (Footer) para la aplicación.
 * Muestra información de contacto, enlaces rápidos y enlaces a redes sociales.
 */
const Footer = () => {
    // Usamos useMemo para calcular el año actual una sola vez y no en cada render.
    const currentYear = useMemo(() => new Date().getFullYear(), []);

    return (
        <footer className="footer" role="contentinfo" aria-label="Pie de página del sitio web">
            <div className="footer-content">
                {/* Sección "Sobre Nosotros" */}
                <div className="footer-section footer-about">
                    <h3>Adopta una Mascota</h3>
                    <p>Conectando corazones, salvando vidas. Ayúdanos a encontrar un hogar amoroso para cada peludo.</p>
                    <div className="social-links">
                        <a href="https://facebook.com" target="_blank" rel="noopener noreferrer" aria-label="Visítanos en Facebook">
                            <FontAwesomeIcon icon={faFacebookF} />
                        </a>
                        <a href="https://instagram.com" target="_blank" rel="noopener noreferrer" aria-label="Visítanos en Instagram">
                            <FontAwesomeIcon icon={faInstagram} />
                        </a>
                        <a href="https://twitter.com" target="_blank" rel="noopener noreferrer" aria-label="Visítanos en Twitter">
                            <FontAwesomeIcon icon={faTwitter} />
                        </a>
                    </div>
                </div>

                {/* Sección de Enlaces Rápidos */}
                <div className="footer-section footer-links">
                    <h3>Enlaces Rápidos</h3>
                    <ul>
                        <li><Link to="/">Inicio</Link></li>
                        <li><Link to="/mascotas">Mascotas Disponibles</Link></li>
                        <li><Link to="/adopciones">Proceso de Adopción</Link></li>
                        {/* Puedes añadir más enlaces relevantes aquí si es necesario */}
                        <li><Link to="/contacto">Contacto</Link></li>
                    </ul>
                </div>

                {/* Sección de Contacto */}
                <div className="footer-section footer-contact">
                    <h3>Contáctanos</h3>
                    <p>
                        <FontAwesomeIcon icon={faMapMarkerAlt} />
                        <span>Turbo, Antioquia, Colombia</span>
                    </p>
                    <p>
                        <FontAwesomeIcon icon={faEnvelope} />
                        <span>info@adoptanamascota.com</span>
                    </p>
                    <p>
                        <FontAwesomeIcon icon={faPhone} />
                        <span>+57 300 123 4567</span>
                    </p>
                </div>
            </div>

            {/* Sección inferior del footer (Copyright y enlaces legales) */}
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