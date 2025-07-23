import React, { useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  BuildingOfficeIcon, 
  MagnifyingGlassIcon,
  FunnelIcon,
  CheckCircleIcon,
  XCircleIcon,
  ClockIcon,
  EyeIcon,
  PencilIcon,
  TrashIcon,
  MapPinIcon,
  PhoneIcon,
  EnvelopeIcon,
  GlobeAltIcon,
  HeartIcon,
  PlusIcon
} from '@heroicons/react/24/outline';
import { motion, AnimatePresence } from 'framer-motion';
import { fetchFundaciones, aprobarFundacion, rechazarFundacion, eliminarFundacion } from '../../api/adminApi';
import { toast } from 'react-toastify';

const GestionFundaciones = () => {
  const navigate = useNavigate();
  const [fundaciones, setFundaciones] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [filters, setFilters] = useState({
    estado: '',
    ciudad: '',
    tipo: ''
  });
  const [showFilters, setShowFilters] = useState(false);
  const [selectedFundacion, setSelectedFundacion] = useState(null);
  const [showDetailModal, setShowDetailModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);

  const loadFundaciones = async () => {
    try {
      setLoading(true);
      
      // Datos mock temporales para desarrollo
      const mockFundaciones = [
        {
          id: 1,
          nombre: 'Fundación Patitas de Amor',
          descripcion: 'Dedicada al rescate y cuidado de perros y gatos abandonados',
          direccion: 'Calle 123 #45-67, Bogotá',
          telefono: '+57 300 123 4567',
          email: 'info@patitasdeamor.org',
          sitio_web: 'www.patitasdeamor.org',
          ciudad: 'Bogotá',
          estado: 'aprobada',
          fecha_registro: '2024-01-15',
          mascotas_count: 25,
          adopciones_count: 150
        },
        {
          id: 2,
          nombre: 'Refugio Esperanza',
          descripcion: 'Organización sin fines de lucro para el rescate de mascotas',
          direccion: 'Carrera 78 #90-12, Medellín',
          telefono: '+57 310 987 6543',
          email: 'contacto@refugioesperanza.org',
          sitio_web: 'www.refugioesperanza.org',
          ciudad: 'Medellín',
          estado: 'pendiente',
          fecha_registro: '2024-01-20',
          mascotas_count: 18,
          adopciones_count: 89
        },
        {
          id: 3,
          nombre: 'Casa de Mascotas',
          descripcion: 'Centro de adopción y cuidado temporal de mascotas',
          direccion: 'Avenida 5 #23-45, Cali',
          telefono: '+57 315 456 7890',
          email: 'info@casademascotas.org',
          sitio_web: 'www.casademascotas.org',
          ciudad: 'Cali',
          estado: 'rechazada',
          fecha_registro: '2024-01-10',
          mascotas_count: 12,
          adopciones_count: 67
        }
      ];

      try {
        const data = await fetchFundaciones(searchTerm, filters.estado, filters.ciudad);
        setFundaciones(data);
      } catch (apiError) {
        console.warn('API no disponible, usando datos mock:', apiError);
        setFundaciones(mockFundaciones);
      }
    } catch (error) {
      console.error('Error loading fundaciones:', error);
      toast.error('Error al cargar las fundaciones');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadFundaciones();
  }, [searchTerm, filters.estado, filters.ciudad]); // Recargar fundaciones cuando cambien los filtros

  const handleAprobar = async (id) => {
    try {
      await aprobarFundacion(id);
      setFundaciones(fundaciones.map(f => 
        f.id === id ? { ...f, estado: 'aprobada' } : f
      ));
      toast.success('Fundación aprobada correctamente');
    } catch (error) {
      console.error('Error approving fundacion:', error);
      toast.error('Error al aprobar la fundación');
    }
  };

  const handleRechazar = async (id) => {
    try {
      await rechazarFundacion(id);
      setFundaciones(fundaciones.map(f => 
        f.id === id ? { ...f, estado: 'rechazada' } : f
      ));
      toast.success('Fundación rechazada correctamente');
    } catch (error) {
      console.error('Error rejecting fundacion:', error);
      toast.error('Error al rechazar la fundación');
    }
  };

  const handleEliminar = async (id) => {
    try {
      await eliminarFundacion(id);
      setFundaciones(fundaciones.filter(f => f.id !== id));
      toast.success('Fundación eliminada correctamente');
      setShowDeleteModal(false);
      setSelectedFundacion(null);
    } catch (error) {
      console.error('Error deleting fundacion:', error);
      toast.error('Error al eliminar la fundación');
    }
  };

  const handleEdit = useCallback((id) => {
    navigate(`/admin/fundaciones/${id}/editar`);
  }, [navigate]);

  const filteredFundaciones = fundaciones.filter(fundacion => {
    // Verificar que fundacion y sus propiedades existan
    if (!fundacion || !fundacion.nombre) {
      return false;
    }

    const matchesSearch = 
      (fundacion.nombre || '').toLowerCase().includes(searchTerm.toLowerCase()) ||
      (fundacion.ciudad || '').toLowerCase().includes(searchTerm.toLowerCase()) ||
      (fundacion.email || '').toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesEstado = !filters.estado || fundacion.estado === filters.estado;
    const matchesCiudad = !filters.ciudad || fundacion.ciudad === filters.ciudad;

    return matchesSearch && matchesEstado && matchesCiudad;
  });

  const getStatusBadge = (estado) => {
    const badges = {
      aprobada: { color: 'bg-green-100 text-green-800', icon: CheckCircleIcon },
      pendiente: { color: 'bg-yellow-100 text-yellow-800', icon: ClockIcon },
      rechazada: { color: 'bg-red-100 text-red-800', icon: XCircleIcon }
    };
    
    const badge = badges[estado] || badges.pendiente;
    const Icon = badge.icon;
    
    return (
      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${badge.color}`}>
        <Icon className="w-3 h-3 mr-1" />
        {estado.charAt(0).toUpperCase() + estado.slice(1)}
      </span>
    );
  };

  const getEstadisticas = () => {
    const total = fundaciones.length;
    const aprobadas = fundaciones.filter(f => f.estado === 'aprobada').length;
    const pendientes = fundaciones.filter(f => f.estado === 'pendiente').length;
    const rechazadas = fundaciones.filter(f => f.estado === 'rechazada').length;
    
    return { total, aprobadas, pendientes, rechazadas };
  };

  const stats = getEstadisticas();

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
          <h1 className="text-3xl font-bold text-gray-900">Gestión de Fundaciones</h1>
          <p className="text-gray-600 mt-2">Administra fundaciones y organizaciones de rescate</p>
        </div>
        <div className="mt-4 sm:mt-0">
          <button className="inline-flex items-center px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors duration-200">
            <PlusIcon className="w-5 h-5 mr-2" />
            Nueva Fundación
          </button>
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
              <p className="text-sm font-medium text-gray-600">Total Fundaciones</p>
              <p className="text-2xl font-bold text-gray-900">{stats.total}</p>
            </div>
            <div className="p-3 rounded-lg bg-gradient-to-br from-blue-500 to-indigo-500">
              <BuildingOfficeIcon className="w-6 h-6 text-white" />
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
              <p className="text-sm font-medium text-gray-600">Aprobadas</p>
              <p className="text-2xl font-bold text-green-600">{stats.aprobadas}</p>
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
              <p className="text-sm font-medium text-gray-600">Pendientes</p>
              <p className="text-2xl font-bold text-yellow-600">{stats.pendientes}</p>
            </div>
            <div className="p-3 rounded-lg bg-gradient-to-br from-yellow-500 to-orange-500">
              <ClockIcon className="w-6 h-6 text-white" />
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
              <p className="text-sm font-medium text-gray-600">Rechazadas</p>
              <p className="text-2xl font-bold text-red-600">{stats.rechazadas}</p>
            </div>
            <div className="p-3 rounded-lg bg-gradient-to-br from-red-500 to-pink-500">
              <XCircleIcon className="w-6 h-6 text-white" />
            </div>
          </div>
        </motion.div>
      </div>

      {/* Search and Filters */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between space-y-4 lg:space-y-0">
          <div className="relative flex-1 max-w-md">
            <MagnifyingGlassIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
            <input
              type="text"
              placeholder="Buscar fundaciones..."
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
                  <label className="block text-sm font-medium text-gray-700 mb-2">Estado</label>
                  <select
                    value={filters.estado}
                    onChange={(e) => setFilters({ ...filters, estado: e.target.value })}
                    className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                  >
                    <option value="">Todos</option>
                    <option value="aprobada">Aprobada</option>
                    <option value="pendiente">Pendiente</option>
                    <option value="rechazada">Rechazada</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Ciudad</label>
                  <select
                    value={filters.ciudad}
                    onChange={(e) => setFilters({ ...filters, ciudad: e.target.value })}
                    className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                  >
                    <option value="">Todas</option>
                    <option value="Bogotá">Bogotá</option>
                    <option value="Medellín">Medellín</option>
                    <option value="Cali">Cali</option>
                    <option value="Barranquilla">Barranquilla</option>
                  </select>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Fundaciones Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
        {filteredFundaciones.filter(fundacion => fundacion && fundacion.id).map((fundacion) => (
          <motion.div
            key={fundacion.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden hover:shadow-md transition-shadow duration-200"
          >
            <div className="p-6">
              <div className="flex items-start justify-between mb-4">
                <div className="flex items-center space-x-3">
                  <div className="w-12 h-12 bg-gradient-to-br from-purple-500 to-blue-500 rounded-lg flex items-center justify-center">
                    <BuildingOfficeIcon className="w-6 h-6 text-white" />
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900">{fundacion.nombre || 'Sin nombre'}</h3>
                    <p className="text-sm text-gray-500">{fundacion.ciudad || 'Sin ciudad'}</p>
                  </div>
                </div>
                {getStatusBadge(fundacion.estado)}
              </div>

              <p className="text-sm text-gray-600 mb-4 line-clamp-2">{fundacion.descripcion || 'Sin descripción'}</p>

              <div className="space-y-2 mb-4">
                <div className="flex items-center text-sm text-gray-500">
                  <MapPinIcon className="w-4 h-4 mr-2" />
                  {fundacion.direccion || 'Sin dirección'}
                </div>
                <div className="flex items-center text-sm text-gray-500">
                  <PhoneIcon className="w-4 h-4 mr-2" />
                  {fundacion.telefono || 'Sin teléfono'}
                </div>
                <div className="flex items-center text-sm text-gray-500">
                  <EnvelopeIcon className="w-4 h-4 mr-2" />
                  {fundacion.email || 'Sin email'}
                </div>
              </div>

              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center space-x-4 text-sm">
                  <div className="flex items-center text-gray-600">
                    <HeartIcon className="w-4 h-4 mr-1" />
                    {fundacion.mascotas_count || 0} mascotas
                  </div>
                  <div className="flex items-center text-gray-600">
                    <CheckCircleIcon className="w-4 h-4 mr-1" />
                    {fundacion.adopciones_count || 0} adopciones
                  </div>
                </div>
              </div>

              <div className="flex items-center space-x-2">
                <button
                  onClick={() => {
                    setSelectedFundacion(fundacion);
                    setShowDetailModal(true);
                  }}
                  className="flex-1 inline-flex items-center justify-center px-3 py-2 border border-gray-300 rounded-lg text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 transition-colors duration-200"
                >
                  <EyeIcon className="w-4 h-4 mr-1" />
                  Ver
                </button>
                
                {fundacion.estado === 'pendiente' && (
                  <>
                    <button
                      onClick={() => handleAprobar(fundacion.id)}
                      className="inline-flex items-center px-3 py-2 border border-transparent rounded-lg text-sm font-medium text-white bg-green-600 hover:bg-green-700 transition-colors duration-200"
                    >
                      <CheckCircleIcon className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => handleRechazar(fundacion.id)}
                      className="inline-flex items-center px-3 py-2 border border-transparent rounded-lg text-sm font-medium text-white bg-red-600 hover:bg-red-700 transition-colors duration-200"
                    >
                      <XCircleIcon className="w-4 h-4" />
                    </button>
                  </>
                )}
                
                <button
                  onClick={() => handleEdit(fundacion.id)}
                  className="inline-flex items-center px-3 py-2 border border-transparent rounded-lg text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 transition-colors duration-200"
                >
                  <PencilIcon className="w-4 h-4" />
                </button>
                
                <button
                  onClick={() => {
                    setSelectedFundacion(fundacion);
                    setShowDeleteModal(true);
                  }}
                  className="inline-flex items-center px-3 py-2 border border-transparent rounded-lg text-sm font-medium text-white bg-red-600 hover:bg-red-700 transition-colors duration-200"
                >
                  <TrashIcon className="w-4 h-4" />
                </button>
              </div>
            </div>
          </motion.div>
        ))}
      </div>

      {filteredFundaciones.length === 0 && (
        <div className="text-center py-12">
          <BuildingOfficeIcon className="mx-auto h-12 w-12 text-gray-400" />
          <h3 className="mt-2 text-sm font-medium text-gray-900">No se encontraron fundaciones</h3>
          <p className="mt-1 text-sm text-gray-500">
            Intenta ajustar los filtros o términos de búsqueda.
          </p>
        </div>
      )}

      {/* Detail Modal */}
      <AnimatePresence>
        {showDetailModal && selectedFundacion && (
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
                        Detalles de la Fundación
                      </h3>
                      
                      <div className="space-y-4">
                        <div>
                          <h4 className="font-medium text-gray-900 mb-2">{selectedFundacion.nombre}</h4>
                          <p className="text-sm text-gray-600">{selectedFundacion.descripcion}</p>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          <div className="space-y-2">
                            <div className="flex items-center text-sm">
                              <MapPinIcon className="w-4 h-4 mr-2 text-gray-400" />
                              <span className="font-medium">Dirección:</span>
                              <span className="ml-2">{selectedFundacion.direccion}</span>
                            </div>
                            <div className="flex items-center text-sm">
                              <PhoneIcon className="w-4 h-4 mr-2 text-gray-400" />
                              <span className="font-medium">Teléfono:</span>
                              <span className="ml-2">{selectedFundacion.telefono}</span>
                            </div>
                            <div className="flex items-center text-sm">
                              <EnvelopeIcon className="w-4 h-4 mr-2 text-gray-400" />
                              <span className="font-medium">Email:</span>
                              <span className="ml-2">{selectedFundacion.email}</span>
                            </div>
                            <div className="flex items-center text-sm">
                              <GlobeAltIcon className="w-4 h-4 mr-2 text-gray-400" />
                              <span className="font-medium">Sitio Web:</span>
                              <span className="ml-2">{selectedFundacion.sitio_web}</span>
                            </div>
                          </div>

                          <div className="space-y-2">
                            <div className="flex items-center text-sm">
                              <span className="font-medium">Estado:</span>
                              <span className="ml-2">{getStatusBadge(selectedFundacion.estado)}</span>
                            </div>
                            <div className="flex items-center text-sm">
                              <span className="font-medium">Fecha de Registro:</span>
                              <span className="ml-2">{new Date(selectedFundacion.fecha_registro).toLocaleDateString()}</span>
                            </div>
                            <div className="flex items-center text-sm">
                              <HeartIcon className="w-4 h-4 mr-2 text-gray-400" />
                              <span className="font-medium">Mascotas Actuales:</span>
                              <span className="ml-2">{selectedFundacion.mascotas_count}</span>
                            </div>
                            <div className="flex items-center text-sm">
                              <CheckCircleIcon className="w-4 h-4 mr-2 text-gray-400" />
                              <span className="font-medium">Adopciones Realizadas:</span>
                              <span className="ml-2">{selectedFundacion.adopciones_count}</span>
                            </div>
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

      {/* Delete Confirmation Modal */}
      <AnimatePresence>
        {showDeleteModal && selectedFundacion && (
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
                        Eliminar Fundación
                      </h3>
                      <div className="mt-2">
                        <p className="text-sm text-gray-500">
                          ¿Estás seguro de que quieres eliminar <strong>{selectedFundacion.nombre}</strong>? 
                          Esta acción no se puede deshacer.
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
                <div className="bg-gray-50 px-4 py-3 sm:px-6 sm:flex sm:flex-row-reverse">
                  <button
                    type="button"
                    onClick={() => handleEliminar(selectedFundacion.id)}
                    className="w-full inline-flex justify-center rounded-md border border-transparent shadow-sm px-4 py-2 bg-red-600 text-base font-medium text-white hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 sm:ml-3 sm:w-auto sm:text-sm"
                  >
                    Eliminar
                  </button>
                  <button
                    type="button"
                    onClick={() => setShowDeleteModal(false)}
                    className="mt-3 w-full inline-flex justify-center rounded-md border border-gray-300 shadow-sm px-4 py-2 bg-white text-base font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 sm:mt-0 sm:ml-3 sm:w-auto sm:text-sm"
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

export default GestionFundaciones;
