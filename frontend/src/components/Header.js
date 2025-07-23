import React, { useState, useEffect } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  HomeIcon, 
  HeartIcon, 
  BuildingOfficeIcon, 
  UserIcon, 
  BellIcon,
  Bars3Icon,
  XMarkIcon,
  MagnifyingGlassIcon,
  PlusCircleIcon,
  DocumentTextIcon,
  GlobeAltIcon
} from '@heroicons/react/24/outline';
import useAuthStore from '../store/authStore';
import { getUnreadNotifications } from '../api/api';

const Header = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const [unreadNotifications, setUnreadNotifications] = useState([]);
  
  // Usar el estado y las acciones del store de Zustand
  const { 
    isLoggedIn, 
    user, 
    logout, 
    isInitialized, 
    isAdmin, 
    isAuthenticated 
  } = useAuthStore();
  
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 10);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Función para obtener notificaciones no leídas
  const fetchUnreadNotifications = async () => {
    if (isAuthenticated()) {
      try {
        const notifications = await getUnreadNotifications();
        setUnreadNotifications(notifications);
      } catch (error) {
        console.error('Error al obtener notificaciones no leídas:', error);
      }
    }
  };

  // Cargar notificaciones no leídas cuando el usuario está logueado
  useEffect(() => {
    fetchUnreadNotifications();
    
    // Actualizar notificaciones cada 30 segundos
    const interval = setInterval(fetchUnreadNotifications, 30000);
    
    return () => clearInterval(interval);
  }, [isLoggedIn]);

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  // Determinar si el usuario tiene el rol de publicador
  const isPublicador = user?.roles?.includes('3'); // Rol 'refugio' (ID 3)
  const userIsAdmin = isAdmin();

  const menuItems = [
    { name: 'Inicio', path: '/', icon: HomeIcon },
    { name: 'Mascotas', path: '/mascotas', icon: HeartIcon },
    { name: 'Fundaciones', path: '/fundaciones', icon: BuildingOfficeIcon },
    { name: 'Campañas', path: '/campanas', icon: DocumentTextIcon },
    { name: 'Noticias', path: '/noticias', icon: GlobeAltIcon },
    ...(isLoggedIn && isPublicador ? [{ name: 'Publicar Mascota', path: '/publicar-mascota', icon: PlusCircleIcon }] : []),
  ];

  const isActive = (path) => location.pathname === path;

  // Si no está inicializado, mostrar loading
  if (!isInitialized) {
    return (
      <header className="fixed top-0 left-0 right-0 z-50 bg-white/95 backdrop-blur-md shadow-lg border-b border-gray-200/50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16 lg:h-20">
            <div className="animate-pulse">
              <div className="h-10 w-32 bg-gray-200 rounded-lg"></div>
            </div>
            <div className="hidden lg:flex space-x-4">
              <div className="animate-pulse">
                <div className="h-8 w-20 bg-gray-200 rounded-lg"></div>
              </div>
              <div className="animate-pulse">
                <div className="h-8 w-24 bg-gray-200 rounded-lg"></div>
              </div>
            </div>
          </div>
        </div>
      </header>
    );
  }

  return (
    <header className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
      isScrolled 
        ? 'bg-white/95 backdrop-blur-md shadow-lg border-b border-gray-200/50' 
        : 'bg-white/90 backdrop-blur-sm'
    }`}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16 lg:h-20">
          {/* Logo */}
          <Link 
            to="/" 
            className="flex items-center space-x-3 group"
            onClick={() => setIsMenuOpen(false)}
          >
            <div className="w-10 h-10 lg:w-12 lg:h-12 bg-gradient-to-br from-orange-400 to-pink-500 rounded-xl flex items-center justify-center shadow-lg group-hover:shadow-xl transition-all duration-300 group-hover:scale-105">
              <HeartIcon className="w-6 h-6 lg:w-7 lg:h-7 text-white" />
            </div>
            <div className="flex flex-col">
              <span className="text-xl lg:text-2xl font-bold bg-gradient-to-r from-orange-600 to-pink-600 bg-clip-text text-transparent">
                Hogar Peludo
              </span>
              <span className="text-xs lg:text-sm text-gray-500 -mt-1">
                Adopta con amor
              </span>
            </div>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden lg:flex items-center space-x-8">
            {menuItems.map((item) => (
              <Link
                key={item.name}
                to={item.path}
                className={`flex items-center space-x-2 px-4 py-2 rounded-lg font-medium transition-all duration-200 ${
                  isActive(item.path)
                    ? 'text-orange-600 bg-orange-50 border border-orange-200'
                    : 'text-gray-700 hover:text-orange-600 hover:bg-orange-50'
                }`}
              >
                <item.icon className="w-5 h-5" />
                <span>{item.name}</span>
              </Link>
            ))}
          </nav>

          {/* Desktop Actions */}
          <div className="hidden lg:flex items-center space-x-4">
            {isLoggedIn ? (
              <>
                <Link
                  to="/notificaciones"
                  className="relative p-2 text-gray-600 hover:text-orange-600 hover:bg-orange-50 rounded-lg transition-all duration-200"
                >
                  <BellIcon className="w-6 h-6" />
                  {unreadNotifications.length > 0 && (
                    <span className="absolute -top-1 -right-1 w-5 h-5 bg-red-500 text-white text-xs rounded-full flex items-center justify-center font-bold">
                      {unreadNotifications.length > 9 ? '9+' : unreadNotifications.length}
                    </span>
                  )}
                </Link>
                
                {userIsAdmin && (
                  <Link
                    to="/admin/dashboard"
                    className="px-4 py-2 bg-gradient-to-r from-purple-600 to-purple-700 text-white rounded-lg font-medium hover:from-purple-700 hover:to-purple-800 transition-all duration-200 shadow-md hover:shadow-lg"
                  >
                    Admin
                  </Link>
                )}
                
                <div className="relative group">
                  <button className="flex items-center space-x-2 p-2 text-gray-700 hover:text-orange-600 hover:bg-orange-50 rounded-lg transition-all duration-200">
                    <div className="w-8 h-8 bg-gradient-to-br from-orange-400 to-pink-500 rounded-full flex items-center justify-center">
                      <UserIcon className="w-5 h-5 text-white" />
                    </div>
                    <span className="font-medium">Mi Cuenta</span>
                  </button>
                  
                  {/* Dropdown Menu */}
                  <div className="absolute right-0 top-full mt-2 w-48 bg-white rounded-lg shadow-lg border border-gray-200 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 z-10">
                    <div className="py-2">
                      <Link
                        to="/perfil"
                        className="block px-4 py-2 text-gray-700 hover:bg-orange-50 hover:text-orange-600 transition-colors duration-200"
                      >
                        Mi Perfil
                      </Link>
                      <Link
                        to="/mis-publicaciones"
                        className="block px-4 py-2 text-gray-700 hover:bg-orange-50 hover:text-orange-600 transition-colors duration-200"
                      >
                        Mis Publicaciones
                      </Link>
                      <Link
                        to="/solicitudes"
                        className="block px-4 py-2 text-gray-700 hover:bg-orange-50 hover:text-orange-600 transition-colors duration-200"
                      >
                        Mis Solicitudes
                      </Link>
                      <hr className="my-2 border-gray-200" />
                      <button
                        onClick={handleLogout}
                        className="block w-full text-left px-4 py-2 text-red-600 hover:bg-red-50 transition-colors duration-200"
                      >
                        Cerrar Sesión
                      </button>
                    </div>
                  </div>
                </div>
              </>
            ) : (
              <div className="flex items-center space-x-3">
                <Link
                  to="/iniciar-sesion"
                  className="px-4 py-2 bg-gradient-to-r from-orange-500 to-pink-500 text-white rounded-lg font-medium hover:from-orange-600 hover:to-pink-600 transition-all duration-200 shadow-md hover:shadow-lg"
                >
                  Iniciar Sesión
                </Link>
                <Link
                  to="/registrarse"
                  className="px-4 py-2 bg-gradient-to-r from-orange-500 to-pink-500 text-white rounded-lg font-medium hover:from-orange-600 hover:to-pink-600 transition-all duration-200 shadow-md hover:shadow-lg"
                >
                  Registrarse
                </Link>
              </div>
            )}
          </div>

          {/* Mobile Menu Button */}
          <button
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            className="lg:hidden p-2 text-gray-600 hover:text-orange-600 hover:bg-orange-50 rounded-lg transition-all duration-200"
            aria-label="Toggle menu"
          >
            <AnimatePresence mode="wait">
              {isMenuOpen ? (
                <motion.div
                  key="close"
                  initial={{ rotate: -90, opacity: 0 }}
                  animate={{ rotate: 0, opacity: 1 }}
                  exit={{ rotate: 90, opacity: 0 }}
                  transition={{ duration: 0.2 }}
                >
                  <XMarkIcon className="w-6 h-6" />
                </motion.div>
              ) : (
                <motion.div
                  key="menu"
                  initial={{ rotate: 90, opacity: 0 }}
                  animate={{ rotate: 0, opacity: 1 }}
                  exit={{ rotate: -90, opacity: 0 }}
                  transition={{ duration: 0.2 }}
                >
                  <Bars3Icon className="w-6 h-6" />
                </motion.div>
              )}
            </AnimatePresence>
          </button>
        </div>

        {/* Mobile Menu */}
        <AnimatePresence>
          {isMenuOpen && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              transition={{ duration: 0.3, ease: "easeInOut" }}
              className="lg:hidden border-t border-gray-200 bg-white/95 backdrop-blur-md"
            >
              <div className="py-4 space-y-2">
                {/* Mobile Navigation */}
                {menuItems.map((item) => (
                  <Link
                    key={item.name}
                    to={item.path}
                    onClick={() => setIsMenuOpen(false)}
                    className={`flex items-center space-x-3 px-4 py-3 rounded-lg font-medium transition-all duration-200 ${
                      isActive(item.path)
                        ? 'text-orange-600 bg-orange-50 border border-orange-200'
                        : 'text-gray-700 hover:text-orange-600 hover:bg-orange-50'
                    }`}
                  >
                    <item.icon className="w-5 h-5" />
                    <span>{item.name}</span>
                  </Link>
                ))}

                <hr className="border-gray-200" />

                {/* Mobile Actions */}
                {isLoggedIn ? (
                  <div className="space-y-2">
                    <Link
                      to="/notificaciones"
                      onClick={() => setIsMenuOpen(false)}
                      className="flex items-center space-x-3 px-4 py-3 text-gray-700 hover:text-orange-600 hover:bg-orange-50 rounded-lg transition-all duration-200"
                    >
                      <div className="relative">
                        <BellIcon className="w-5 h-5" />
                        {unreadNotifications.length > 0 && (
                          <span className="absolute -top-1 -right-1 w-4 h-4 bg-red-500 text-white text-xs rounded-full flex items-center justify-center font-bold">
                            {unreadNotifications.length > 9 ? '9+' : unreadNotifications.length}
                          </span>
                        )}
                      </div>
                      <span>Notificaciones</span>
                    </Link>
                    
                    {userIsAdmin && (
                      <Link
                        to="/admin/dashboard"
                        onClick={() => setIsMenuOpen(false)}
                        className="flex items-center space-x-3 px-4 py-3 bg-gradient-to-r from-purple-600 to-purple-700 text-white rounded-lg font-medium"
                      >
                        <BuildingOfficeIcon className="w-5 h-5" />
                        <span>Panel Admin</span>
                      </Link>
                    )}
                    
                    <Link
                      to="/perfil"
                      onClick={() => setIsMenuOpen(false)}
                      className="flex items-center space-x-3 px-4 py-3 text-gray-700 hover:text-orange-600 hover:bg-orange-50 rounded-lg transition-all duration-200"
                    >
                      <UserIcon className="w-5 h-5" />
                      <span>Mi Perfil</span>
                    </Link>
                    
                    <Link
                      to="/mis-publicaciones"
                      onClick={() => setIsMenuOpen(false)}
                      className="flex items-center space-x-3 px-4 py-3 text-gray-700 hover:text-orange-600 hover:bg-orange-50 rounded-lg transition-all duration-200"
                    >
                      <HeartIcon className="w-5 h-5" />
                      <span>Mis Publicaciones</span>
                    </Link>
                    
                    <Link
                      to="/solicitudes"
                      onClick={() => setIsMenuOpen(false)}
                      className="flex items-center space-x-3 px-4 py-3 text-gray-700 hover:text-orange-600 hover:bg-orange-50 rounded-lg transition-all duration-200"
                    >
                      <BellIcon className="w-5 h-5" />
                      <span>Mis Solicitudes</span>
                    </Link>
                    
                    <hr className="border-gray-200" />
                    
                    <button
                      onClick={() => {
                        handleLogout();
                        setIsMenuOpen(false);
                      }}
                      className="flex items-center space-x-3 w-full px-4 py-3 text-red-600 hover:bg-red-50 rounded-lg transition-all duration-200"
                    >
                      <XMarkIcon className="w-5 h-5" />
                      <span>Cerrar Sesión</span>
                    </button>
                  </div>
                ) : (
                  <div className="space-y-3 pt-2">
                    <Link
                      to="/iniciar-sesion"
                      onClick={() => setIsMenuOpen(false)}
                      className="block w-full px-4 py-3 bg-gradient-to-r from-orange-500 to-pink-500 text-white rounded-lg font-medium hover:from-orange-600 hover:to-pink-600 transition-all duration-200 text-center whitespace-nowrap"
                    >
                      Iniciar Sesión
                    </Link>
                    <Link
                      to="/registrarse"
                      onClick={() => setIsMenuOpen(false)}
                      className="block w-full px-4 py-3 bg-gradient-to-r from-orange-500 to-pink-500 text-white rounded-lg font-medium hover:from-orange-600 hover:to-pink-600 transition-all duration-200 text-center whitespace-nowrap"
                    >
                      Registrarse
                    </Link>
                  </div>
                )}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </header>
  );
};

export default Header;
