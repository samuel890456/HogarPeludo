import React, { useState, useEffect } from 'react';
import { 
  HeartIcon, 
  MagnifyingGlassIcon,
  FunnelIcon,
  PlusIcon,
  PencilIcon,
  TrashIcon,
  EyeIcon,
  CheckCircleIcon,
  XCircleIcon,
  ClockIcon
} from '@heroicons/react/24/outline';
import { motion, AnimatePresence } from 'framer-motion';
import { fetchMascotas, eliminarMascota } from '../../api/adminApi';
import { toast } from 'react-toastify';

const GestionMascotas = () => {
  const [mascotas, setMascotas] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [filters, setFilters] = useState({
    especie: '',
    estado: '',
    tamano: '',
    sexo: ''
  });
  const [showFilters, setShowFilters] = useState(false);
  const [selectedMascota, setSelectedMascota] = useState(null);
  const [showDeleteModal, setShowDeleteModal] = useState(false);

  useEffect(() => {
    loadMascotas();
  }, []);

  const loadMascotas = async () => {
    try {
      setLoading(true);
      
      // Intentar cargar desde la API
      try {
        const data = await fetchMascotas();
        
        // Verificar que data sea un array
        if (Array.isArray(data)) {
          setMascotas(data);
          return;
        } else {
          console.error('La API no devolvió un array:', data);
        }
      } catch (apiError) {
        console.error('Error al cargar desde API:', apiError);
      }
      
      // Si la API falla, usar datos mock
      const mockData = [
        {
          id: 1,
          nombre: 'Luna',
          especie: 'Perro',
          raza: 'Golden Retriever',
          edad: 3,
          sexo: 'Hembra',
          tamano: 'Grande',
          ubicacion: 'Bogotá',
          disponible: true,
          imagen_url: null
        },
        {
          id: 2,
          nombre: 'Max',
          especie: 'Gato',
          raza: 'Siamés',
          edad: 2,
          sexo: 'Macho',
          tamano: 'Mediano',
          ubicacion: 'Medellín',
          disponible: true,
          imagen_url: null
        },
        {
          id: 3,
          nombre: 'Bella',
          especie: 'Perro',
          raza: 'Poodle',
          edad: 1,
          sexo: 'Hembra',
          tamano: 'Pequeño',
          ubicacion: 'Cali',
          disponible: false,
          imagen_url: null
        }
      ];
      
      setMascotas(mockData);
      toast.info('Usando datos de demostración');
      
    } catch (error) {
      console.error('Error loading mascotas:', error);
      setMascotas([]);
      toast.error('Error al cargar las mascotas');
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id) => {
    try {
      await eliminarMascota(id);
      setMascotas(mascotas.filter(m => m.id !== id));
      toast.success('Mascota eliminada correctamente');
      setShowDeleteModal(false);
      setSelectedMascota(null);
    } catch (error) {
      console.error('Error deleting mascota:', error);
      toast.error('Error al eliminar la mascota');
    }
  };

  const filteredMascotas = Array.isArray(mascotas) ? mascotas.filter(mascota => {
    const matchesSearch = mascota.nombre.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         mascota.especie.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         (mascota.raza && mascota.raza.toLowerCase().includes(searchTerm.toLowerCase()));
    
    const matchesEspecie = !filters.especie || mascota.especie === filters.especie;
    const matchesEstado = !filters.estado || 
      (filters.estado === 'disponible' ? mascota.disponible : !mascota.disponible);
    const matchesTamano = !filters.tamano || mascota.tamano === filters.tamano;
    const matchesSexo = !filters.sexo || mascota.sexo === filters.sexo;

    return matchesSearch && matchesEspecie && matchesEstado && matchesTamano && matchesSexo;
  }) : [];

  const getStatusBadge = (disponible) => {
    if (disponible) {
      return (
        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
          <CheckCircleIcon className="w-3 h-3 mr-1" />
          Disponible
        </span>
      );
    } else {
      return (
        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-red-100 text-red-800">
          <XCircleIcon className="w-3 h-3 mr-1" />
          Adoptada
        </span>
      );
    }
  };

  const getEspecieIcon = (especie) => {
    return <HeartIcon className="w-4 h-4 text-pink-500" />;
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
          <h1 className="text-3xl font-bold text-gray-900">Gestión de Mascotas</h1>
          <p className="text-gray-600 mt-2">Administra todas las mascotas registradas en el sistema</p>
        </div>
        <div className="mt-4 sm:mt-0">
          <button className="inline-flex items-center px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors duration-200">
            <PlusIcon className="w-5 h-5 mr-2" />
            Nueva Mascota
          </button>
        </div>
      </div>

      {/* Search and Filters */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between space-y-4 lg:space-y-0">
          {/* Search */}
          <div className="relative flex-1 max-w-md">
            <MagnifyingGlassIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
            <input
              type="text"
              placeholder="Buscar mascotas..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
            />
          </div>

          {/* Filter Toggle */}
          <button
            onClick={() => setShowFilters(!showFilters)}
            className="inline-flex items-center px-4 py-2 border border-gray-300 rounded-lg text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 transition-colors duration-200"
          >
            <FunnelIcon className="w-4 h-4 mr-2" />
            Filtros
          </button>
        </div>

        {/* Filters Panel */}
        <AnimatePresence>
          {showFilters && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              className="mt-6 pt-6 border-t border-gray-200"
            >
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
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
                    <option value="Otro">Otro</option>
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
                    <option value="disponible">Disponible</option>
                    <option value="adoptada">Adoptada</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Tamaño</label>
                  <select
                    value={filters.tamano}
                    onChange={(e) => setFilters({ ...filters, tamano: e.target.value })}
                    className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                  >
                    <option value="">Todos</option>
                    <option value="Pequeño">Pequeño</option>
                    <option value="Mediano">Mediano</option>
                    <option value="Grande">Grande</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Sexo</label>
                  <select
                    value={filters.sexo}
                    onChange={(e) => setFilters({ ...filters, sexo: e.target.value })}
                    className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                  >
                    <option value="">Todos</option>
                    <option value="Macho">Macho</option>
                    <option value="Hembra">Hembra</option>
                  </select>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Results Count */}
      <div className="flex items-center justify-between">
        <p className="text-sm text-gray-600">
          {filteredMascotas.length} mascota{filteredMascotas.length !== 1 ? 's' : ''} encontrada{filteredMascotas.length !== 1 ? 's' : ''}
        </p>
      </div>

      {/* Mascotas Table */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Mascota
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Especie/Raza
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Edad/Sexo
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Ubicación
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
              {filteredMascotas.map((mascota) => (
                <motion.tr
                  key={mascota.id}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="hover:bg-gray-50 transition-colors duration-200"
                >
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center">
                      <div className="flex-shrink-0 h-10 w-10">
                        <img
                          className="h-10 w-10 rounded-full object-cover"
                          src={mascota.imagen_url ? `http://localhost:5000/uploads/${mascota.imagen_url}` : '/paw-icon.png'}
                          alt={mascota.nombre}
                        />
                      </div>
                      <div className="ml-4">
                        <div className="text-sm font-medium text-gray-900">{mascota.nombre}</div>
                        <div className="text-sm text-gray-500">ID: {mascota.id}</div>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center">
                      {getEspecieIcon(mascota.especie)}
                      <div className="ml-2">
                        <div className="text-sm font-medium text-gray-900">{mascota.especie}</div>
                        <div className="text-sm text-gray-500">{mascota.raza || 'Sin raza'}</div>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-900">{mascota.edad} años</div>
                    <div className="text-sm text-gray-500">{mascota.sexo}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-900">{mascota.ubicacion}</div>
                    <div className="text-sm text-gray-500">{mascota.tamano}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    {getStatusBadge(mascota.disponible)}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                    <div className="flex items-center space-x-2">
                      <button className="text-blue-600 hover:text-blue-900 transition-colors duration-200">
                        <EyeIcon className="w-4 h-4" />
                      </button>
                      <button className="text-green-600 hover:text-green-900 transition-colors duration-200">
                        <PencilIcon className="w-4 h-4" />
                      </button>
                      <button 
                        onClick={() => {
                          setSelectedMascota(mascota);
                          setShowDeleteModal(true);
                        }}
                        className="text-red-600 hover:text-red-900 transition-colors duration-200"
                      >
                        <TrashIcon className="w-4 h-4" />
                      </button>
                    </div>
                  </td>
                </motion.tr>
              ))}
            </tbody>
          </table>
        </div>

        {filteredMascotas.length === 0 && (
          <div className="text-center py-12">
            <HeartIcon className="mx-auto h-12 w-12 text-gray-400" />
            <h3 className="mt-2 text-sm font-medium text-gray-900">No se encontraron mascotas</h3>
            <p className="mt-1 text-sm text-gray-500">
              Intenta ajustar los filtros o términos de búsqueda.
            </p>
          </div>
        )}
      </div>

      {/* Delete Confirmation Modal */}
      <AnimatePresence>
        {showDeleteModal && (
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
                        Eliminar Mascota
                      </h3>
                      <div className="mt-2">
                        <p className="text-sm text-gray-500">
                          ¿Estás seguro de que quieres eliminar a <strong>{selectedMascota?.nombre}</strong>? 
                          Esta acción no se puede deshacer.
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
                <div className="bg-gray-50 px-4 py-3 sm:px-6 sm:flex sm:flex-row-reverse">
                  <button
                    type="button"
                    onClick={() => handleDelete(selectedMascota?.id)}
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

export default GestionMascotas;