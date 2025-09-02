import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  MagnifyingGlassIcon,
  FunnelIcon,
  HeartIcon,
  MapPinIcon,
  CalendarIcon,
  AdjustmentsHorizontalIcon,
  XMarkIcon
} from '@heroicons/react/24/outline';
import { HeartIcon as HeartSolidIcon } from '@heroicons/react/24/solid';
import MascotaCard from '../components/MascotaCard';
import LoadingSpinner from '../components/LoadingSpinner';
import { getMascotas } from '../api/api';

const Mascotas = () => {
  const [mascotas, setMascotas] = useState([]);
  const [filteredMascotas, setFilteredMascotas] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showFilters, setShowFilters] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedTipo, setSelectedTipo] = useState('');
  const [selectedEstado, setSelectedEstado] = useState('');
  const [selectedEdad, setSelectedEdad] = useState('');

  useEffect(() => {
    const cargarMascotas = async () => {
      try {
        const data = await getMascotas();
        setMascotas(data);
        setFilteredMascotas(data);
      } catch (error) {
        console.error('Error al cargar mascotas:', error);
      } finally {
        setLoading(false);
      }
    };

    cargarMascotas();
  }, []);

  useEffect(() => {
    const filtered = mascotas.filter(mascota => {
      const matchesSearch = mascota.nombre?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                           mascota.raza?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                           mascota.descripcion?.toLowerCase().includes(searchTerm.toLowerCase());
      
      const matchesTipo = !selectedTipo || mascota.tipo === selectedTipo;
      const matchesEstado = !selectedEstado || mascota.estado === selectedEstado;
      const matchesEdad = !selectedEdad || 
        (selectedEdad === 'cachorro' && mascota.edad <= 2) ||
        (selectedEdad === 'joven' && mascota.edad > 2 && mascota.edad <= 5) ||
        (selectedEdad === 'adulto' && mascota.edad > 5);

      return matchesSearch && matchesTipo && matchesEstado && matchesEdad;
    });

    setFilteredMascotas(filtered);
  }, [mascotas, searchTerm, selectedTipo, selectedEstado, selectedEdad]);

  const tipos = ['Perro', 'Gato', 'Ave', 'Otro'];
  const estados = ['Disponible', 'En proceso', 'Adoptado'];
  const edades = [
    { value: 'cachorro', label: 'Cachorro (0-2 años)' },
    { value: 'joven', label: 'Joven (3-5 años)' },
    { value: 'adulto', label: 'Adulto (6+ años)' }
  ];

  const clearFilters = () => {
    setSearchTerm('');
    setSelectedTipo('');
    setSelectedEstado('');
    setSelectedEdad('');
  };

  const hasActiveFilters = searchTerm || selectedTipo || selectedEstado || selectedEdad;

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero Section */}
      <section className="bg-gradient-to-br from-orange-500 to-pink-600 text-white py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="text-center"
          >
            <h1 className="text-4xl lg:text-5xl font-bold mb-4">
              Encuentra tu compañero perfecto
            </h1>
            <p className="text-xl text-orange-100 max-w-3xl mx-auto">
              Explora nuestra galería de mascotas que buscan un hogar lleno de amor. 
              Cada una tiene una historia única esperando ser contada.
            </p>
          </motion.div>
        </div>
      </section>

      {/* Search and Filters */}
      <section className="py-8 bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col lg:flex-row gap-4 items-center justify-between">
            {/* Search Bar */}
            <div className="relative flex-1 max-w-md">
              <MagnifyingGlassIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
              <input
                type="text"
                placeholder="Buscar mascotas por nombre, raza..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-orange-500 focus:border-transparent transition-all duration-200"
              />
            </div>

            {/* Filter Toggle */}
            <div className="flex items-center space-x-4">
              {hasActiveFilters && (
                <button
                  onClick={clearFilters}
                  className="btn-secondary btn-icon"
                >
                  <XMarkIcon className="w-4 h-4" />
                  <span>Limpiar filtros</span>
                </button>
              )}
              
              <button
                onClick={() => setShowFilters(!showFilters)}
                className="btn-primary btn-icon"
              >
                <FunnelIcon className="w-5 h-5" />
                <span>Filtros</span>
              </button>
            </div>
          </div>

          {/* Filters Panel */}
          <AnimatePresence>
            {showFilters && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                exit={{ opacity: 0, height: 0 }}
                transition={{ duration: 0.3 }}
                className="mt-6 p-6 bg-gray-50 rounded-2xl border border-gray-200"
              >
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  {/* Tipo Filter */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Tipo de Mascota
                    </label>
                    <select
                      value={selectedTipo}
                      onChange={(e) => setSelectedTipo(e.target.value)}
                      className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-orange-500 focus:border-transparent transition-all duration-200"
                    >
                      <option value="">Todos los tipos</option>
                      {tipos.map(tipo => (
                        <option key={tipo} value={tipo}>{tipo}</option>
                      ))}
                    </select>
                  </div>

                  {/* Estado Filter */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Estado
                    </label>
                    <select
                      value={selectedEstado}
                      onChange={(e) => setSelectedEstado(e.target.value)}
                      className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-orange-500 focus:border-transparent transition-all duration-200"
                    >
                      <option value="">Todos los estados</option>
                      {estados.map(estado => (
                        <option key={estado} value={estado}>{estado}</option>
                      ))}
                    </select>
                  </div>

                  {/* Edad Filter */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Rango de Edad
                    </label>
                    <select
                      value={selectedEdad}
                      onChange={(e) => setSelectedEdad(e.target.value)}
                      className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-orange-500 focus:border-transparent transition-all duration-200"
                    >
                      <option value="">Todas las edades</option>
                      {edades.map(edad => (
                        <option key={edad.value} value={edad.value}>{edad.label}</option>
                      ))}
                    </select>
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </section>

      {/* Results Section */}
      <section className="py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Results Header */}
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-8">
            <div>
              <h2 className="text-2xl font-bold text-gray-900 mb-2">
                Mascotas Disponibles
              </h2>
              <p className="text-gray-600">
                {filteredMascotas.length} mascota{filteredMascotas.length !== 1 ? 's' : ''} encontrada{filteredMascotas.length !== 1 ? 's' : ''}
                {hasActiveFilters && ' con los filtros aplicados'}
              </p>
            </div>
          </div>

          {/* Loading State */}
          {loading ? (
            <div className="flex justify-center items-center py-20">
              <LoadingSpinner />
            </div>
          ) : filteredMascotas.length === 0 ? (
            /* Empty State */
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="text-center py-20"
            >
              <div className="w-24 h-24 mx-auto mb-6 bg-gray-100 rounded-full flex items-center justify-center">
                <HeartIcon className="w-12 h-12 text-gray-400" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">
                No se encontraron mascotas
              </h3>
              <p className="text-gray-600 mb-6">
                {hasActiveFilters 
                  ? 'Intenta ajustar los filtros de búsqueda'
                  : 'No hay mascotas disponibles en este momento'
                }
              </p>
              {hasActiveFilters && (
                <button
                  onClick={clearFilters}
                  className="btn-primary"
                >
                  Limpiar filtros
                </button>
              )}
            </motion.div>
          ) : (
            /* Mascotas Grid */
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              <AnimatePresence>
                {filteredMascotas.map((mascota, index) => (
                  <motion.div
                    key={mascota.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5, delay: index * 0.1 }}
                    exit={{ opacity: 0, y: -20 }}
                  >
                    <MascotaCard mascota={mascota} />
                  </motion.div>
                ))}
              </AnimatePresence>
            </div>
          )}
        </div>
      </section>
    </div>
  );
};

export default Mascotas;