import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  GlobeAltIcon, 
  MagnifyingGlassIcon,
  FunnelIcon,
  CalendarIcon,
  UserIcon,
  TagIcon,
  PhotoIcon,
  DocumentTextIcon,
  CheckCircleIcon,
  ClockIcon,
  HeartIcon,
  MapPinIcon
} from '@heroicons/react/24/outline';
import LoadingSpinner from '../components/LoadingSpinner';

const Noticias = () => {
  const [noticias, setNoticias] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [filters, setFilters] = useState({
    categoria: '',
    estado: ''
  });
  const [showFilters, setShowFilters] = useState(false);
  const [selectedNoticia, setSelectedNoticia] = useState(null);
  const [showDetailModal, setShowDetailModal] = useState(false);

  useEffect(() => {
    loadNoticias();
  }, []);

  const loadNoticias = async () => {
    try {
      setLoading(true);
      // Datos mock temporales para desarrollo
      const mockNoticias = [
        {
          id: 1,
          titulo: 'Nuevas Adopciones Exitosas',
          descripcion: 'Celebramos 100 adopciones exitosas este mes',
          contenido: 'Este mes hemos logrado encontrar hogares amorosos para 100 mascotas. Gracias a todos los adoptantes que han abierto sus corazones y hogares. Cada adopción representa una nueva oportunidad de vida para estas mascotas que han pasado por situaciones difíciles.',
          tipo: 'noticia',
          categoria: 'Éxitos',
          estado: 'publicada',
          fecha_creacion: '2024-01-25',
          fecha_publicacion: '2024-01-25',
          autor: 'Admin',
          imagen_url: '/images/logo-mascotas.png',
          fundacion_asociada: null,
          mascotas_asociadas: [],
          ubicacion: 'Bogotá, Colombia',
          tags: ['Adopción', 'Éxito', 'Celebración']
        },
        {
          id: 2,
          titulo: 'Nuevo Centro de Rescate',
          descripcion: 'Se inaugura nuevo centro de rescate en Medellín',
          contenido: 'Se ha inaugurado un nuevo centro de rescate en Medellín que podrá albergar hasta 200 mascotas en situación de calle. Este centro cuenta con instalaciones modernas y personal especializado para el cuidado y rehabilitación de mascotas.',
          tipo: 'noticia',
          categoria: 'Infraestructura',
          estado: 'publicada',
          fecha_creacion: '2024-01-22',
          fecha_publicacion: '2024-01-22',
          autor: 'Admin',
          imagen_url: '/images/logo-mascotas.png',
          fundacion_asociada: 'Casa de Mascotas',
          mascotas_asociadas: [],
          ubicacion: 'Medellín, Colombia',
          tags: ['Infraestructura', 'Rescate', 'Medellín']
        },
        {
          id: 3,
          titulo: 'Programa de Esterilización Gratuita',
          descripcion: 'Iniciativa para controlar la población de mascotas callejeras',
          contenido: 'Se lanza un programa de esterilización gratuita para mascotas en situación de calle. Esta iniciativa busca controlar la población de mascotas sin hogar y mejorar su calidad de vida.',
          tipo: 'noticia',
          categoria: 'Salud',
          estado: 'publicada',
          fecha_creacion: '2024-01-20',
          fecha_publicacion: '2024-01-20',
          autor: 'Admin',
          imagen_url: '/images/logo-mascotas.png',
          fundacion_asociada: 'Fundación Veterinaria',
          mascotas_asociadas: [],
          ubicacion: 'Cali, Colombia',
          tags: ['Salud', 'Esterilización', 'Bienestar']
        },
        {
          id: 4,
          titulo: 'Voluntarios del Mes',
          descripcion: 'Reconocimiento a los voluntarios más comprometidos',
          contenido: 'Celebramos a nuestros voluntarios más comprometidos que han dedicado su tiempo y esfuerzo para ayudar a las mascotas necesitadas. Su labor es fundamental para el éxito de nuestras iniciativas.',
          tipo: 'noticia',
          categoria: 'Reconocimientos',
          estado: 'publicada',
          fecha_creacion: '2024-01-18',
          fecha_publicacion: '2024-01-18',
          autor: 'Admin',
          imagen_url: '/images/logo-mascotas.png',
          fundacion_asociada: null,
          mascotas_asociadas: [],
          ubicacion: 'Nacional',
          tags: ['Voluntarios', 'Reconocimiento', 'Comunidad']
        }
      ];

      setNoticias(mockNoticias);
    } catch (error) {
      console.error('Error loading news:', error);
    } finally {
      setLoading(false);
    }
  };

  const filteredNoticias = noticias.filter(noticia => {
    const matchesSearch = 
      noticia.titulo.toLowerCase().includes(searchTerm.toLowerCase()) ||
      noticia.descripcion.toLowerCase().includes(searchTerm.toLowerCase()) ||
      noticia.categoria.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesCategoria = !filters.categoria || noticia.categoria === filters.categoria;
    const matchesEstado = !filters.estado || noticia.estado === filters.estado;

    return matchesSearch && matchesCategoria && matchesEstado;
  });

  const getStatusBadge = (estado) => {
    const badges = {
      publicada: { color: 'bg-blue-100 text-blue-800', icon: CheckCircleIcon },
      activa: { color: 'bg-green-100 text-green-800', icon: CheckCircleIcon },
      borrador: { color: 'bg-yellow-100 text-yellow-800', icon: ClockIcon },
      inactiva: { color: 'bg-gray-100 text-gray-800', icon: ClockIcon }
    };
    
    const badge = badges[estado] || badges.borrador;
    const Icon = badge.icon;
    
    return (
      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${badge.color}`}>
        <Icon className="w-3 h-3 mr-1" />
        {estado.charAt(0).toUpperCase() + estado.slice(1)}
      </span>
    );
  };

  if (loading) {
    return <LoadingSpinner />;
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="text-center">
        <h1 className="text-4xl font-bold text-gray-900 mb-4">Noticias y Actualizaciones</h1>
        <p className="text-xl text-gray-600 max-w-3xl mx-auto">
          Mantente informado sobre las últimas noticias, éxitos y novedades del mundo de la adopción de mascotas
        </p>
      </div>

      {/* Search and Filters */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between space-y-4 lg:space-y-0">
          <div className="relative flex-1 max-w-md">
            <MagnifyingGlassIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
            <input
              type="text"
              placeholder="Buscar noticias..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
            />
          </div>
          <button
            onClick={() => setShowFilters(!showFilters)}
            className="inline-flex items-center px-4 py-2 border border-gray-300 rounded-lg text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 transition-colors duration-200"
          >
            <FunnelIcon className="w-4 h-4 mr-2" />
            Filtros
          </button>
        </div>

        <AnimatePresence>
          {showFilters && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              className="mt-6 pt-6 border-t border-gray-200"
            >
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Categoría</label>
                  <select
                    value={filters.categoria}
                    onChange={(e) => setFilters({ ...filters, categoria: e.target.value })}
                    className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                  >
                    <option value="">Todas</option>
                    <option value="Éxitos">Éxitos</option>
                    <option value="Infraestructura">Infraestructura</option>
                    <option value="Salud">Salud</option>
                    <option value="Reconocimientos">Reconocimientos</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Estado</label>
                  <select
                    value={filters.estado}
                    onChange={(e) => setFilters({ ...filters, estado: e.target.value })}
                    className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                  >
                    <option value="">Todos</option>
                    <option value="publicada">Publicada</option>
                    <option value="activa">Activa</option>
                  </select>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* News Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
        {filteredNoticias.map((noticia) => (
          <motion.div
            key={noticia.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden hover:shadow-md transition-shadow duration-200"
          >
            <div className="p-6">
              <div className="flex items-start justify-between mb-4">
                <div className="flex items-center space-x-3">
                  <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-purple-500 rounded-lg flex items-center justify-center">
                    <GlobeAltIcon className="w-6 h-6 text-white" />
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900 line-clamp-2">{noticia.titulo}</h3>
                    <p className="text-sm text-gray-500">{noticia.categoria}</p>
                  </div>
                </div>
                {getStatusBadge(noticia.estado)}
              </div>

              <p className="text-sm text-gray-600 mb-4 line-clamp-3">{noticia.descripcion}</p>

              <div className="space-y-2 mb-4">
                <div className="flex items-center text-sm text-gray-500">
                  <CalendarIcon className="w-4 h-4 mr-2" />
                  {new Date(noticia.fecha_publicacion).toLocaleDateString()}
                </div>
                <div className="flex items-center text-sm text-gray-500">
                  <UserIcon className="w-4 h-4 mr-2" />
                  {noticia.autor}
                </div>
                {noticia.ubicacion && (
                  <div className="flex items-center text-sm text-gray-500">
                    <MapPinIcon className="w-4 h-4 mr-2" />
                    {noticia.ubicacion}
                  </div>
                )}
                {noticia.fundacion_asociada && (
                  <div className="flex items-center text-sm text-gray-500">
                    <TagIcon className="w-4 h-4 mr-2" />
                    {noticia.fundacion_asociada}
                  </div>
                )}
              </div>

              {noticia.tags && noticia.tags.length > 0 && (
                <div className="mb-4">
                  <div className="flex flex-wrap gap-2">
                    {noticia.tags.map((tag, index) => (
                      <span key={index} className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                        {tag}
                      </span>
                    ))}
                  </div>
                </div>
              )}

              <button
                onClick={() => {
                  setSelectedNoticia(noticia);
                  setShowDetailModal(true);
                }}
                className="w-full inline-flex items-center justify-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors duration-200"
              >
                <DocumentTextIcon className="w-4 h-4 mr-2" />
                Leer Más
              </button>
            </div>
          </motion.div>
        ))}
      </div>

      {filteredNoticias.length === 0 && (
        <div className="text-center py-12">
          <GlobeAltIcon className="mx-auto h-12 w-12 text-gray-400" />
          <h3 className="mt-2 text-sm font-medium text-gray-900">No se encontraron noticias</h3>
          <p className="mt-1 text-sm text-gray-500">
            Intenta ajustar los filtros o términos de búsqueda.
          </p>
        </div>
      )}

      {/* Detail Modal */}
      <AnimatePresence>
        {showDetailModal && selectedNoticia && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 overflow-y-auto"
          >
            <div className="flex items-end justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:block sm:p-0">
              <div className="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity" onClick={() => setShowDetailModal(false)} />
              
              <div className="inline-block align-bottom bg-white rounded-lg text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-2xl sm:w-full">
                <div className="bg-white px-4 pt-5 pb-4 sm:p-6 sm:pb-4">
                  <div className="sm:flex sm:items-start">
                    <div className="w-full">
                      <div className="flex items-center justify-between mb-4">
                        <h3 className="text-2xl font-bold text-gray-900">{selectedNoticia.titulo}</h3>
                        {getStatusBadge(selectedNoticia.estado)}
                      </div>
                      
                      <div className="space-y-4">
                        <p className="text-gray-600">{selectedNoticia.contenido}</p>
                        
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          <div>
                            <p className="text-sm font-medium text-gray-700">Categoría</p>
                            <p className="text-sm text-gray-900">{selectedNoticia.categoria}</p>
                          </div>
                          <div>
                            <p className="text-sm font-medium text-gray-700">Autor</p>
                            <p className="text-sm text-gray-900">{selectedNoticia.autor}</p>
                          </div>
                          <div>
                            <p className="text-sm font-medium text-gray-700">Ubicación</p>
                            <p className="text-sm text-gray-900">{selectedNoticia.ubicacion}</p>
                          </div>
                          <div>
                            <p className="text-sm font-medium text-gray-700">Fecha de Publicación</p>
                            <p className="text-sm text-gray-900">{new Date(selectedNoticia.fecha_publicacion).toLocaleDateString()}</p>
                          </div>
                        </div>

                        {selectedNoticia.fundacion_asociada && (
                          <div>
                            <p className="text-sm font-medium text-gray-700">Fundación Asociada</p>
                            <p className="text-sm text-gray-900">{selectedNoticia.fundacion_asociada}</p>
                          </div>
                        )}

                        {selectedNoticia.tags && selectedNoticia.tags.length > 0 && (
                          <div>
                            <p className="text-sm font-medium text-gray-700 mb-2">Etiquetas</p>
                            <div className="flex flex-wrap gap-2">
                              {selectedNoticia.tags.map((tag, index) => (
                                <span key={index} className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                                  {tag}
                                </span>
                              ))}
                            </div>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
                <div className="bg-gray-50 px-4 py-3 sm:px-6 sm:flex sm:flex-row-reverse">
                  <button
                    type="button"
                    onClick={() => setShowDetailModal(false)}
                    className="w-full inline-flex justify-center rounded-md border border-transparent shadow-sm px-4 py-2 bg-blue-600 text-base font-medium text-white hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 sm:ml-3 sm:w-auto sm:text-sm"
                  >
                    Cerrar
                  </button>
                </div>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default Noticias; 