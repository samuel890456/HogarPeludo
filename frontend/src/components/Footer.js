import React from 'react';
import { Link } from 'react-router-dom';
import { 
  HeartIcon, 
  HomeIcon, 
  BuildingOfficeIcon, 
  UserGroupIcon,
  PhoneIcon,
  EnvelopeIcon,
  MapPinIcon
} from '@heroicons/react/24/outline';

const Footer = () => {
  const currentYear = new Date().getFullYear();

  const footerLinks = {
    mascotas: [
      { name: 'Ver Mascotas', href: '/mascotas' },
      { name: 'Publicar Mascota', href: '/publicar-mascota' },
      { name: 'Proceso de Adopción', href: '/mascotas' },
      { name: 'Cuidados Básicos', href: '/mascotas' }
    ],
    fundaciones: [
      { name: 'Ver Fundaciones', href: '/fundaciones' },
      { name: 'Registrar Fundación', href: '/fundaciones' },
      { name: 'Cómo Ayudar', href: '/fundaciones' },
      { name: 'Donaciones', href: '/fundaciones' }
    ],
    soporte: [
      { name: 'Centro de Ayuda', href: '/ayuda' },
      { name: 'Contacto', href: '/contacto' },
      { name: 'Reportar Problema', href: '/reportar' },
      { name: 'FAQ', href: '/faq' }
    ]
  };

  return (
    <footer className="bg-gray-900 text-white">
      {/* Main Footer Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {/* Brand Section */}
          <div className="lg:col-span-1">
            <div className="flex items-center space-x-3 mb-6">
              <div className="w-12 h-12 bg-gradient-to-br from-orange-400 to-pink-500 rounded-xl flex items-center justify-center shadow-lg">
                <HeartIcon className="w-7 h-7 text-white" />
              </div>
              <div>
                <h3 className="text-xl font-bold bg-gradient-to-r from-orange-400 to-pink-400 bg-clip-text text-transparent">
                  Hogar Peludo
                </h3>
                <p className="text-gray-400 text-sm">Adopta con amor</p>
              </div>
            </div>
            <p className="text-gray-400 mb-6 leading-relaxed">
              Conectamos mascotas que necesitan un hogar con familias que buscan 
              amor incondicional. Juntos hacemos la diferencia.
            </p>
            <div className="flex space-x-4">
              <a
                href="#"
                className="w-10 h-10 bg-gray-800 rounded-lg flex items-center justify-center hover:bg-orange-500 transition-colors duration-200"
                aria-label="Facebook"
              >
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
                </svg>
              </a>
              <a
                href="#"
                className="w-10 h-10 bg-gray-800 rounded-lg flex items-center justify-center hover:bg-orange-500 transition-colors duration-200"
                aria-label="Instagram"
              >
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M12.017 0C5.396 0 .029 5.367.029 11.987c0 6.62 5.367 11.987 11.988 11.987 6.62 0 11.987-5.367 11.987-11.987C24.014 5.367 18.637.001 12.017.001zM8.449 16.988c-1.297 0-2.448-.49-3.323-1.297C4.198 14.895 3.708 13.744 3.708 12.447s.49-2.448 1.418-3.323c.875-.807 2.026-1.297 3.323-1.297s2.448.49 3.323 1.297c.928.875 1.418 2.026 1.418 3.323s-.49 2.448-1.418 3.244c-.875.807-2.026 1.297-3.323 1.297zm7.83-9.781c-.49 0-.928-.175-1.297-.49-.368-.315-.49-.753-.49-1.243 0-.49.122-.928.49-1.243.369-.315.807-.49 1.297-.49s.928.175 1.297.49c.368.315.49.753.49 1.243 0 .49-.122.928-.49 1.243-.369.315-.807.49-1.297.49z"/>
                </svg>
              </a>
              <a
                href="#"
                className="w-10 h-10 bg-gray-800 rounded-lg flex items-center justify-center hover:bg-orange-500 transition-colors duration-200"
                aria-label="Twitter"
              >
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M23.953 4.57a10 10 0 01-2.825.775 4.958 4.958 0 002.163-2.723c-.951.555-2.005.959-3.127 1.184a4.92 4.92 0 00-8.384 4.482C7.69 8.095 4.067 6.13 1.64 3.162a4.822 4.822 0 00-.666 2.475c0 1.71.87 3.213 2.188 4.096a4.904 4.904 0 01-2.228-.616v.06a4.923 4.923 0 003.946 4.827 4.996 4.996 0 01-2.212.085 4.936 4.936 0 004.604 3.417 9.867 9.867 0 01-6.102 2.105c-.39 0-.779-.023-1.17-.067a13.995 13.995 0 007.557 2.209c9.053 0 13.998-7.496 13.998-13.985 0-.21 0-.42-.015-.63A9.935 9.935 0 0024 4.59z"/>
                </svg>
              </a>
            </div>
          </div>

          {/* Mascotas Links */}
          <div>
            <h4 className="text-lg font-semibold mb-6 flex items-center">
              <HeartIcon className="w-5 h-5 mr-2 text-orange-400" />
              Mascotas
            </h4>
            <ul className="space-y-3">
              {footerLinks.mascotas.map((link) => (
                <li key={link.name}>
                  <Link
                    to={link.href}
                    className="text-gray-400 hover:text-orange-400 transition-colors duration-200 text-sm"
                  >
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Fundaciones Links */}
          <div>
            <h4 className="text-lg font-semibold mb-6 flex items-center">
              <BuildingOfficeIcon className="w-5 h-5 mr-2 text-orange-400" />
              Fundaciones
            </h4>
            <ul className="space-y-3">
              {footerLinks.fundaciones.map((link) => (
                <li key={link.name}>
                  <Link
                    to={link.href}
                    className="text-gray-400 hover:text-orange-400 transition-colors duration-200 text-sm"
                  >
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact Info */}
          <div>
            <h4 className="text-lg font-semibold mb-6 flex items-center">
              <UserGroupIcon className="w-5 h-5 mr-2 text-orange-400" />
              Contacto
            </h4>
            <div className="space-y-4">
              <div className="flex items-center text-gray-400">
                <PhoneIcon className="w-5 h-5 mr-3 text-orange-400" />
                <span className="text-sm">+1 (555) 123-4567</span>
              </div>
              <div className="flex items-center text-gray-400">
                <EnvelopeIcon className="w-5 h-5 mr-3 text-orange-400" />
                <span className="text-sm">info@hogarpeludo.com</span>
              </div>
              <div className="flex items-center text-gray-400">
                <MapPinIcon className="w-5 h-5 mr-3 text-orange-400" />
                <span className="text-sm">Bogotá, Colombia</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Bottom Bar */}
      <div className="border-t border-gray-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex flex-col md:flex-row justify-between items-center space-y-4 md:space-y-0">
            <div className="text-gray-400 text-sm">
              © {currentYear} Hogar Peludo. Todos los derechos reservados.
            </div>
            <div className="flex space-x-6 text-sm">
              <Link
                to="/privacidad"
                className="text-gray-400 hover:text-orange-400 transition-colors duration-200"
              >
                Política de Privacidad
              </Link>
              <Link
                to="/terminos"
                className="text-gray-400 hover:text-orange-400 transition-colors duration-200"
              >
                Términos de Servicio
              </Link>
              <Link
                to="/cookies"
                className="text-gray-400 hover:text-orange-400 transition-colors duration-200"
              >
                Política de Cookies
              </Link>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;