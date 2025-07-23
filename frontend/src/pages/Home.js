import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { 
  HeartIcon, 
  HomeIcon, 
  ShieldCheckIcon, 
  UserGroupIcon,
  ArrowRightIcon,
  StarIcon,
  MapPinIcon,
  CalendarIcon,
  PlusCircleIcon // Importar el icono para Publicar Mascota
} from '@heroicons/react/24/outline';
import { HeartIcon as HeartSolidIcon } from '@heroicons/react/24/solid';
import HeroCarousel from '../components/HeroCarousel';
import MascotaCard from '../components/MascotaCard';
import { getMascotas } from '../api/api';
import useAuthStore from '../store/authStore'; // Importar el store de autenticación

const Home = () => {
  const [mascotasDestacadas, setMascotasDestacadas] = useState([]);
  const [loading, setLoading] = useState(true);
  const { isLoggedIn, user } = useAuthStore(); // Obtener el estado de autenticación

  useEffect(() => {
    const cargarMascotasDestacadas = async () => {
      try {
        const mascotas = await getMascotas();
        // Filtrar mascotas destacadas (puedes ajustar la lógica según tus necesidades)
        const destacadas = mascotas.slice(0, 6);
        setMascotasDestacadas(destacadas);
      } catch (error) {
        console.error('Error al cargar mascotas destacadas:', error);
      } finally {
        setLoading(false);
      }
    };

    cargarMascotasDestacadas();
  }, []);

  const features = [
    {
      icon: HeartIcon,
      title: 'Adopción Responsable',
      description: 'Encuentra a tu compañero perfecto y dale una segunda oportunidad a una mascota que necesita amor.',
      color: 'from-pink-500 to-rose-500'
    },
    {
      icon: ShieldCheckIcon,
      title: 'Verificación Completa',
      description: 'Todas nuestras mascotas pasan por un proceso de verificación médica y de comportamiento.',
      color: 'from-blue-500 to-cyan-500'
    },
    {
      icon: UserGroupIcon,
      title: 'Comunidad Solidaria',
      description: 'Únete a una comunidad de amantes de animales comprometidos con el bienestar animal.',
      color: 'from-green-500 to-emerald-500'
    },
    {
      icon: HomeIcon,
      title: 'Seguimiento Post-Adopción',
      description: 'Te acompañamos en todo el proceso de adaptación y te brindamos apoyo continuo.',
      color: 'from-purple-500 to-violet-500'
    }
  ];

  const stats = [
    { number: '500+', label: 'Mascotas Adoptadas', icon: HeartIcon },
    { number: '50+', label: 'Fundaciones Aliadas', icon: HomeIcon },
    { number: '1000+', label: 'Familias Felices', icon: UserGroupIcon },
    { number: '24/7', label: 'Soporte Disponible', icon: ShieldCheckIcon }
  ];

  // Determinar si el usuario tiene el rol de publicador (usuario o refugio)
  const isPublicador = isLoggedIn && user && (user.roles.includes('usuario') || user.roles.includes('refugio'));

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="relative bg-gradient-to-br from-orange-50 via-pink-50 to-purple-50 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-orange-100/30 to-pink-100/30 opacity-50"></div>
        
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 lg:py-32">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <motion.div
              initial={{ opacity: 0, x: -50 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8 }}
              className="text-center lg:text-left"
            >
              <h1 className="text-4xl lg:text-6xl font-bold text-gray-900 mb-6">
                Encuentra tu
                <span className="block bg-gradient-to-r from-orange-600 to-pink-600 bg-clip-text text-transparent">
                  compañero perfecto
                </span>
              </h1>
              <p className="text-xl text-gray-600 mb-8 leading-relaxed">
                Miles de mascotas esperan encontrar un hogar lleno de amor. 
                Únete a nuestra comunidad y cambia una vida para siempre.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start">
                <Link
                  to="/mascotas"
                  className="inline-flex items-center justify-center px-8 py-4 bg-gradient-to-r from-orange-500 to-pink-500 text-white font-semibold rounded-xl shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-200"
                >
                  Ver Mascotas
                  <ArrowRightIcon className="w-5 h-5 ml-2" />
                </Link>
                <Link
                  to="/fundaciones"
                  className="inline-flex items-center justify-center px-8 py-4 border-2 border-orange-500 text-orange-600 font-semibold rounded-xl hover:bg-orange-50 transition-all duration-200"
                >
                  Conoce Fundaciones
                </Link>
              </div>
            </motion.div>
            
            <motion.div
              initial={{ opacity: 0, x: 50 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8, delay: 0.2 }}
              className="relative"
            >
              <div className="relative z-10">
                <HeroCarousel />
              </div>
              <div className="absolute -inset-4 bg-gradient-to-r from-orange-400/20 to-pink-400/20 rounded-3xl blur-2xl"></div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-8">
            {stats.map((stat, index) => (
              <motion.div
                key={stat.label}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                className="text-center"
              >
                <div className="w-16 h-16 mx-auto mb-4 bg-gradient-to-br from-orange-400 to-pink-500 rounded-2xl flex items-center justify-center shadow-lg">
                  <stat.icon className="w-8 h-8 text-white" />
                </div>
                <div className="text-3xl lg:text-4xl font-bold text-gray-900 mb-2">
                  {stat.number}
                </div>
                <div className="text-gray-600 font-medium">
                  {stat.label}
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className="text-3xl lg:text-4xl font-bold text-gray-900 mb-4">
              ¿Por qué elegir Hogar Peludo?
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Nos comprometemos a hacer que el proceso de adopción sea seguro, 
              transparente y lleno de amor para todas las partes involucradas.
            </p>
          </motion.div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {features.map((feature, index) => (
              <motion.div
                key={feature.title}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                viewport={{ once: true }}
                className="bg-white rounded-2xl p-8 shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-2"
              >
                <div className={`w-16 h-16 bg-gradient-to-br ${feature.color} rounded-2xl flex items-center justify-center mb-6 shadow-lg`}>
                  <feature.icon className="w-8 h-8 text-white" />
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-4">
                  {feature.title}
                </h3>
                <p className="text-gray-600 leading-relaxed">
                  {feature.description}
                </p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Mascotas Destacadas Section */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className="text-3xl lg:text-4xl font-bold text-gray-900 mb-4">
              Mascotas Destacadas
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Conoce a algunos de nuestros amigos peludos que están buscando 
              un hogar lleno de amor y cariño.
            </p>
          </motion.div>

          {loading ? (
            <div className="flex justify-center items-center py-20">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-orange-500"></div>
            </div>
          ) : (
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
              {mascotasDestacadas.map((mascota, index) => (
                <motion.div
                  key={mascota.id}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: index * 0.1 }}
                  viewport={{ once: true }}
                >
                  <MascotaCard mascota={mascota} />
                </motion.div>
              ))}
            </div>
          )}

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.3 }}
            viewport={{ once: true }}
            className="text-center mt-12"
          >
            <Link
              to="/mascotas"
              className="inline-flex items-center justify-center px-8 py-4 bg-gradient-to-r from-orange-500 to-pink-500 text-white font-semibold rounded-xl shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-200"
            >
              Ver Todas las Mascotas
              <ArrowRightIcon className="w-5 h-5 ml-2" />
            </Link>
          </motion.div>
        </div>
      </section>

      {/* Publicar Mascota CTA Section */}
      <section className="py-20 bg-gradient-to-br from-green-500 to-teal-600">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
          >
            {isLoggedIn && isPublicador ? (
              <>
                <h2 className="text-3xl lg:text-4xl font-bold text-white mb-6">
                  ¿Tienes una mascota en adopción?
                </h2>
                <p className="text-xl text-green-100 mb-8 leading-relaxed">
                  Ayúdanos a encontrarle un hogar. Publica su perfil en nuestra plataforma y conéctate con adoptantes responsables.
                </p>
                <Link
                  to="/publicar-mascota"
                  className="inline-flex items-center justify-center px-8 py-4 bg-white text-green-600 font-semibold rounded-xl shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-200"
                >
                  <PlusCircleIcon className="w-5 h-5 mr-2" />
                  Publicar Mascota
                </Link>
              </>
            ) : isLoggedIn ? (
              <>
                <h2 className="text-3xl lg:text-4xl font-bold text-white mb-6">
                  ¿Quieres publicar una mascota en adopción?
                </h2>
                <p className="text-xl text-green-100 mb-8 leading-relaxed">
                  Para publicar una mascota, necesitas tener el rol de publicador. Contacta a un administrador para solicitar este rol.
                </p>
                {/* Aquí podrías añadir un botón para contactar al admin o ir a una página de ayuda */}
              </>
            ) : (
              <>
                <h2 className="text-3xl lg:text-4xl font-bold text-white mb-6">
                  ¿Tienes una mascota en adopción?
                </h2>
                <p className="text-xl text-green-100 mb-8 leading-relaxed">
                  Regístrate hoy mismo y ayúdanos a encontrarle un hogar a tu mascota. Es rápido, fácil y gratuito.
                </p>
                <Link
                  to="/registrarse"
                  className="inline-flex items-center justify-center px-8 py-4 bg-white text-green-600 font-semibold rounded-xl shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-200"
                >
                  <UserGroupIcon className="w-5 h-5 mr-2" />
                  Regístrate para Publicar
                </Link>
              </>
            )}
          </motion.div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-gradient-to-br from-orange-500 to-pink-600">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
          >
            <h2 className="text-3xl lg:text-4xl font-bold text-white mb-6">
              ¿Listo para cambiar una vida?
            </h2>
            <p className="text-xl text-orange-100 mb-8 leading-relaxed">
              Cada adopción no solo cambia la vida de una mascota, 
              sino que también enriquece la tuya con amor incondicional.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link
                to="/registrarse"
                className="inline-flex items-center justify-center px-8 py-4 bg-white text-orange-600 font-semibold rounded-xl shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-200"
              >
                Crear Cuenta
                <ArrowRightIcon className="w-5 h-5 ml-2" />
              </Link>
              <Link
                to="/mascotas"
                className="inline-flex items-center justify-center px-8 py-4 border-2 border-white text-white font-semibold rounded-xl hover:bg-white hover:text-orange-600 transition-all duration-200"
              >
                Explorar Mascotas
              </Link>
            </div>
          </motion.div>
        </div>
      </section>
    </div>
  );
};

export default Home;
