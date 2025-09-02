import React, { useState, useEffect } from 'react';
import { 
  DocumentTextIcon, 
  MagnifyingGlassIcon,
  FunnelIcon,
  PlusIcon,
  PencilIcon,
  TrashIcon,
  EyeIcon,
  CalendarIcon,
  UserIcon,
  TagIcon,
  PhotoIcon,
  GlobeAltIcon,
  CheckCircleIcon,
  ClockIcon
} from '@heroicons/react/24/outline';
import { motion, AnimatePresence } from 'framer-motion';
import { toast } from 'react-toastify';
import { Link } from 'react-router-dom';

const GestionCampanasNoticias = () => {
  const [campanas, setCampanas] = useState([]);
  const [noticias, setNoticias] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [filters, setFilters] = useState({
    tipo: '',
    estado: '',
    categoria: ''
  });
  const [showFilters, setShowFilters] = useState(false);
  const [selectedItem, setSelectedItem] = useState(null);
  const [showDetailModal, setShowDetailModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [activeTab, setActiveTab] = useState('campanas');

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      setLoading(true);
      // Simular datos de campañas y noticias
      const mockCampanas = [
        {
          id: 1,
          titulo: 'Campaña de Adopción Masiva',
          descripcion: 'Ayúdanos a encontrar hogar para más de 50 mascotas rescatadas',
          contenido: 'Esta campaña busca crear conciencia sobre la adopción responsable y encontrar hogares amorosos para mascotas que han sido rescatadas de situaciones difíciles.',
          tipo: 'campana',
          categoria: 'Adopción',
          estado: 'activa',
          fecha_creacion: '2024-01-15',
          fecha_publicacion: '2024-01-20',
          autor: 'Admin',
          imagen_url: 'campana1.jpg',
          fundacion_asociada: 'Fundación Amor Animal',
          mascotas_asociadas: ['Luna', 'Max', 'Bella']
        },
        {
          id: 2,
          titulo: 'Concienciación sobre Tenencia Responsable',
          descripcion: 'Educación sobre el cuidado adecuado de mascotas',
          contenido: 'Campaña educativa para promover la tenencia responsable de mascotas y reducir el abandono.',
          tipo: 'campana',
          categoria: 'Educación',
          estado: 'activa',
          fecha_creacion: '2024-01-10',
          fecha_publicacion: '2024-01-15',
          autor: 'Admin',
          imagen_url: 'campana2.jpg',
          fundacion_asociada: 'Refugio Esperanza',
          mascotas_asociadas: []
        }
      ];

      const mockNoticias = [
        {
          id: 1,
          titulo: 'Nuevas Adopciones Exitosas',
          descripcion: 'Celebramos 100 adopciones exitosas este mes',
          contenido: 'Este mes hemos logrado encontrar hogares amorosos para 100 mascotas. Gracias a todos los adoptantes que han abierto sus corazones y hogares.',
          tipo: 'noticia',
          categoria: 'Éxitos',
          estado: 'publicada',
          fecha_creacion: '2024-01-25',
          fecha_publicacion: '2024-01-25',
          autor: 'Admin',
          imagen_url: 'noticia1.jpg',
          fundacion_asociada: null,
          mascotas_asociadas: []
        },
        {
          id: 2,
          titulo: 'Nuevo Centro de Rescate',
          descripcion: 'Se inaugura nuevo centro de rescate en Medellín',
          contenido: 'Se ha inaugurado un nuevo centro de rescate en Medellín que podrá albergar hasta 200 mascotas en situación de calle.',
          tipo: 'noticia',
          categoria: 'Infraestructura',
          estado: 'borrador',
          fecha_creacion: '2024-01-22',
          fecha_publicacion: null,
          autor: 'Admin',
          imagen_url: 'noticia2.jpg',
          fundacion_asociada: 'Casa de Mascotas',
          mascotas_asociadas: []
        }
      ];

      setCampanas(mockCampanas);
      setNoticias(mockNoticias);
    } catch (error) {
      console.error('Error loading data:', error);
      toast.error('Error al cargar los datos');
    } finally {
      setLoading(false);
    }
  };

  const handleEliminar = async (id, tipo) => {
    try {
      if (tipo === 'campana') {
        setCampanas(campanas.filter(c => c.id !== id));
      } else {
        setNoticias(noticias.filter(n => n.id !== id));
      }
      toast.success(`${tipo === 'campana' ? 'Campaña' : 'Noticia'} eliminada correctamente`);
      setShowDeleteModal(false);
      setSelectedItem(null);
    } catch (error) {
      console.error('Error deleting item:', error);
      toast.error('Error al eliminar el elemento');
    }
  };

  const getCurrentItems = () => {
    const items = activeTab === 'campanas' ? campanas : noticias;
    return items.filter(item => {
      const matchesSearch = 
        item.titulo.toLowerCase().includes(searchTerm.toLowerCase()) ||
        item.descripcion.toLowerCase().includes(searchTerm.toLowerCase()) ||
        item.categoria.toLowerCase().includes(searchTerm.toLowerCase());
      
      const matchesTipo = !filters.tipo || item.tipo === filters.tipo;
      const matchesEstado = !filters.estado || item.estado === filters.estado;
      const matchesCategoria = !filters.categoria || item.categoria === filters.categoria;

      return matchesSearch && matchesTipo && matchesEstado && matchesCategoria;
    });
  };

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

  const getEstadisticas = () => {
    const totalCampanas = campanas.length;
    const campanasActivas = campanas.filter(c => c.estado === 'activa').length;
    const totalNoticias = noticias.length;
    const noticiasPublicadas = noticias.filter(n => n.estado === 'publicada').length;
    
    return { totalCampanas, campanasActivas, totalNoticias, noticiasPublicadas };
  };

  const stats = getEstadisticas();
  const currentItems = getCurrentItems();

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-600"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Gestión de Campañas y Noticias</h1>
          <p className="text-gray-600 mt-2">Administra contenido informativo y campañas de adopción</p>
        </div>
        <div className="mt-4 sm:mt-0">
          <Link to="/admin/campanas-noticias/nueva" className="btn-primary btn-icon">
            <PlusIcon className="w-5 h-5 mr-2" />
            Crear Contenido
          </Link>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white rounded-xl shadow-sm border border-gray-200 p-6"
        >
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Total Campañas</p>
              <p className="text-2xl font-bold text-gray-900">{stats.totalCampanas}</p>
            </div>
            <div className="p-3 rounded-lg bg-gradient-to-br from-blue-500 to-indigo-500">
              <DocumentTextIcon className="w-6 h-6 text-white" />
            </div>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="bg-white rounded-xl shadow-sm border border-gray-200 p-6"
        >
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Campañas Activas</p>
              <p className="text-2xl font-bold text-green-600">{stats.campanasActivas}</p>
            </div>
            <div className="p-3 rounded-lg bg-gradient-to-br from-green-500 to-emerald-500">
              <CheckCircleIcon className="w-6 h-6 text-white" />
            </div>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="bg-white rounded-xl shadow-sm border border-gray-200 p-6"
        >
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Total Noticias</p>
              <p className="text-2xl font-bold text-gray-900">{stats.totalNoticias}</p>
            </div>
            <div className="p-3 rounded-lg bg-gradient-to-br from-purple-500 to-violet-500">
              <GlobeAltIcon className="w-6 h-6 text-white" />
            </div>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="bg-white rounded-xl shadow-sm border border-gray-200 p-6"
        >
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Noticias Publicadas</p>
              <p className="text-2xl font-bold text-blue-600">{stats.noticiasPublicadas}</p>
            </div>
            <div className="p-3 rounded-lg bg-gradient-to-br from-blue-500 to-cyan-500">
              <CheckCircleIcon className="w-6 h-6 text-white" />
            </div>
          </div>
        </motion.div>
      </div>

      {/* Tabs */}
      <div className="border-b border-gray-200">
        <nav className="-mb-px flex space-x-8">
          <button
            onClick={() => setActiveTab('campanas')}
            className={`py-2 px-1 border-b-2 font-medium text-sm ${activeTab === 'campanas' ? 'border-purple-500 text-purple-600' : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'}`}
          >
            Campañas ({campanas.length})
          </button>
          <button
            onClick={() => setActiveTab('noticias')}
            className={`py-2 px-1 border-b-2 font-medium text-sm ${activeTab === 'noticias' ? 'border-purple-500 text-purple-600' : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'}`}
          >
            Noticias ({noticias.length})
          </button>
        </nav>
      </div>

      {/* Search and Filters */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between space-y-4 lg:space-y-0">
          <div className="relative flex-1 max-w-md">
            <MagnifyingGlassIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
            <input
              type="text"
              placeholder={`Buscar ${activeTab === 'campanas' ? 'campañas' : 'noticias'}...`}
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
            />
          </div>
          <button
            onClick={() => setShowFilters(!showFilters)}
            className="btn-secondary btn-icon"
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
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
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
                    <option value="borrador">Borrador</option>
                    <option value="inactiva">Inactiva</option>
                  </select>
                </div>
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
                    <option value="Éxitos">Éxitos</option>
                    <option value="Infraestructura">Infraestructura</option>
                  </select>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Content Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
        {currentItems.map((item) => (
          <motion.div
            key={item.id}
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
                    <h3 className="text-lg font-semibold text-gray-900 line-clamp-2">{item.titulo}</h3>
                    <p className="text-sm text-gray-500">{item.categoria}</p>
                  </div>
                </div>
                {getStatusBadge(item.estado)}
              </div>

              <p className="text-sm text-gray-600 mb-4 line-clamp-3">{item.descripcion}</p>

              <div className="space-y-2 mb-4">
                <div className="flex items-center text-sm text-gray-500">
                  <CalendarIcon className="w-4 h-4 mr-2" />
                  {new Date(item.fecha_creacion).toLocaleDateString()}
                </div>
                <div className="flex items-center text-sm text-gray-500">
                  <UserIcon className="w-4 h-4 mr-2" />
                  {item.autor}
                </div>
                {item.fundacion_asociada && (
                  <div className="flex items-center text-sm text-gray-500">
                    <TagIcon className="w-4 h-4 mr-2" />
                    {item.fundacion_asociada}
                  </div>
                )}
              </div>

              <div className="flex items-center space-x-2">
                <button
                  onClick={() => {
                    setSelectedItem(item);
                    setShowDetailModal(true);
                  }}
                  className="flex-1 btn-secondary btn-icon"
                >
                  <EyeIcon className="w-4 h-4 mr-1" />
                  Ver
                </button>
                
                <button
                  onClick={() => {
                    setSelectedItem(item);
                    setShowDeleteModal(true);
                  }}
                  className="btn-danger btn-icon"
                >
                  <TrashIcon className="w-4 h-4" />
                </button>
              </div>
            </div>
          </motion.div>
        ))}
      </div>

      {currentItems.length === 0 && (
        <div className="text-center py-12">
          <DocumentTextIcon className="mx-auto h-12 w-12 text-gray-400" />
          <h3 className="mt-2 text-sm font-medium text-gray-900">
            No se encontraron {activeTab === 'campanas' ? 'campañas' : 'noticias'}
          </h3>
          <p className="mt-1 text-sm text-gray-500">
            Intenta ajustar los filtros o términos de búsqueda.
          </p>
        </div>
      )}

      {/* Detail Modal */}
      <AnimatePresence>
        {showDetailModal && selectedItem && (
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
                    <div className="mt-3 text-center sm:mt-0 sm:text-left w-full">
                      <h3 className="text-lg leading-6 font-medium text-gray-900 mb-4">
                        Detalles del Contenido
                      </h3>
                      
                      <div className="space-y-4">
                        <div>
                          <h4 className="font-medium text-gray-900 mb-2">{selectedItem.titulo}</h4>
                          <p className="text-sm text-gray-600">{selectedItem.descripcion}</p>
                        </div>

                        <div className="bg-gray-50 p-4 rounded-lg">
                          <p className="text-sm text-gray-700">{selectedItem.contenido}</p>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          <div className="space-y-2">
                            <div className="flex items-center text-sm">
                              <CalendarIcon className="w-4 h-4 mr-2 text-gray-400" />
                              <span className="font-medium">Fecha de Creación:</span>
                              <span className="ml-2">{new Date(selectedItem.fecha_creacion).toLocaleDateString()}</span>
                            </div>
                            <div className="flex items-center text-sm">
                              <UserIcon className="w-4 h-4 mr-2 text-gray-400" />
                              <span className="font-medium">Autor:</span>
                              <span className="ml-2">{selectedItem.autor}</span>
                            </div>
                            <div className="flex items-center text-sm">
                              <TagIcon className="w-4 h-4 mr-2 text-gray-400" />
                              <span className="font-medium">Categoría:</span>
                              <span className="ml-2">{selectedItem.categoria}</span>
                            </div>
                          </div>

                          <div className="space-y-2">
                            <div className="flex items-center text-sm">
                              <span className="font-medium">Estado:</span>
                              <span className="ml-2">{getStatusBadge(selectedItem.estado)}</span>
                            </div>
                            {selectedItem.fundacion_asociada && (
                              <div className="flex items-center text-sm">
                                <span className="font-medium">Fundación Asociada:</span>
                                <span className="ml-2">{selectedItem.fundacion_asociada}</span>
                              </div>
                            )}
                            {selectedItem.mascotas_asociadas && selectedItem.mascotas_asociadas.length > 0 && (
                              <div className="flex items-center text-sm">
                                <span className="font-medium">Mascotas Asociadas:</span>
                                <span className="ml-2">{selectedItem.mascotas_asociadas.join(', ')}</span>
                              </div>
                            )}
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
                <div className="bg-gray-50 px-4 py-3 sm:px-6 sm:flex sm:flex-row-reverse">
                  <button
                    type="button"
                    onClick={() => setShowDetailModal(false)}
                    className="btn-primary sm:ml-3 sm:w-auto"
                  >
                    Cerrar
                  </button>
                </div>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Delete Confirmation Modal */}
      <AnimatePresence>
        {showDeleteModal && selectedItem && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 overflow-y-auto"
          >
            <div className="flex items-end justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:block sm:p-0">
              <div className="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity" onClick={() => setShowDeleteModal(false)} />
              
              <div className="inline-block align-bottom bg-white rounded-lg text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-lg sm:w-full">
                <div className="bg-white px-4 pt-5 pb-4 sm:p-6 sm:pb-4">
                  <div className="sm:flex sm:items-start">
                    <div className="mx-auto flex-shrink-0 flex items-center justify-center h-12 w-12 rounded-full bg-red-100 sm:mx-0 sm:h-10 sm:w-10">
                      <TrashIcon className="h-6 w-6 text-red-600" />
                    </div>
                    <div className="mt-3 text-center sm:mt-0 sm:ml-4 sm:text-left">
                      <h3 className="text-lg leading-6 font-medium text-gray-900">
                        Eliminar {selectedItem.tipo === 'campana' ? 'Campaña' : 'Noticia'}
                      </h3>
                      <div className="mt-2">
                        <p className="text-sm text-gray-500">
                          ¿Estás seguro de que quieres eliminar <strong>{selectedItem.titulo}</strong>? 
                          Esta acción no se puede deshacer.
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
                <div className="bg-gray-50 px-4 py-3 sm:px-6 sm:flex sm:flex-row-reverse">
                  <button
                    type="button"
                    onClick={() => handleEliminar(selectedItem.id, selectedItem.tipo)}
                    className="btn-danger sm:ml-3 sm:w-auto"
                  >
                    Eliminar
                  </button>
                  <button
                    type="button"
                    onClick={() => setShowDeleteModal(false)}
                    className="btn-secondary sm:mt-0 sm:ml-3 sm:w-auto"
                  >
                    Cancelar
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

export default GestionCampanasNoticias;
