import { Link, useLocation } from 'react-router-dom';
import { 
  HomeIcon,
  HeartIcon,
  ClipboardDocumentListIcon,
  UsersIcon,
  BuildingOfficeIcon,
  DocumentTextIcon,
  ChartBarIcon
} from '@heroicons/react/24/outline';

const AdminNav = () => {
    const location = useLocation();

    const isActive = (path) => {
        return location.pathname === `/admin${path}` || 
               (path === '' && location.pathname === '/admin');
    };

    const navItems = [
        { path: '', label: 'Dashboard', icon: HomeIcon },
        { path: '/mascotas', label: 'Mascotas', icon: HeartIcon },
        { path: '/solicitudes', label: 'Solicitudes', icon: ClipboardDocumentListIcon },
        { path: '/usuarios', label: 'Usuarios', icon: UsersIcon },
        { path: '/fundaciones', label: 'Fundaciones', icon: BuildingOfficeIcon },
        { path: '/campanas-noticias', label: 'Campañas & Noticias', icon: DocumentTextIcon },
        { path: '/reportes', label: 'Reportes', icon: ChartBarIcon }
    ];

    return (
        <nav className="bg-white border-b border-gray-200 shadow-sm">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex justify-between h-16">
                    <div className="flex space-x-8">
                        {navItems.map((item) => {
                            const Icon = item.icon;
                            return (
                                <Link
                                    key={item.path}
                                    to={`/admin${item.path}`}
                                    className={`inline-flex items-center px-1 pt-1 border-b-2 text-sm font-medium transition-colors duration-200 ${
                                        isActive(item.path)
                                            ? 'border-purple-500 text-purple-600'
                                            : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                                    }`}
                                >
                                    <Icon className="w-4 h-4 mr-2" />
                                    {item.label}
                                </Link>
                            );
                        })}
                    </div>
                </div>
            </div>
        </nav>
    );
};

export default AdminNav;