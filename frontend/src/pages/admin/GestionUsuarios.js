import React, { useState, useEffect } from 'react';
import { 
  UserGroupIcon, 
  MagnifyingGlassIcon,
  FunnelIcon,
  CheckCircleIcon,
  XCircleIcon,
  ClockIcon,
  EyeIcon,
  PencilIcon,
  TrashIcon,
  ShieldCheckIcon,
  UserIcon,
  BuildingOfficeIcon
} from '@heroicons/react/24/outline';
import { motion, AnimatePresence } from 'framer-motion';
import { fetchUsuarios, approveRoleRequest, rejectRoleRequest, toggleUsuario, fetchPendingRoleRequests } from '../../api/adminApi';
import { toast } from 'react-toastify';

const GestionUsuarios = () => {
  const [usuarios, setUsuarios] = useState([]);
  const [solicitudesRol, setSolicitudesRol] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [filters, setFilters] = useState({
    rol: '',
    estado: '',
    fechaRegistro: ''
  });
  const [showFilters, setShowFilters] = useState(false);
  const [selectedUser, setSelectedUser] = useState(null);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [activeTab, setActiveTab] = useState('usuarios');

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      setLoading(true);
      
      // Datos mock temporales para desarrollo
      const mockUsuarios = [
        {
          id: 1,
          nombre: 'Juan Pérez',
          email: 'juan@example.com',
          rol: 'usuario',
          bloqueado: false,
          fechaRegistro: '2024-01-15'
        },
        {
          id: 2,
          nombre: 'María García',
          email: 'maria@example.com',
          rol: 'refugio',
          bloqueado: false,
          fechaRegistro: '2024-01-10'
        },
        {
          id: 3,
          nombre: 'Carlos López',
          email: 'carlos@example.com',
          rol: 'admin',
          bloqueado: false,
          fechaRegistro: '2024-01-05'
        },
        {
          id: 4,
          nombre: 'Ana Martínez',
          email: 'ana@example.com',
          rol: 'usuario',
          bloqueado: true,
          fechaRegistro: '2024-01-20'
        }
      ];

      const mockSolicitudes = [
        {
          id: 1,
          usuario: {
            nombre: 'Pedro Rodríguez',
            email: 'pedro@example.com'
          },
          rolSolicitado: 'refugio',
          fechaSolicitud: '2024-01-25',
          motivo: 'Quiero ayudar a más mascotas necesitadas'
        },
        {
          id: 2,
          usuario: {
            nombre: 'Laura Sánchez',
            email: 'laura@example.com'
          },
          rolSolicitado: 'admin',
          fechaSolicitud: '2024-01-26',
          motivo: 'Tengo experiencia en gestión de organizaciones'
        }
      ];

      try {
        const [usuariosData, solicitudesData] = await Promise.all([
          fetchUsuarios(),
          fetchPendingRoleRequests()
        ]);
        setUsuarios(usuariosData);
        setSolicitudesRol(solicitudesData);
      } catch (apiError) {
        console.warn('API no disponible, usando datos mock:', apiError);
        setUsuarios(mockUsuarios);
        setSolicitudesRol(mockSolicitudes);
      }
    } catch (error) {
      console.error('Error loading data:', error);
      toast.error('Error al cargar los datos');
    } finally {
      setLoading(false);
    }
  };



  const handleAprobarRol = async (solicitudId) => {
    try {
      await approveRoleRequest(solicitudId);
      setSolicitudesRol(solicitudesRol.filter(s => s.id !== solicitudId));
      toast.success('Solicitud aprobada correctamente');
      loadData(); // Recargar datos para actualizar usuarios
    } catch (error) {
      console.error('Error approving role request:', error);
      toast.error('Error al aprobar la solicitud');
    }
  };

  const handleRechazarRol = async (solicitudId) => {
    try {
      await rejectRoleRequest(solicitudId);
      setSolicitudesRol(solicitudesRol.filter(s => s.id !== solicitudId));
      toast.success('Solicitud rechazada correctamente');
    } catch (error) {
      console.error('Error rejecting role request:', error);
      toast.error('Error al rechazar la solicitud');
    }
  };

  const handleBloquearUsuario = async (userId) => {
    try {
      await toggleUsuario(userId);
      setUsuarios(usuarios.map(u => 
        u.id === userId ? { ...u, bloqueado: true } : u
      ));
      toast.success('Usuario bloqueado correctamente');
    } catch (error) {
      console.error('Error blocking user:', error);
      toast.error('Error al bloquear el usuario');
    }
  };

  const handleDesbloquearUsuario = async (userId) => {
    try {
      await toggleUsuario(userId);
      setUsuarios(usuarios.map(u => 
        u.id === userId ? { ...u, bloqueado: false } : u
      ));
      toast.success('Usuario desbloqueado correctamente');
    } catch (error) {
      console.error('Error unblocking user:', error);
      toast.error('Error al desbloquear el usuario');
    }
  };

  const filteredUsuarios = usuarios.filter(usuario => {
    // Verificar que usuario y sus propiedades existan
    if (!usuario || !usuario.nombre || !usuario.email) {
      return false;
    }

    const matchesSearch = usuario.nombre.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         usuario.email.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesRol = !filters.rol || usuario.rol === filters.rol;
    const matchesEstado = !filters.estado || 
      (filters.estado === 'activo' ? !usuario.bloqueado : usuario.bloqueado);

    return matchesSearch && matchesRol && matchesEstado;
  });

  const getRolBadge = (rol) => {
    // Manejar caso donde rol es undefined o null
    if (!rol) {
      return (
        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-800">
          <UserIcon className="w-3 h-3 mr-1" />
          Sin Rol
        </span>
      );
    }

    const badges = {
      admin: { color: 'bg-red-100 text-red-800', icon: ShieldCheckIcon },
      refugio: { color: 'bg-blue-100 text-blue-800', icon: BuildingOfficeIcon },
      usuario: { color: 'bg-green-100 text-green-800', icon: UserIcon }
    };
    
    const badge = badges[rol] || badges.usuario;
    const Icon = badge.icon;
    
    return (
      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${badge.color}`}>
        <Icon className="w-3 h-3 mr-1" />
        {rol.charAt(0).toUpperCase() + rol.slice(1)}
      </span>
    );
  };

  const getEstadoBadge = (bloqueado) => {
    if (bloqueado) {
      return (
        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-red-100 text-red-800">
          <XCircleIcon className="w-3 h-3 mr-1" />
          Bloqueado
        </span>
      );
    } else {
      return (
        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
          <CheckCircleIcon className="w-3 h-3 mr-1" />
          Activo
        </span>
      );
    }
  };

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
          <h1 className="text-3xl font-bold text-gray-900">Gestión de Usuarios</h1>
          <p className="text-gray-600 mt-2">Administra usuarios y solicitudes de cambio de rol</p>
        </div>
      </div>

      {/* Tabs */}
      <div className="border-b border-gray-200">
        <nav className="-mb-px flex space-x-8">
          <button
            onClick={() => setActiveTab('usuarios')}
            className={`py-2 px-1 border-b-2 font-medium text-sm ${activeTab === 'usuarios' ? 'border-purple-500 text-purple-600' : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'}`}
          >
            Usuarios ({usuarios.length})
          </button>
          <button
            onClick={() => setActiveTab('solicitudes')}
            className={`py-2 px-1 border-b-2 font-medium text-sm ${activeTab === 'solicitudes' ? 'border-purple-500 text-purple-600' : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'}`}
          >
            Solicitudes de Rol ({solicitudesRol.length})
          </button>
        </nav>
      </div>

      {activeTab === 'usuarios' && (
        <>
          {/* Search and Filters */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
            <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between space-y-4 lg:space-y-0">
              <div className="relative flex-1 max-w-md">
                <MagnifyingGlassIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                <input
                  type="text"
                  placeholder="Buscar usuarios..."
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
                      <label className="block text-sm font-medium text-gray-700 mb-2">Rol</label>
                      <select
                        value={filters.rol}
                        onChange={(e) => setFilters({ ...filters, rol: e.target.value })}
                        className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                      >
                        <option value="">Todos</option>
                        <option value="admin">Admin</option>
                        <option value="refugio">Refugio</option>
                        <option value="usuario">Usuario</option>
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
                        <option value="activo">Activo</option>
                        <option value="bloqueado">Bloqueado</option>
                      </select>
                    </div>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          {/* Users Table */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Usuario
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Rol
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Estado
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Fecha de Registro
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Acciones
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {filteredUsuarios.filter(usuario => usuario && usuario.id).map((usuario) => (
                    <motion.tr
                      key={usuario.id}
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      className="hover:bg-gray-50 transition-colors duration-200"
                    >
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center">
                          <div className="flex-shrink-0 h-10 w-10">
                            <div className="h-10 w-10 rounded-full bg-gradient-to-br from-purple-500 to-blue-500 flex items-center justify-center">
                              <UserIcon className="w-5 h-5 text-white" />
                            </div>
                          </div>
                          <div className="ml-4">
                            <div className="text-sm font-medium text-gray-900">{usuario.nombre}</div>
                            <div className="text-sm text-gray-500">{usuario.email}</div>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        {getRolBadge(usuario.rol)}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        {getEstadoBadge(usuario.bloqueado)}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {new Date(usuario.fechaRegistro).toLocaleDateString()}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                        <div className="flex items-center space-x-2">
                          <button className="btn-icon text-blue-600 hover:text-blue-900">
                            <EyeIcon className="w-4 h-4" />
                          </button>
                          <button className="btn-icon text-green-600 hover:text-green-900">
                            <PencilIcon className="w-4 h-4" />
                          </button>
                          {usuario.bloqueado ? (
                            <button
                              onClick={() => handleDesbloquearUsuario(usuario.id)}
                              className="btn-icon text-green-600 hover:text-green-900"
                              title="Desbloquear usuario"
                            >
                              <CheckCircleIcon className="w-4 h-4" />
                            </button>
                          ) : (
                            <button
                              onClick={() => handleBloquearUsuario(usuario.id)}
                              className="btn-icon text-yellow-600 hover:text-yellow-900"
                              title="Bloquear usuario"
                            >
                              <XCircleIcon className="w-4 h-4" />
                            </button>
                          )}
                        </div>
                      </td>
                    </motion.tr>
                  ))}
                </tbody>
              </table>
            </div>

            {filteredUsuarios.length === 0 && (
              <div className="text-center py-12">
                <UserGroupIcon className="mx-auto h-12 w-12 text-gray-400" />
                <h3 className="mt-2 text-sm font-medium text-gray-900">No se encontraron usuarios</h3>
                <p className="mt-1 text-sm text-gray-500">
                  Intenta ajustar los filtros o términos de búsqueda.
                </p>
              </div>
            )}
          </div>
        </>
      )}

      {activeTab === 'solicitudes' && (
        <div className="space-y-6">
          {solicitudesRol.filter(solicitud => solicitud && solicitud.usuario).map((solicitud) => (
            <motion.div
              key={solicitud.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-white rounded-xl shadow-sm border border-gray-200 p-6"
            >
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <div className="flex items-center space-x-3 mb-4">
                    <div className="h-10 w-10 rounded-full bg-gradient-to-br from-purple-500 to-blue-500 flex items-center justify-center">
                      <UserIcon className="w-5 h-5 text-white" />
                    </div>
                    <div>
                      <h3 className="text-lg font-semibold text-gray-900">{solicitud.usuario.nombre}</h3>
                      <p className="text-sm text-gray-500">{solicitud.usuario.email}</p>
                    </div>
                    <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-yellow-100 text-yellow-800">
                      <ClockIcon className="w-3 h-3 mr-1" />
                      Pendiente
                    </span>
                  </div>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                    <div>
                      <p className="text-sm font-medium text-gray-700">Rol Solicitado</p>
                      <p className="text-sm text-gray-900">
                        {solicitud.rolSolicitado ? 
                          solicitud.rolSolicitado.charAt(0).toUpperCase() + solicitud.rolSolicitado.slice(1) : 
                          'Sin especificar'
                        }
                      </p>
                    </div>
                    <div>
                      <p className="text-sm font-medium text-gray-700">Fecha de Solicitud</p>
                      <p className="text-sm text-gray-900">{new Date(solicitud.fechaSolicitud).toLocaleDateString()}</p>
                    </div>
                  </div>
                  
                  <div>
                    <p className="text-sm font-medium text-gray-700 mb-2">Motivo de la Solicitud</p>
                    <p className="text-sm text-gray-900 bg-gray-50 p-3 rounded-lg">{solicitud.motivo}</p>
                  </div>
                </div>
                
                <div className="flex flex-col space-y-2 ml-6">
                  <button
                    onClick={() => handleAprobarRol(solicitud.id)}
                    className="btn-primary btn-icon"
                  >
                    <CheckCircleIcon className="w-4 h-4 mr-2" />
                    Aprobar
                  </button>
                  <button
                    onClick={() => handleRechazarRol(solicitud.id)}
                    className="btn-danger btn-icon"
                  >
                    <XCircleIcon className="w-4 h-4 mr-2" />
                    Rechazar
                  </button>
                </div>
              </div>
            </motion.div>
          ))}

          {solicitudesRol.length === 0 && (
            <div className="text-center py-12">
              <ClockIcon className="mx-auto h-12 w-12 text-gray-400" />
              <h3 className="mt-2 text-sm font-medium text-gray-900">No hay solicitudes pendientes</h3>
              <p className="mt-1 text-sm text-gray-500">
                No hay solicitudes de cambio de rol para revisar.
              </p>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default GestionUsuarios;
