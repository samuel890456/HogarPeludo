import React, { useState, useEffect } from 'react';
import { 
  ClipboardDocumentListIcon,
  MagnifyingGlassIcon,
  FunnelIcon,
  CheckCircleIcon,
  XCircleIcon,
  ClockIcon,
  EyeIcon,
  CalendarIcon,
  UserIcon,
  HeartIcon,
  CheckBadgeIcon,
  XMarkIcon
} from '@heroicons/react/24/outline';
import { motion, AnimatePresence } from 'framer-motion';
import { fetchSolicitudes, aprobarSolicitud, rechazarSolicitud } from '../../api/adminApi';
import { toast } from 'react-toastify';

const GestionSolicitudes = () => {
  const [solicitudes, setSolicitudes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [filters, setFilters] = useState({
    estado: '',
    fecha: '',
    especie: ''
  });
  const [showFilters, setShowFilters] = useState(false);
  const [selectedSolicitud, setSelectedSolicitud] = useState(null);
  const [showDetailModal, setShowDetailModal] = useState(false);

  const loadSolicitudes = async () => {
    try {
      setLoading(true);
      const data = await fetchSolicitudes(searchTerm, filters.estado, filters.especie);
      setSolicitudes(data);
    } catch (error) {
      console.error('Error loading solicitudes:', error);
      toast.error('Error al cargar las solicitudes');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadSolicitudes();
  }, [searchTerm, filters.estado, filters.especie]); // Recargar solicitudes cuando cambien los filtros

  const handleAprobar = async (id) => {
    try {
      await aprobarSolicitud(id);
      setSolicitudes(solicitudes.map(s => 
        s.id === id ? { ...s, estado: 'aprobada' } : s
      ));
      toast.success('Solicitud aprobada correctamente');
    } catch (error) {
      console.error('Error approving solicitud:', error);
      toast.error('Error al aprobar la solicitud');
    }
  };

  const handleRechazar = async (id) => {
    try {
      await rechazarSolicitud(id);
      setSolicitudes(solicitudes.map(s => 
        s.id === id ? { ...s, estado: 'rechazada' } : s
      ));
      toast.success('Solicitud rechazada correctamente');
    } catch (error) {
      console.error('Error rejecting solicitud:', error);
      toast.error('Error al rechazar la solicitud');
    }
  };

  const filteredSolicitudes = solicitudes.filter(solicitud => {
    const matchesSearch = 
      solicitud.mascota_nombre?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      solicitud.adoptante_nombre?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      solicitud.mascota_especie?.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesEstado = !filters.estado || solicitud.estado === filters.estado;
    const matchesEspecie = !filters.especie || solicitud.mascota_especie === filters.especie;

    return matchesSearch && matchesEstado && matchesEspecie;
  });

  const getStatusBadge = (estado) => {
    const badges = {
      pendiente: { color: 'bg-yellow-100 text-yellow-800', icon: ClockIcon },
      aprobada: { color: 'bg-green-100 text-green-800', icon: CheckCircleIcon },
      rechazada: { color: 'bg-red-100 text-red-800', icon: XCircleIcon },
      completada: { color: 'bg-blue-100 text-blue-800', icon: CheckBadgeIcon }
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
    const total = solicitudes.length;
    const pendientes = solicitudes.filter(s => s.estado === 'pendiente').length;
    const aprobadas = solicitudes.filter(s => s.estado === 'aprobada').length;
    const rechazadas = solicitudes.filter(s => s.estado === 'rechazada').length;
    
    return { total, pendientes, aprobadas, rechazadas };
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
          <h1 className="text-3xl font-bold text-gray-900">Gestión de Solicitudes</h1>
          <p className="text-gray-600 mt-2">Administra todas las solicitudes de adopción</p>
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
              <p className="text-sm font-medium text-gray-600">Total Solicitudes</p>
              <p className="text-2xl font-bold text-gray-900">{stats.total}</p>
            </div>
            <div className="p-3 rounded-lg bg-gradient-to-br from-blue-500 to-indigo-500">
              <ClipboardDocumentListIcon className="w-6 h-6 text-white" />
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
          transition={{ delay: 0.2 }}
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
              placeholder="Buscar solicitudes..."
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
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Estado</label>
                  <select
                    value={filters.estado}
                    onChange={(e) => setFilters({ ...filters, estado: e.target.value })}
                    className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                  >
                    <option value="">Todos</option>
                    <option value="pendiente">Pendiente</option>
                    <option value="aprobada">Aprobada</option>
                    <option value="rechazada">Rechazada</option>
                    <option value="completada">Completada</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Especie</label>
                  <select
                    value={filters.especie}
                    onChange={(e) => setFilters({ ...filters, especie: e.target.value })}
                    className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                  >
                    <option value="">Todas</option>
                    <option value="Perro">Perro</option>
                    <option value="Gato">Gato</option>
                    <option value="Ave">Ave</option>
                    <option value="Roedor">Roedor</option>
                  </select>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Solicitudes Table */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Mascota
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Adoptante
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Fecha
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Estado
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Acciones
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {filteredSolicitudes.map((solicitud) => (
                <motion.tr
                  key={solicitud.id}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="hover:bg-gray-50 transition-colors duration-200"
                >
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center">
                      <div className="flex-shrink-0 h-10 w-10">
                        <img
                          className="h-10 w-10 rounded-full object-cover"
                          src={solicitud.mascota_imagen_url ? `http://localhost:5000/uploads/${solicitud.mascota_imagen_url}` : '/paw-icon.png'}
                          alt={solicitud.mascota_nombre}
                        />
                      </div>
                      <div className="ml-4">
                        <div className="text-sm font-medium text-gray-900">{solicitud.mascota_nombre}</div>
                        <div className="text-sm text-gray-500">{solicitud.mascota_especie}</div>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm font-medium text-gray-900">{solicitud.adoptante_nombre}</div>
                    <div className="text-sm text-gray-500">{solicitud.adoptante_email}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {new Date(solicitud.fecha_solicitud).toLocaleDateString()}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    {getStatusBadge(solicitud.estado)}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                    <div className="flex items-center space-x-2">
                      <button 
                        onClick={() => {
                          setSelectedSolicitud(solicitud);
                          setShowDetailModal(true);
                        }}
                        className="text-blue-600 hover:text-blue-900 transition-colors duration-200"
                        title="Ver detalles"
                      >
                        <EyeIcon className="w-4 h-4" />
                      </button>
                      
                      {solicitud.estado === 'pendiente' && (
                        <>
                          <button
                            onClick={() => handleAprobar(solicitud.id)}
                            className="text-green-600 hover:text-green-900 transition-colors duration-200"
                            title="Aprobar solicitud"
                          >
                            <CheckCircleIcon className="w-4 h-4" />
                          </button>
                          <button
                            onClick={() => handleRechazar(solicitud.id)}
                            className="text-red-600 hover:text-red-900 transition-colors duration-200"
                            title="Rechazar solicitud"
                          >
                            <XCircleIcon className="w-4 h-4" />
                          </button>
                        </>
                      )}
                    </div>
                  </td>
                </motion.tr>
              ))}
            </tbody>
          </table>
        </div>

        {filteredSolicitudes.length === 0 && (
          <div className="text-center py-12">
            <ClipboardDocumentListIcon className="mx-auto h-12 w-12 text-gray-400" />
            <h3 className="mt-2 text-sm font-medium text-gray-900">No se encontraron solicitudes</h3>
            <p className="mt-1 text-sm text-gray-500">
              Intenta ajustar los filtros o términos de búsqueda.
            </p>
          </div>
        )}
      </div>

      {/* Detail Modal */}
      <AnimatePresence>
        {showDetailModal && selectedSolicitud && (
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
                        Detalles de la Solicitud
                      </h3>
                      
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        {/* Mascota Info */}
                        <div>
                          <h4 className="font-medium text-gray-900 mb-3 flex items-center">
                            <HeartIcon className="w-5 h-5 mr-2 text-pink-500" />
                            Información de la Mascota
                          </h4>
                          <div className="space-y-2 text-sm">
                            <p><span className="font-medium">Nombre:</span> {selectedSolicitud.mascota_nombre}</p>
                            <p><span className="font-medium">Especie:</span> {selectedSolicitud.mascota_especie}</p>
                            <p><span className="font-medium">Raza:</span> {selectedSolicitud.mascota_raza || 'No especificada'}</p>
                            <p><span className="font-medium">Edad:</span> {selectedSolicitud.mascota_edad} años</p>
                          </div>
                        </div>

                        {/* Adoptante Info */}
                        <div>
                          <h4 className="font-medium text-gray-900 mb-3 flex items-center">
                            <UserIcon className="w-5 h-5 mr-2 text-blue-500" />
                            Información del Adoptante
                          </h4>
                          <div className="space-y-2 text-sm">
                            <p><span className="font-medium">Nombre:</span> {selectedSolicitud.adoptante_nombre}</p>
                            <p><span className="font-medium">Email:</span> {selectedSolicitud.adoptante_email}</p>
                            <p><span className="font-medium">Teléfono:</span> {selectedSolicitud.adoptante_telefono || 'No especificado'}</p>
                          </div>
                        </div>
                      </div>

                      {/* Solicitud Info */}
                      <div className="mt-6">
                        <h4 className="font-medium text-gray-900 mb-3 flex items-center">
                          <CalendarIcon className="w-5 h-5 mr-2 text-green-500" />
                          Información de la Solicitud
                        </h4>
                        <div className="space-y-2 text-sm">
                          <p><span className="font-medium">Fecha:</span> {new Date(selectedSolicitud.fecha_solicitud).toLocaleDateString()}</p>
                          <p><span className="font-medium">Estado:</span> {getStatusBadge(selectedSolicitud.estado)}</p>
                          {selectedSolicitud.motivo && (
                            <div>
                              <p className="font-medium">Motivo:</p>
                              <p className="text-gray-600 bg-gray-50 p-3 rounded-lg mt-1">{selectedSolicitud.motivo}</p>
                            </div>
                          )}
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
    </div>
  );
};

export default GestionSolicitudes;
