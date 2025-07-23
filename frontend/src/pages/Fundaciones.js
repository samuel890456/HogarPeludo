import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  BuildingOfficeIcon,
  MapPinIcon,
  PhoneIcon,
  EnvelopeIcon,
  GlobeAltIcon,
  HeartIcon,
  UserGroupIcon,
  MagnifyingGlassIcon,
  StarIcon
} from '@heroicons/react/24/outline';
import { StarIcon as StarSolidIcon } from '@heroicons/react/24/solid';
import LoadingSpinner from '../components/LoadingSpinner';

const Fundaciones = () => {
  const [fundaciones, setFundaciones] = useState([]);
  const [filteredFundaciones, setFilteredFundaciones] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');

  // Datos de ejemplo para las fundaciones
  const fundacionesData = [
    {
      id: 1,
      nombre: 'Fundación Patitas de Amor',
      descripcion: 'Dedicada al rescate y cuidado de perros y gatos abandonados. Brindamos atención veterinaria, alimentación y buscamos hogares amorosos para nuestros peludos.',
      ubicacion: 'Bogotá, Colombia',
      telefono: '+57 300 123 4567',
      email: 'info@patitasdeamor.org',
      website: 'www.patitasdeamor.org',
      mascotas_disponibles: 25,
      fundacion_desde: 2018,
      calificacion: 4.8,
      imagen: '/images/logo-mascotas.png',
      especialidad: 'Perros y Gatos',
      horario: 'Lun - Vie: 8:00 AM - 6:00 PM'
    },
    {
      id: 2,
      nombre: 'Rescate Animal Colombia',
      descripcion: 'Organización sin fines de lucro que trabaja por el bienestar animal. Realizamos campañas de esterilización, rescate de emergencia y educación sobre tenencia responsable.',
      ubicacion: 'Medellín, Colombia',
      telefono: '+57 310 987 6543',
      email: 'contacto@rescateanimal.co',
      website: 'www.rescateanimal.co',
      mascotas_disponibles: 18,
      fundacion_desde: 2015,
      calificacion: 4.9,
      imagen: '/images/logo-mascotas.png',
      especialidad: 'Todo tipo de animales',
      horario: 'Lun - Dom: 9:00 AM - 7:00 PM'
    },
    {
      id: 3,
      nombre: 'Hogar Temporal Felino',
      descripcion: 'Especialistas en el rescate y adopción de gatos. Proporcionamos refugio temporal, atención médica y buscamos familias comprometidas para nuestros felinos.',
      ubicacion: 'Cali, Colombia',
      telefono: '+57 315 456 7890',
      email: 'adopciones@hogarfelino.com',
      website: 'www.hogarfelino.com',
      mascotas_disponibles: 12,
      fundacion_desde: 2020,
      calificacion: 4.7,
      imagen: '/images/logo-mascotas.png',
      especialidad: 'Gatos',
      horario: 'Mar - Sáb: 10:00 AM - 5:00 PM'
    },
    {
      id: 4,
      nombre: 'Amigos de los Animales',
      descripcion: 'Fundación comprometida con el rescate, rehabilitación y reubicación de animales en situación de vulnerabilidad. Trabajamos con voluntarios dedicados.',
      ubicacion: 'Barranquilla, Colombia',
      telefono: '+57 320 111 2222',
      email: 'ayuda@amigosanimales.org',
      website: 'www.amigosanimales.org',
      mascotas_disponibles: 30,
      fundacion_desde: 2012,
      calificacion: 4.6,
      imagen: '/images/logo-mascotas.png',
      especialidad: 'Perros, Gatos y Aves',
      horario: 'Lun - Dom: 7:00 AM - 8:00 PM'
    }
  ];

  useEffect(() => {
    // Simular carga de datos
    setTimeout(() => {
      setFundaciones(fundacionesData);
      setFilteredFundaciones(fundacionesData);
      setLoading(false);
    }, 1000);
  }, []);

  useEffect(() => {
    const filtered = fundaciones.filter(fundacion =>
      fundacion.nombre.toLowerCase().includes(searchTerm.toLowerCase()) ||
      fundacion.ubicacion.toLowerCase().includes(searchTerm.toLowerCase()) ||
      fundacion.especialidad.toLowerCase().includes(searchTerm.toLowerCase())
    );
    setFilteredFundaciones(filtered);
  }, [fundaciones, searchTerm]);

  const renderStars = (rating) => {
    const stars = [];
    const fullStars = Math.floor(rating);
    const hasHalfStar = rating % 1 !== 0;

    for (let i = 0; i < fullStars; i++) {
      stars.push(<StarSolidIcon key={i} className="w-4 h-4 text-yellow-400" />);
    }

    if (hasHalfStar) {
      stars.push(<StarIcon key="half" className="w-4 h-4 text-yellow-400" />);
    }

    const emptyStars = 5 - Math.ceil(rating);
    for (let i = 0; i < emptyStars; i++) {
      stars.push(<StarIcon key={`empty-${i}`} className="w-4 h-4 text-gray-300" />);
    }

    return stars;
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero Section */}
      <section className="bg-gradient-to-br from-blue-500 to-purple-600 text-white py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="text-center"
          >
            <h1 className="text-4xl lg:text-5xl font-bold mb-4">
              Fundaciones Aliadas
            </h1>
            <p className="text-xl text-blue-100 max-w-3xl mx-auto">
              Conoce a las organizaciones comprometidas con el bienestar animal 
              que hacen posible nuestra misión de conectar mascotas con familias amorosas.
            </p>
          </motion.div>
        </div>
      </section>

      {/* Search Section */}
      <section className="py-8 bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-md mx-auto">
            <div className="relative">
              <MagnifyingGlassIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
              <input
                type="text"
                placeholder="Buscar fundaciones..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
              />
            </div>
          </div>
        </div>
      </section>

      {/* Fundaciones Grid */}
      <section className="py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Results Header */}
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">
              Nuestras Fundaciones Aliadas
            </h2>
            <p className="text-gray-600">
              {filteredFundaciones.length} fundación{filteredFundaciones.length !== 1 ? 'es' : ''} encontrada{filteredFundaciones.length !== 1 ? 's' : ''}
              {searchTerm && ' con tu búsqueda'}
            </p>
          </div>

          {/* Loading State */}
          {loading ? (
            <div className="flex justify-center items-center py-20">
              <LoadingSpinner size="lg" color="blue" />
            </div>
          ) : filteredFundaciones.length === 0 ? (
            /* Empty State */
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="text-center py-20"
            >
              <div className="w-24 h-24 mx-auto mb-6 bg-gray-100 rounded-full flex items-center justify-center">
                <BuildingOfficeIcon className="w-12 h-12 text-gray-400" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">
                No se encontraron fundaciones
              </h3>
              <p className="text-gray-600">
                {searchTerm 
                  ? 'Intenta con otros términos de búsqueda'
                  : 'No hay fundaciones disponibles en este momento'
                }
              </p>
            </motion.div>
          ) : (
            /* Fundaciones Grid */
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              <AnimatePresence>
                {filteredFundaciones.map((fundacion, index) => (
                  <motion.div
                    key={fundacion.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5, delay: index * 0.1 }}
                    exit={{ opacity: 0, y: -20 }}
                    className="bg-white rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 overflow-hidden"
                  >
                    {/* Header */}
                    <div className="relative h-48 bg-gradient-to-br from-blue-500 to-purple-600">
                      <div className="absolute inset-0 bg-black/20"></div>
                      <div className="absolute top-4 left-4">
                        {/* Badge de estado */}
                        {fundacion.aprobacion && (
                          <span className={`inline-block px-3 py-1 rounded-full text-xs font-semibold 
                            ${fundacion.aprobacion === 'aprobada' ? 'bg-green-100 text-green-700' : ''}
                            ${fundacion.aprobacion === 'pendiente' ? 'bg-yellow-100 text-yellow-700' : ''}
                            ${fundacion.aprobacion === 'rechazada' ? 'bg-red-100 text-red-700' : ''}
                          `}>
                            {fundacion.aprobacion.charAt(0).toUpperCase() + fundacion.aprobacion.slice(1)}
                          </span>
                        )}
                      </div>
                      <div className="absolute top-4 right-4">
                        <div className="flex items-center space-x-2">
                          {renderStars(fundacion.calificacion)}
                          <span className="text-white text-sm font-medium">
                            {fundacion.calificacion}
                          </span>
                        </div>
                      </div>
                      <div className="absolute bottom-4 left-4 right-4">
                        <h3 className="text-2xl font-bold text-white mb-1">
                          {fundacion.nombre}
                        </h3>
                        <div className="flex items-center text-blue-100">
                          <MapPinIcon className="w-4 h-4 mr-2" />
                          <span className="text-sm">{fundacion.ubicacion}</span>
                        </div>
                      </div>
                    </div>

                    {/* Content */}
                    <div className="p-6">
                      <p className="text-gray-600 mb-6 leading-relaxed">
                        {fundacion.descripcion}
                      </p>

                      {/* Stats */}
                      <div className="grid grid-cols-2 gap-4 mb-6">
                        <div className="text-center p-3 bg-blue-50 rounded-lg">
                          <div className="text-2xl font-bold text-blue-600">
                            {fundacion.mascotas_disponibles}
                          </div>
                          <div className="text-sm text-gray-600">Mascotas</div>
                        </div>
                        <div className="text-center p-3 bg-purple-50 rounded-lg">
                          <div className="text-2xl font-bold text-purple-600">
                            {new Date().getFullYear() - fundacion.fundacion_desde}
                          </div>
                          <div className="text-sm text-gray-600">Años</div>
                        </div>
                      </div>

                      {/* Details */}
                      <div className="space-y-3 mb-6">
                        <div className="flex items-center text-gray-600">
                          <BuildingOfficeIcon className="w-4 h-4 mr-3 text-blue-500" />
                          <span className="text-sm">{fundacion.especialidad}</span>
                        </div>
                        <div className="flex items-center text-gray-600">
                          <PhoneIcon className="w-4 h-4 mr-3 text-blue-500" />
                          <span className="text-sm">{fundacion.telefono}</span>
                        </div>
                        <div className="flex items-center text-gray-600">
                          <EnvelopeIcon className="w-4 h-4 mr-3 text-blue-500" />
                          <span className="text-sm">{fundacion.email}</span>
                        </div>
                        {fundacion.website && (
                          <div className="flex items-center text-gray-600">
                            <GlobeAltIcon className="w-4 h-4 mr-3 text-blue-500" />
                            <a 
                              href={`https://${fundacion.website}`} 
                              target="_blank" 
                              rel="noopener noreferrer"
                              className="text-sm text-blue-600 hover:text-blue-800 transition-colors duration-200"
                            >
                              {fundacion.website}
                            </a>
                          </div>
                        )}
                      </div>

                      {/* Actions */}
                      <div className="flex space-x-3">
                        <Link
                          to={`/fundaciones/${fundacion.id}`}
                          className="flex-1 inline-flex items-center justify-center px-4 py-3 bg-gradient-to-r from-blue-500 to-purple-500 text-white font-semibold rounded-xl hover:from-blue-600 hover:to-purple-600 transition-all duration-200 shadow-md hover:shadow-lg"
                        >
                          <HeartIcon className="w-5 h-5 mr-2" />
                          Ver Mascotas
                        </Link>
                        <button className="px-4 py-3 border-2 border-blue-500 text-blue-600 font-semibold rounded-xl hover:bg-blue-50 transition-all duration-200">
                          <PhoneIcon className="w-5 h-5" />
                        </button>
                      </div>
                    </div>
                  </motion.div>
                ))}
              </AnimatePresence>
            </div>
          )}
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 bg-gradient-to-br from-blue-500 to-purple-600">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
          >
            <h2 className="text-3xl lg:text-4xl font-bold text-white mb-6">
              ¿Eres una fundación?
            </h2>
            <p className="text-xl text-blue-100 mb-8 leading-relaxed">
              Únete a nuestra red de fundaciones aliadas y ayuda a más mascotas 
              a encontrar su hogar para siempre.
            </p>
            <Link
              to="/registrarse"
              className="inline-flex items-center justify-center px-8 py-4 bg-white text-blue-600 font-semibold rounded-xl shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-200"
            >
              <BuildingOfficeIcon className="w-5 h-5 mr-2" />
              Registra tu Fundación
            </Link>
          </motion.div>
        </div>
      </section>
    </div>
  );
};

export default Fundaciones;