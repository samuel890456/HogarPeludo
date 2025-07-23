import React, { useState } from 'react';
import { Outlet, Link, useLocation, useNavigate } from 'react-router-dom';
import { 
  HomeIcon, 
  HeartIcon, 
  UserGroupIcon, 
  BuildingOfficeIcon, 
  DocumentTextIcon, 
  BellIcon,
  UserIcon,
  ArrowLeftOnRectangleIcon,
  Bars3Icon,
  XMarkIcon,
  ChartBarIcon,
  ClipboardDocumentListIcon,
  Cog6ToothIcon
} from '@heroicons/react/24/outline';
import { motion, AnimatePresence } from 'framer-motion';
import useAuthStore from '../../store/authStore';
import { toast } from 'react-toastify';

const AdminLayout = () => {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const { user, logout } = useAuthStore();
  const location = useLocation();
  const navigate = useNavigate();

  const navigation = [
    { name: 'Dashboard', href: '/admin', icon: HomeIcon, current: location.pathname === '/admin' },
    { name: 'Mascotas', href: '/admin/mascotas', icon: HeartIcon, current: location.pathname === '/admin/mascotas' },
    { name: 'Solicitudes', href: '/admin/solicitudes', icon: ClipboardDocumentListIcon, current: location.pathname === '/admin/solicitudes' },
    { name: 'Usuarios', href: '/admin/usuarios', icon: UserGroupIcon, current: location.pathname === '/admin/usuarios' },
    { name: 'Fundaciones', href: '/admin/fundaciones', icon: BuildingOfficeIcon, current: location.pathname === '/admin/fundaciones' },
    { name: 'Campañas', href: '/admin/campanas', icon: DocumentTextIcon, current: location.pathname === '/admin/campanas' },
    { name: 'Reportes', href: '/admin/reportes', icon: ChartBarIcon, current: location.pathname === '/admin/reportes' },
  ];

  const handleLogout = () => {
    logout();
    navigate('/');
    toast.success('Sesión cerrada correctamente');
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Sidebar para móvil */}
      <AnimatePresence>
        {sidebarOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 lg:hidden"
          >
            <div className="fixed inset-0 bg-gray-600 bg-opacity-75" onClick={() => setSidebarOpen(false)} />
            <motion.div
              initial={{ x: -300 }}
              animate={{ x: 0 }}
              exit={{ x: -300 }}
              className="relative flex w-full max-w-xs flex-1 flex-col bg-white"
            >
              <div className="flex flex-shrink-0 items-center px-6 py-4">
                <div className="flex items-center space-x-3">
                  <div className="w-8 h-8 bg-gradient-to-br from-purple-600 to-blue-600 rounded-lg flex items-center justify-center">
                    <HeartIcon className="w-5 h-5 text-white" />
                  </div>
                  <span className="text-xl font-bold text-gray-900">Admin Panel</span>
                </div>
                <button
                  onClick={() => setSidebarOpen(false)}
                  className="ml-auto rounded-md p-2 text-gray-400 hover:text-gray-500 hover:bg-gray-100"
                >
                  <XMarkIcon className="w-6 h-6" />
                </button>
              </div>
              <nav className="flex-1 space-y-1 px-4 py-4">
                {navigation.map((item) => (
                  <Link
                    key={item.name}
                    to={item.href}
                    onClick={() => setSidebarOpen(false)}
                    className={`group flex items-center px-3 py-2 text-sm font-medium rounded-lg transition-colors duration-200 ${
                      item.current
                        ? 'bg-purple-100 text-purple-700 border-r-2 border-purple-600'
                        : 'text-gray-700 hover:bg-gray-100 hover:text-gray-900'
                    }`}
                  >
                    <item.icon className="mr-3 h-5 w-5 flex-shrink-0" />
                    {item.name}
                  </Link>
                ))}
              </nav>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Sidebar para desktop */}
      <div className="hidden lg:fixed lg:inset-y-0 lg:flex lg:w-64 lg:flex-col">
        <div className="flex flex-col flex-grow bg-white border-r border-gray-200">
          <div className="flex flex-shrink-0 items-center px-6 py-4 border-b border-gray-200">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-gradient-to-br from-purple-600 to-blue-600 rounded-xl flex items-center justify-center shadow-lg">
                <HeartIcon className="w-6 h-6 text-white" />
              </div>
              <div>
                <h1 className="text-xl font-bold text-gray-900">Admin Panel</h1>
                <p className="text-sm text-gray-500">Hogar Peludo</p>
              </div>
            </div>
          </div>
          
          <nav className="flex-1 space-y-1 px-4 py-6">
            {navigation.map((item) => (
              <Link
                key={item.name}
                to={item.href}
                className={`group flex items-center px-3 py-3 text-sm font-medium rounded-xl transition-all duration-200 ${
                  item.current
                    ? 'bg-gradient-to-r from-purple-100 to-blue-100 text-purple-700 border-r-2 border-purple-600 shadow-sm'
                    : 'text-gray-700 hover:bg-gray-50 hover:text-gray-900 hover:shadow-sm'
                }`}
              >
                <item.icon className={`mr-3 h-5 w-5 flex-shrink-0 ${
                  item.current ? 'text-purple-600' : 'text-gray-400 group-hover:text-gray-500'
                }`} />
                {item.name}
              </Link>
            ))}
          </nav>

          {/* User info en sidebar */}
          <div className="flex-shrink-0 border-t border-gray-200 p-4">
            <div className="flex items-center space-x-3">
              <div className="w-8 h-8 bg-gradient-to-br from-purple-500 to-blue-500 rounded-full flex items-center justify-center">
                <UserIcon className="w-4 h-4 text-white" />
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-gray-900 truncate">
                  {user?.nombre || 'Administrador'}
                </p>
                <p className="text-xs text-gray-500 truncate">
                  {user?.email || 'admin@hogarpeludo.com'}
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Main content */}
      <div className="lg:pl-64">
        {/* Header */}
        <div className="sticky top-0 z-40 flex h-16 shrink-0 items-center gap-x-4 border-b border-gray-200 bg-white px-4 shadow-sm sm:gap-x-6 sm:px-6 lg:px-8">
          <button
            type="button"
            className="-m-2.5 p-2.5 text-gray-700 lg:hidden"
            onClick={() => setSidebarOpen(true)}
          >
            <span className="sr-only">Abrir sidebar</span>
            <Bars3Icon className="h-6 w-6" />
          </button>

          <div className="flex flex-1 gap-x-4 self-stretch lg:gap-x-6">
            <div className="flex flex-1 items-center justify-between">
              <div>
                <h2 className="text-lg font-semibold text-gray-900">
                  {navigation.find(item => item.current)?.name || 'Dashboard'}
                </h2>
                <p className="text-sm text-gray-500">
                  Panel de administración de Hogar Peludo
                </p>
              </div>
              
              <div className="flex items-center space-x-4">
                {/* Notifications */}
                <button className="relative p-2 text-gray-400 hover:text-gray-500 hover:bg-gray-100 rounded-lg transition-colors duration-200">
                  <BellIcon className="h-6 w-6" />
                  <span className="absolute top-1 right-1 block h-2 w-2 rounded-full bg-red-400"></span>
                </button>

                {/* User menu */}
                <div className="relative">
                  <button className="flex items-center space-x-3 p-2 text-gray-700 hover:bg-gray-100 rounded-lg transition-colors duration-200">
                    <div className="w-8 h-8 bg-gradient-to-br from-purple-500 to-blue-500 rounded-full flex items-center justify-center">
                      <UserIcon className="w-4 h-4 text-white" />
                    </div>
                    <span className="hidden md:block text-sm font-medium">
                      {user?.nombre || 'Admin'}
                    </span>
                  </button>
                </div>

                {/* Logout */}
                <button
                  onClick={handleLogout}
                  className="flex items-center space-x-2 px-3 py-2 text-sm font-medium text-gray-700 hover:bg-gray-100 rounded-lg transition-colors duration-200"
                >
                  <ArrowLeftOnRectangleIcon className="h-5 w-5" />
                  <span className="hidden md:block">Cerrar Sesión</span>
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Page content */}
        <main className="py-6">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <Outlet />
          </div>
        </main>
      </div>
    </div>
  );
};

export default AdminLayout;
