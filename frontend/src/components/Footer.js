import React from 'react';
import { Link } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faFacebookF, faInstagram, faTwitter } from '@fortawesome/free-brands-svg-icons';
import '../styles/Footer.css';

const Footer = () => {
    const currentYear = new Date().getFullYear();

    return (
        <footer className="footer">
            <div className="footer-content">
                <div className="footer-section">
                    <h3>Hogar Peludo</h3>
                    <p>Conectando corazones, salvando vidas.</p>
                </div>
                <div className="footer-section">
                    <h3>Enlaces</h3>
                    <ul>
                        <li><Link to="/">Inicio</Link></li>
                        <li><Link to="/mascotas">Mascotas</Link></li>
                        <li><Link to="/fundaciones">Fundaciones</Link></li>
                    </ul>
                </div>
                <div className="footer-section">
                    <h3>Contacto</h3>
                    <p>info@hogarpeludo.com</p>
                    <div className="social-links">
                        <a href="https://facebook.com" target="_blank" rel="noopener noreferrer"><FontAwesomeIcon icon={faFacebookF} /></a>
                        <a href="https://instagram.com" target="_blank" rel="noopener noreferrer"><FontAwesomeIcon icon={faInstagram} /></a>
                        <a href="https://twitter.com" target="_blank" rel="noopener noreferrer"><FontAwesomeIcon icon={faTwitter} /></a>
                    </div>
                </div>
            </div>
            <div className="footer-bottom">
                <p>&copy; {currentYear} Hogar Peludo. Todos los derechos reservados.</p>
            </div>
        </footer>
    );
};

export default Footer;