import React, { useState, useEffect } from 'react';
import { 
  ChartBarIcon,
  CalendarIcon,
  HeartIcon,
  UserGroupIcon,
  BuildingOfficeIcon,
  DocumentTextIcon,
  ArrowUpIcon,
  ArrowDownIcon
} from '@heroicons/react/24/outline';
import { motion } from 'framer-motion';

const Reportes = () => {
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState({
    adopcionesPorMes: [],
    especiesMasAdoptadas: [],
    fundacionesActivas: [],
    usuariosNuevos: []
  });

  useEffect(() => {
    // Simular carga de datos
    setTimeout(() => {
      setStats({
        adopcionesPorMes: [
          { mes: 'Enero', total: 15 },
          { mes: 'Febrero', total: 22 },
          { mes: 'Marzo', total: 18 },
          { mes: 'Abril', total: 25 },
          { mes: 'Mayo', total: 30 },
          { mes: 'Junio', total: 28 }
        ],
        especiesMasAdoptadas: [
          { especie: 'Perro', total: 45 },
          { especie: 'Gato', total: 38 },
          { especie: 'Ave', total: 12 },
          { especie: 'Roedor', total: 8 }
        ],
        fundacionesActivas: [
          { nombre: 'Fundación Amor Animal', mascotas: 25 },
          { nombre: 'Refugio Esperanza', mascotas: 18 },
          { nombre: 'Casa de Mascotas', mascotas: 15 },
          { nombre: 'Protectora Feliz', mascotas: 12 }
        ],
        usuariosNuevos: [
          { mes: 'Enero', total: 45 },
          { mes: 'Febrero', total: 52 },
          { mes: 'Marzo', total: 48 },
          { mes: 'Abril', total: 61 },
          { mes: 'Mayo', total: 58 },
          { mes: 'Junio', total: 65 }
        ]
      });
      setLoading(false);
    }, 1000);
  }, []);

  const StatCard = ({ title, value, change, changeType, icon: Icon, color }) => (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-white rounded-xl shadow-sm border border-gray-200 p-6"
    >
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm font-medium text-gray-600">{title}</p>
          <p className="text-2xl font-bold text-gray-900 mt-2">{value}</p>
          {change && (
            <div className="flex items-center mt-2">
              {changeType === 'up' ? (
                <ArrowUpIcon className="w-4 h-4 text-green-500 mr-1" />
              ) : (
                <ArrowDownIcon className="w-4 h-4 text-red-500 mr-1" />
              )}
              <span className={`text-sm font-medium ${
                changeType === 'up' ? 'text-green-600' : 'text-red-600'
              }`}>
                {change}% vs mes anterior
              </span>
            </div>
          )}
        </div>
        <div className={`p-3 rounded-lg ${color}`}>
          <Icon className="w-6 h-6 text-white" />
        </div>
      </div>
    </motion.div>
  );

  const ChartCard = ({ title, children, className = "" }) => (
    <div className={`bg-white rounded-xl shadow-sm border border-gray-200 p-6 ${className}`}>
      <h3 className="text-lg font-semibold text-gray-900 mb-4">{title}</h3>
      {children}
    </div>
  );

  const SimpleBarChart = ({ data, color = "bg-blue-500" }) => (
    <div className="space-y-3">
      {data.map((item, index) => (
        <div key={index} className="flex items-center space-x-3">
          <div className="flex-1">
            <div className="flex justify-between text-sm mb-1">
              <span className="font-medium text-gray-700">{item.mes || item.especie || item.nombre}</span>
              <span className="text-gray-500">{item.total || item.mascotas}</span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-2">
              <div
                className={`${color} h-2 rounded-full transition-all duration-300`}
                style={{ 
                  width: `${Math.max((item.total || item.mascotas) / Math.max(...data.map(d => d.total || d.mascotas)) * 100, 10)}%` 
                }}
              />
            </div>
          </div>
        </div>
      ))}
    </div>
  );

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-600"></div>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-gray-900">Reportes y Estadísticas</h1>
        <p className="text-gray-600 mt-2">Análisis detallado del sistema de adopción</p>
      </div>

      {/* Quick Stats */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard
          title="Total Adopciones"
          value="138"
          change={12}
          changeType="up"
          icon={HeartIcon}
          color="bg-gradient-to-br from-pink-500 to-rose-500"
        />
        <StatCard
          title="Usuarios Nuevos"
          value="329"
          change={8}
          changeType="up"
          icon={UserGroupIcon}
          color="bg-gradient-to-br from-blue-500 to-indigo-500"
        />
        <StatCard
          title="Fundaciones Activas"
          value="24"
          change={3}
          changeType="up"
          icon={BuildingOfficeIcon}
          color="bg-gradient-to-br from-green-500 to-emerald-500"
        />
        <StatCard
          title="Tasa de Éxito"
          value="85%"
          change={5}
          changeType="up"
          icon={ChartBarIcon}
          color="bg-gradient-to-br from-purple-500 to-violet-500"
        />
      </div>

      {/* Charts Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Adopciones por Mes */}
        <ChartCard title="Adopciones por Mes">
          <SimpleBarChart data={stats.adopcionesPorMes} color="bg-blue-500" />
        </ChartCard>

        {/* Especies Más Adoptadas */}
        <ChartCard title="Especies Más Adoptadas">
          <SimpleBarChart data={stats.especiesMasAdoptadas} color="bg-green-500" />
        </ChartCard>

        {/* Fundaciones Activas */}
        <ChartCard title="Fundaciones Más Activas" className="lg:col-span-2">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <SimpleBarChart data={stats.fundacionesActivas} color="bg-purple-500" />
            <div className="space-y-4">
              <h4 className="font-medium text-gray-900">Resumen de Fundaciones</h4>
              <div className="space-y-3">
                <div className="flex justify-between items-center p-3 bg-gray-50 rounded-lg">
                  <span className="text-sm font-medium text-gray-700">Total Fundaciones</span>
                  <span className="text-sm text-gray-900 font-semibold">24</span>
                </div>
                <div className="flex justify-between items-center p-3 bg-gray-50 rounded-lg">
                  <span className="text-sm font-medium text-gray-700">Mascotas en Total</span>
                  <span className="text-sm text-gray-900 font-semibold">70</span>
                </div>
                <div className="flex justify-between items-center p-3 bg-gray-50 rounded-lg">
                  <span className="text-sm font-medium text-gray-700">Promedio por Fundación</span>
                  <span className="text-sm text-gray-900 font-semibold">2.9</span>
                </div>
              </div>
            </div>
          </div>
        </ChartCard>
      </div>

      {/* Detailed Analytics */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Usuarios Nuevos */}
        <ChartCard title="Usuarios Nuevos por Mes">
          <SimpleBarChart data={stats.usuariosNuevos} color="bg-indigo-500" />
        </ChartCard>

        {/* Performance Metrics */}
        <ChartCard title="Métricas de Rendimiento">
          <div className="space-y-4">
            <div className="flex justify-between items-center p-3 bg-green-50 rounded-lg">
              <span className="text-sm font-medium text-green-700">Tiempo Promedio de Adopción</span>
              <span className="text-sm text-green-900 font-semibold">12 días</span>
            </div>
            <div className="flex justify-between items-center p-3 bg-blue-50 rounded-lg">
              <span className="text-sm font-medium text-blue-700">Solicitudes por Mascota</span>
              <span className="text-sm text-blue-900 font-semibold">3.2</span>
            </div>
            <div className="flex justify-between items-center p-3 bg-purple-50 rounded-lg">
              <span className="text-sm font-medium text-purple-700">Tasa de Retención</span>
              <span className="text-sm text-purple-900 font-semibold">92%</span>
            </div>
          </div>
        </ChartCard>

        {/* Recent Activity */}
        <ChartCard title="Actividad Reciente">
          <div className="space-y-3">
            <div className="flex items-center space-x-3 p-2 hover:bg-gray-50 rounded-lg">
              <div className="w-2 h-2 bg-green-500 rounded-full"></div>
              <div className="flex-1">
                <p className="text-sm font-medium text-gray-900">Nueva adopción completada</p>
                <p className="text-xs text-gray-500">Hace 2 horas</p>
              </div>
            </div>
            <div className="flex items-center space-x-3 p-2 hover:bg-gray-50 rounded-lg">
              <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
              <div className="flex-1">
                <p className="text-sm font-medium text-gray-900">Nuevo usuario registrado</p>
                <p className="text-xs text-gray-500">Hace 4 horas</p>
              </div>
            </div>
            <div className="flex items-center space-x-3 p-2 hover:bg-gray-50 rounded-lg">
              <div className="w-2 h-2 bg-purple-500 rounded-full"></div>
              <div className="flex-1">
                <p className="text-sm font-medium text-gray-900">Nueva mascota publicada</p>
                <p className="text-xs text-gray-500">Hace 6 horas</p>
              </div>
            </div>
          </div>
        </ChartCard>
      </div>

      {/* Export Section */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h3 className="text-lg font-semibold text-gray-900">Exportar Reportes</h3>
            <p className="text-gray-600 mt-1">Descarga reportes detallados en diferentes formatos</p>
          </div>
          <div className="mt-4 sm:mt-0 flex space-x-3">
            <button className="inline-flex items-center px-4 py-2 border border-gray-300 rounded-lg text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 transition-colors duration-200">
              <DocumentTextIcon className="w-4 h-4 mr-2" />
              Exportar PDF
            </button>
            <button className="inline-flex items-center px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors duration-200">
              <ChartBarIcon className="w-4 h-4 mr-2" />
              Exportar Excel
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Reportes; 