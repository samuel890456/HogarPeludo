// src/App.js
import React, { useState, useEffect } from 'react';  
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom'; 
import Header from './components/Header';
import Footer from './components/Footer';
import '@fortawesome/fontawesome-free/css/all.min.css';
import Home from './pages/Home';
import Mascotas from './pages/Mascotas';
import SolicitudesPage from './pages/SolicitudesPage';
import IniciarSesion from './pages/IniciarSesion';
import Registrarse from './pages/Registrarse';
import OlvideContrasena from './pages/OlvideContrasena'; // <--- Nueva importación
import RestablecerContrasena from './pages/RestablecerContrasena'; // <--- Nueva importación
import Perfil from './pages/Perfil';
import MascotaDetalle from './components/MascotaDetalle';
import PublicarMascota from './pages/PublicarMascota';
import MisPublicaciones from './pages/MisPublicaciones';
import MascotaForm from './components/MascotaForm'; 
import './styles/App.css';
//import for admin dashboard
import Dashboard from './pages/admin/Dashboard';
import GestionMascotas from './pages/admin/GestionMascotas';
import GestionSolicitudes from './pages/admin/GestionSolicitudes';
import GestionUsuarios from './pages/admin/GestionUsuarios';
import RutaPrivada from './components/RutaPrivada';
import AdminNav from './components/admin/AdminNav'; 

const App = () => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [user, setUser] = useState(null);

  // Check for token and user data in localStorage on component mount
  useEffect(() => {
    const token = localStorage.getItem('token'); 
    const userId = localStorage.getItem('userId');
        // IMPORTANT: Get user roles as a JSON string and parse it
        const userRolesString = localStorage.getItem('userRoles'); 
    
    if (token && userId && userRolesString) {
            try {
                const userRoles = JSON.parse(userRolesString); // Parse the roles string back into an array
                const userData = { id: parseInt(userId), token, roles: userRoles }; // Use 'roles' key
                setIsAuthenticated(true);
                setUser(userData);
                // console.log("User authenticated in useEffect:", userData);
            } catch (e) {
                console.error("Error parsing userRoles from localStorage:", e);
                // In case of parsing error, clear authentication to prevent issues
                handleLogout(); 
            }
    } else if (token && userId && !userRolesString) {
            // Handle cases where old tokens without 'userRoles' might exist
            console.warn("Found old user data in localStorage without roles. Logging out to refresh.");
            handleLogout();
        }
  }, []);
  
  // Function to handle login and save user data
  const handleLogin = (userData) => { 
    // userData from backend should now include `id`, `token`, and `roles` (an array)
    if (!userData || !userData.id || !userData.roles) {
      console.error('Error: Invalid user data (missing ID or roles)', userData);
      return;
    }
  
    setIsAuthenticated(true); 
    setUser(userData); 
    
    localStorage.setItem('token', userData.token); 
    localStorage.setItem('userId', userData.id); 
        // IMPORTANT: Store the roles array as a JSON string
    localStorage.setItem('userRoles', JSON.stringify(userData.roles)); 
    console.log("User authenticated in handleLogin:", userData);
    
        // Redirect based on roles (assuming '1' is the admin role ID)
    if (userData.roles.includes('1')) { // Check if '1' (admin role ID) is in the roles array
          window.location.href = '/admin/dashboard';
        } else {
          window.location.href = '/';
        }
  };
  
  // Function to handle logout
  const handleLogout = () => {
    setIsAuthenticated(false);
    setUser(null);
    localStorage.removeItem('token'); 
    localStorage.removeItem('userId'); 
    localStorage.removeItem('userRoles'); // REMOVE THIS as well
    window.location.href = '/iniciar-sesion'; 
  };

    // Function to check if a user has a specific role
    // This is useful for conditional rendering in Header or other components
    const hasRole = (roleId) => {
        return user?.roles?.includes(roleId.toString()) || false;
    };

  return (
    <Router>
      <Header isAuthenticated={isAuthenticated} user={user} onLogout={handleLogout} />
      <main>
      <Routes>
        <Route path="/" element={<Home />} />

        {/* Admin routes protected by checking for admin role (ID '1') */}
                <Route path="/admin" element={
          <RutaPrivada allowedRoles={['1']}> {/* Pass array of allowed roles */}
            <AdminNav />
          </RutaPrivada>
        } />
        <Route path="/admin/dashboard" element={
          <RutaPrivada allowedRoles={['1']}>
            <Dashboard />
          </RutaPrivada>
        } />
        <Route path="/admin/mascotas" element={
          <RutaPrivada allowedRoles={['1']}>
            <GestionMascotas />
          </RutaPrivada>
        } />
        <Route path="/admin/solicitudes" element={
          <RutaPrivada allowedRoles={['1']}>
            <GestionSolicitudes />
          </RutaPrivada>
        } />
        <Route path="/admin/usuarios" element={
          <RutaPrivada allowedRoles={['1']}>
            <GestionUsuarios />
          </RutaPrivada>
        } />
        
        <Route path="/mascotas" element={<Mascotas />} />
        <Route path="/mascotas/:id" element={<MascotaDetalle />} />
        
                {/* Routes that require any authenticated user, or specific roles */}
                <Route path="/publicar-mascota" element={
          <RutaPrivada isAuthenticated={isAuthenticated} allowedRoles={['2', '1']}> {/* Publicador (2) or Admin (1) can publish */}
            <MascotaForm />
          </RutaPrivada>
        } />
        <Route path="/mascotas/:id/editar" element={
          <RutaPrivada isAuthenticated={isAuthenticated} allowedRoles={['2', '1']}> {/* Publicador (2) or Admin (1) can edit */}
            <MascotaForm />
          </RutaPrivada>
        } />

                {/* SolicitudesPage and Perfil should be accessible to authenticated users */}
        <Route path="/solicitudes" element={
                    <RutaPrivada isAuthenticated={isAuthenticated}> {/* No specific role, just authenticated */}
                        <SolicitudesPage />
                    </RutaPrivada>
                } />
        <Route path="/iniciar-sesion" element={<IniciarSesion onLogin={handleLogin} />} />
        <Route path="/registrarse" element={<Registrarse />} />
        <Route path="/olvide-contrasena" element={<OlvideContrasena />} /> {/* <--- Nueva ruta */}
        <Route path="/restablecer-contrasena/:token" element={<RestablecerContrasena />} /> {/* <--- Nueva ruta con parámetro */}
        <Route path="/perfil" element={
                    <RutaPrivada isAuthenticated={isAuthenticated}>
                        <Perfil user={user} />
                    </RutaPrivada>
                } />
        <Route path="/mis-publicaciones" element={
                    <RutaPrivada isAuthenticated={isAuthenticated} allowedRoles={['2', '1']}> {/* Only Publicador (2) or Admin (1) */}
                        <MisPublicaciones user={user} />
                    </RutaPrivada>
                } />
      </Routes>
      </main>
      <Footer />
    </Router>
  );
};

export default App;