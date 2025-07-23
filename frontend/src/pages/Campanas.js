import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  DocumentTextIcon, 
  MagnifyingGlassIcon,
  FunnelIcon,
  CalendarIcon,
  UserIcon,
  TagIcon,
  PhotoIcon,
  GlobeAltIcon,
  CheckCircleIcon,
  ClockIcon,
  HeartIcon,
  MapPinIcon
} from '@heroicons/react/24/outline';
import LoadingSpinner from '../components/LoadingSpinner';

const Campanas = () => {
  const [campanas, setCampanas] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [filters, setFilters] = useState({
    categoria: '',
    estado: ''
  });
  const [showFilters, setShowFilters] = useState(false);
  const [selectedCampana, setSelectedCampana] = useState(null);
  const [showDetailModal, setShowDetailModal] = useState(false);

  useEffect(() => {
    loadCampanas();
  }, []);

  const loadCampanas = async () => {
    try {
      setLoading(true);
      // Datos mock temporales para desarrollo
      const mockCampanas = [
        {
          id: 1,
          titulo: 'Campaña de Adopción Masiva',
          descripcion: 'Ayúdanos a encontrar hogar para más de 50 mascotas rescatadas',
          contenido: 'Esta campaña busca crear conciencia sobre la adopción responsable y encontrar hogares amorosos para mascotas que han sido rescatadas de situaciones difíciles. Nuestro objetivo es encontrar familias comprometidas que puedan brindar el amor y cuidado que estas mascotas merecen.',
          tipo: 'campana',
          categoria: 'Adopción',
          estado: 'activa',
          fecha_creacion: '2024-01-15',
          fecha_publicacion: '2024-01-20',
          autor: 'Admin',
          imagen_url: '/images/logo-mascotas.png',
          fundacion_asociada: 'Fundación Amor Animal',
          mascotas_asociadas: ['Luna', 'Max', 'Bella'],
          ubicacion: 'Bogotá, Colombia',
          objetivo: '50 adopciones',
          progreso: 35
        },
        {
          id: 2,
          titulo: 'Concienciación sobre Tenencia Responsable',
          descripcion: 'Educación sobre el cuidado adecuado de mascotas',
          contenido: 'Campaña educativa para promover la tenencia responsable de mascotas y reducir el abandono. Incluye talleres, charlas y material educativo para propietarios de mascotas.',
          tipo: 'campana',
          categoria: 'Educación',
          estado: 'activa',
          fecha_creacion: '2024-01-10',
          fecha_publicacion: '2024-01-15',
          autor: 'Admin',
          imagen_url: '/images/logo-mascotas.png',
          fundacion_asociada: 'Refugio Esperanza',
          mascotas_asociadas: [],
          ubicacion: 'Medellín, Colombia',
          objetivo: '1000 personas educadas',
          progreso: 750
        },
        {
          id: 3,
          titulo: 'Rescate de Mascotas en Emergencia',
          descripcion: 'Ayuda urgente para mascotas afectadas por desastres naturales',
          contenido: 'Campaña de emergencia para rescatar y rehabilitar mascotas afectadas por desastres naturales. Necesitamos voluntarios y donaciones para esta causa urgente.',
          tipo: 'campana',
          categoria: 'Emergencia',
          estado: 'activa',
          fecha_creacion: '2024-01-05',
          fecha_publicacion: '2024-01-08',
          autor: 'Admin',
          imagen_url: '/images/logo-mascotas.png',
          fundacion_asociada: 'Rescate Animal Colombia',
          mascotas_asociadas: ['Rocky', 'Daisy', 'Thor'],
          ubicacion: 'Cali, Colombia',
          objetivo: '30 rescates',
          progreso: 18
        }
      ];

      setCampanas(mockCampanas);
    } catch (error) {
      console.error('Error loading campaigns:', error);
    } finally {
      setLoading(false);
    }
  };

  const filteredCampanas = campanas.filter(campana => {
    const matchesSearch = 
      campana.titulo.toLowerCase().includes(searchTerm.toLowerCase()) ||
      campana.descripcion.toLowerCase().includes(searchTerm.toLowerCase()) ||
      campana.categoria.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesCategoria = !filters.categoria || campana.categoria === filters.categoria;
    const matchesEstado = !filters.estado || campana.estado === filters.estado;

    return matchesSearch && matchesCategoria && matchesEstado;
  });

  const getStatusBadge = (estado) => {
    const badges = {
      activa: { color: 'bg-green-100 text-green-800', icon: CheckCircleIcon },
      publicada: { color: 'bg-blue-100 text-blue-800', icon: CheckCircleIcon },
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

  const getProgressColor = (progreso) => {
    if (progreso >= 80) return 'bg-green-500';
    if (progreso >= 50) return 'bg-yellow-500';
    return 'bg-red-500';
  };

  if (loading) {
    return <LoadingSpinner />;
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="text-center">
        <h1 className="text-4xl font-bold text-gray-900 mb-4">Campañas de Adopción</h1>
        <p className="text-xl text-gray-600 max-w-3xl mx-auto">
          Descubre las campañas activas para ayudar a mascotas necesitadas y participar en iniciativas que marcan la diferencia
        </p>
      </div>

      {/* Search and Filters */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between space-y-4 lg:space-y-0">
          <div className="relative flex-1 max-w-md">
            <MagnifyingGlassIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
            <input
              type="text"
              placeholder="Buscar campañas..."
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
                    <option value="Adopción">Adopción</option>
                    <option value="Educación">Educación</option>
                    <option value="Emergencia">Emergencia</option>
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
                    <option value="activa">Activa</option>
                    <option value="publicada">Publicada</option>
                  </select>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Campaigns Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
        {filteredCampanas.map((campana) => (
          <motion.div
            key={campana.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden hover:shadow-md transition-shadow duration-200"
          >
            <div className="p-6">
              <div className="flex items-start justify-between mb-4">
                <div className="flex items-center space-x-3">
                  <div className="w-12 h-12 bg-gradient-to-br from-purple-500 to-blue-500 rounded-lg flex items-center justify-center">
                    <DocumentTextIcon className="w-6 h-6 text-white" />
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900 line-clamp-2">{campana.titulo}</h3>
                    <p className="text-sm text-gray-500">{campana.categoria}</p>
                  </div>
                </div>
                {getStatusBadge(campana.estado)}
              </div>

              <p className="text-sm text-gray-600 mb-4 line-clamp-3">{campana.descripcion}</p>

              {/* Progress Bar */}
              {campana.objetivo && (
                <div className="mb-4">
                  <div className="flex justify-between text-sm text-gray-600 mb-1">
                    <span>Progreso</span>
                    <span>{campana.progreso} / {campana.objetivo}</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div 
                      className={`h-2 rounded-full ${getProgressColor(campana.progreso)}`}
                      style={{ width: `${Math.min((campana.progreso / 100) * 100, 100)}%` }}
                    ></div>
                  </div>
                </div>
              )}

              <div className="space-y-2 mb-4">
                <div className="flex items-center text-sm text-gray-500">
                  <CalendarIcon className="w-4 h-4 mr-2" />
                  {new Date(campana.fecha_publicacion).toLocaleDateString()}
                </div>
                <div className="flex items-center text-sm text-gray-500">
                  <MapPinIcon className="w-4 h-4 mr-2" />
                  {campana.ubicacion}
                </div>
                {campana.fundacion_asociada && (
                  <div className="flex items-center text-sm text-gray-500">
                    <TagIcon className="w-4 h-4 mr-2" />
                    {campana.fundacion_asociada}
                  </div>
                )}
              </div>

              <button
                onClick={() => {
                  setSelectedCampana(campana);
                  setShowDetailModal(true);
                }}
                className="w-full inline-flex items-center justify-center px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors duration-200"
              >
                <HeartIcon className="w-4 h-4 mr-2" />
                Ver Detalles
              </button>
            </div>
          </motion.div>
        ))}
      </div>

      {filteredCampanas.length === 0 && (
        <div className="text-center py-12">
          <DocumentTextIcon className="mx-auto h-12 w-12 text-gray-400" />
          <h3 className="mt-2 text-sm font-medium text-gray-900">No se encontraron campañas</h3>
          <p className="mt-1 text-sm text-gray-500">
            Intenta ajustar los filtros o términos de búsqueda.
          </p>
        </div>
      )}

      {/* Detail Modal */}
      <AnimatePresence>
        {showDetailModal && selectedCampana && (
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
                        <h3 className="text-2xl font-bold text-gray-900">{selectedCampana.titulo}</h3>
                        {getStatusBadge(selectedCampana.estado)}
                      </div>
                      
                      <div className="space-y-4">
                        <p className="text-gray-600">{selectedCampana.contenido}</p>
                        
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          <div>
                            <p className="text-sm font-medium text-gray-700">Categoría</p>
                            <p className="text-sm text-gray-900">{selectedCampana.categoria}</p>
                          </div>
                          <div>
                            <p className="text-sm font-medium text-gray-700">Ubicación</p>
                            <p className="text-sm text-gray-900">{selectedCampana.ubicacion}</p>
                          </div>
                          <div>
                            <p className="text-sm font-medium text-gray-700">Fundación</p>
                            <p className="text-sm text-gray-900">{selectedCampana.fundacion_asociada}</p>
                          </div>
                          <div>
                            <p className="text-sm font-medium text-gray-700">Fecha de Publicación</p>
                            <p className="text-sm text-gray-900">{new Date(selectedCampana.fecha_publicacion).toLocaleDateString()}</p>
                          </div>
                        </div>

                        {selectedCampana.objetivo && (
                          <div>
                            <p className="text-sm font-medium text-gray-700 mb-2">Progreso de la Campaña</p>
                            <div className="flex justify-between text-sm text-gray-600 mb-1">
                              <span>Objetivo: {selectedCampana.objetivo}</span>
                              <span>{selectedCampana.progreso} completado</span>
                            </div>
                            <div className="w-full bg-gray-200 rounded-full h-3">
                              <div 
                                className={`h-3 rounded-full ${getProgressColor(selectedCampana.progreso)}`}
                                style={{ width: `${Math.min((selectedCampana.progreso / 100) * 100, 100)}%` }}
                              ></div>
                            </div>
                          </div>
                        )}

                        {selectedCampana.mascotas_asociadas && selectedCampana.mascotas_asociadas.length > 0 && (
                          <div>
                            <p className="text-sm font-medium text-gray-700 mb-2">Mascotas Asociadas</p>
                            <div className="flex flex-wrap gap-2">
                              {selectedCampana.mascotas_asociadas.map((mascota, index) => (
                                <span key={index} className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-purple-100 text-purple-800">
                                  {mascota}
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
                    className="w-full inline-flex justify-center rounded-md border border-transparent shadow-sm px-4 py-2 bg-purple-600 text-base font-medium text-white hover:bg-purple-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-purple-500 sm:ml-3 sm:w-auto sm:text-sm"
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

export default Campanas; 