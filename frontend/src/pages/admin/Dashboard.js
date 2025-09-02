import React, { useState, useEffect } from 'react';
import { 
  HeartIcon, 
  UserGroupIcon, 
  BuildingOfficeIcon, 
  ClipboardDocumentListIcon,
  CheckCircleIcon,
  ClockIcon,
  XCircleIcon,
  ArrowUpIcon,
  ArrowDownIcon,
  EyeIcon,
  PlusIcon
} from '@heroicons/react/24/outline';
import { motion } from 'framer-motion';
import { fetchResumen } from '../../api/adminApi';
import { toast } from 'react-toastify';
import { useNavigate } from 'react-router-dom';

const Dashboard = () => {
  const [stats, setStats] = useState({
    totalMascotas: 0,
    totalSolicitudes: 0,
    totalUsuarios: 0,
    totalFundaciones: 0
  });
  const [loading, setLoading] = useState(true);
  const [recentActivity, setRecentActivity] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    const loadDashboardData = async () => {
      try {
        setLoading(true);
        const data = await fetchResumen();
        setStats(data);
        
        // Simular actividad reciente (en un caso real vendría del backend)
        setRecentActivity([
          {
            id: 1,
            type: 'solicitud',
            message: 'Nueva solicitud de adopción para "Luna"',
            time: '2 minutos',
            user: 'María González'
          },
          {
            id: 2,
            type: 'mascota',
            message: 'Nueva mascota registrada: "Max"',
            time: '15 minutos',
            user: 'Fundación Amor Animal'
          },
          {
            id: 3,
            type: 'usuario',
            message: 'Nuevo usuario registrado',
            time: '1 hora',
            user: 'Carlos Rodríguez'
          },
          {
            id: 4,
            type: 'adopcion',
            message: 'Adopción exitosa: "Bella" fue adoptada',
            time: '2 horas',
            user: 'Ana Martínez'
          }
        ]);
      } catch (error) {
        console.error('Error loading dashboard data:', error);
        toast.error('Error al cargar los datos del dashboard');
      } finally {
        setLoading(false);
      }
    };

    loadDashboardData();
  }, []);

  const StatCard = ({ title, value, icon: Icon, change, changeType, color }) => (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 hover:shadow-md transition-shadow duration-200"
    >
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm font-medium text-gray-600">{title}</p>
          <p className="text-3xl font-bold text-gray-900 mt-2">{value}</p>
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
                {change}% desde el mes pasado
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

  const QuickActionCard = ({ title, description, icon: Icon, action, color }) => (
    <motion.div
      whileHover={{ scale: 1.02 }}
      whileTap={{ scale: 0.98 }}
      className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 cursor-pointer hover:shadow-md transition-all duration-200"
      onClick={action}
    >
      <div className="flex items-center space-x-4">
        <div className={`p-3 rounded-lg ${color}`}>
          <Icon className="w-6 h-6 text-white" />
        </div>
        <div>
          <h3 className="text-lg font-semibold text-gray-900">{title}</h3>
          <p className="text-sm text-gray-600">{description}</p>
        </div>
      </div>
    </motion.div>
  );

  const ActivityItem = ({ activity }) => {
    const getIcon = (type) => {
      switch (type) {
        case 'solicitud': return ClipboardDocumentListIcon;
        case 'mascota': return HeartIcon;
        case 'usuario': return UserGroupIcon;
        case 'adopcion': return CheckCircleIcon;
        default: return EyeIcon;
      }
    };

    const getColor = (type) => {
      switch (type) {
        case 'solicitud': return 'text-blue-600 bg-blue-100';
        case 'mascota': return 'text-green-600 bg-green-100';
        case 'usuario': return 'text-purple-600 bg-purple-100';
        case 'adopcion': return 'text-orange-600 bg-orange-100';
        default: return 'text-gray-600 bg-gray-100';
      }
    };

    const Icon = getIcon(activity.type);

    return (
      <div className="flex items-center space-x-4 p-4 hover:bg-gray-50 rounded-lg transition-colors duration-200">
        <div className={`p-2 rounded-lg ${getColor(activity.type)}`}>
          <Icon className="w-5 h-5" />
        </div>
        <div className="flex-1 min-w-0">
          <p className="text-sm font-medium text-gray-900">{activity.message}</p>
          <p className="text-sm text-gray-500">por {activity.user}</p>
        </div>
        <div className="text-sm text-gray-400">{activity.time}</div>
      </div>
    );
  };

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
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900">Dashboard</h1>
        <p className="text-gray-600 mt-2">Bienvenido al panel de administración de Hogar Peludo</p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard
          title="Total Mascotas"
          value={stats.totalMascotas}
          icon={HeartIcon}
          change={12}
          changeType="up"
          color="bg-gradient-to-br from-pink-500 to-rose-500"
        />
        <StatCard
          title="Solicitudes"
          value={stats.totalSolicitudes}
          icon={ClipboardDocumentListIcon}
          change={8}
          changeType="up"
          color="bg-gradient-to-br from-blue-500 to-indigo-500"
        />
        <StatCard
          title="Usuarios Registrados"
          value={stats.totalUsuarios}
          icon={UserGroupIcon}
          change={15}
          changeType="up"
          color="bg-gradient-to-br from-purple-500 to-violet-500"
        />
        <StatCard
          title="Fundaciones"
          value={stats.totalFundaciones}
          icon={BuildingOfficeIcon}
          change={3}
          changeType="up"
          color="bg-gradient-to-br from-green-500 to-emerald-500"
        />
      </div>

      {/* Quick Actions */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <QuickActionCard
          title="Gestionar Mascotas"
          description="Ver, editar y administrar todas las mascotas"
          icon={HeartIcon}
          action={() => navigate('/admin/mascotas')}
          color="bg-gradient-to-br from-pink-500 to-rose-500"
        />
        <QuickActionCard
          title="Revisar Solicitudes"
          description="Aprobar o rechazar solicitudes de adopción"
          icon={ClipboardDocumentListIcon}
          action={() => navigate('/admin/solicitudes')}
          color="bg-gradient-to-br from-blue-500 to-indigo-500"
        />
        <QuickActionCard
          title="Administrar Usuarios"
          description="Gestionar usuarios y permisos del sistema"
          icon={UserGroupIcon}
          action={() => navigate('/admin/usuarios')}
          color="bg-gradient-to-br from-purple-500 to-violet-500"
        />
      </div>

      {/* Recent Activity and Quick Stats */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Recent Activity */}
        <div className="lg:col-span-2">
          <div className="bg-white rounded-xl shadow-sm border border-gray-200">
            <div className="px-6 py-4 border-b border-gray-200">
              <h3 className="text-lg font-semibold text-gray-900">Actividad Reciente</h3>
            </div>
            <div className="divide-y divide-gray-200">
              {recentActivity.map((activity) => (
                <ActivityItem key={activity.id} activity={activity} />
              ))}
            </div>
          </div>
        </div>

        {/* Quick Stats */}
        <div className="space-y-6">
          {/* Status Overview */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Estado del Sistema</h3>
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <CheckCircleIcon className="w-5 h-5 text-green-500" />
                  <span className="text-sm text-gray-700">Sistema Operativo</span>
                </div>
                <span className="text-sm font-medium text-green-600">Online</span>
              </div>
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <ClockIcon className="w-5 h-5 text-yellow-500" />
                  <span className="text-sm text-gray-700">Solicitudes Pendientes</span>
                </div>
                <span className="text-sm font-medium text-yellow-600">12</span>
              </div>
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <HeartIcon className="w-5 h-5 text-pink-500" />
                  <span className="text-sm text-gray-700">Mascotas Disponibles</span>
                </div>
                <span className="text-sm font-medium text-pink-600">45</span>
              </div>
            </div>
          </div>

          {/* Quick Links */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Accesos Rápidos</h3>
            <div className="space-y-3">
              <button className="w-full text-left btn-secondary btn-icon">
                <div className="flex items-center space-x-3">
                  <PlusIcon className="w-5 h-5 text-gray-400" />
                  <span className="text-sm font-medium text-gray-700">Crear Campaña</span>
                </div>
              </button>
              <button className="w-full text-left btn-secondary btn-icon">
                <div className="flex items-center space-x-3">
                  <BuildingOfficeIcon className="w-5 h-5 text-gray-400" />
                  <span className="text-sm font-medium text-gray-700">Gestionar Fundaciones</span>
                </div>
              </button>
              <button className="w-full text-left btn-secondary btn-icon">
                <div className="flex items-center space-x-3">
                  <ClipboardDocumentListIcon className="w-5 h-5 text-gray-400" />
                  <span className="text-sm font-medium text-gray-700">Ver Reportes</span>
                </div>
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;