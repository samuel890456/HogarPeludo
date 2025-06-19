//frontend/src/components/admin/AdminNav.js
import { Link } from 'react-router-dom';
import '../../styles/AdminNav.css';

const AdminNav = () => {
    return (
        <nav className="admin-nav">
            <Link to="/admin/dashboard">Dashboard</Link>
            <Link to="/admin/mascotas">Mascotas</Link>
            <Link to="/admin/solicitudes">Solicitudes</Link>
            <Link to="/admin/usuarios">Usuarios</Link>
        </nav>
    );
};

export default AdminNav;
