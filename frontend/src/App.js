// src/App.js
// Importar las dependencias
import React, { useState, useEffect } from 'react';  
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom'; 
import Header from './components/Header';
//import Footer from './components/Footer';
import Home from './pages/Home';
import Mascotas from './pages/Mascotas';
import Adopciones from './pages/Adopciones';
import IniciarSesion from './pages/IniciarSesion';
import Registrarse from './pages/Registrarse';
import Perfil from './pages/Perfil';
import MascotaDetalle from './components/MascotaDetalle';
import MisPublicaciones from './pages/MisPublicaciones';
import './styles/App.css';
//import for admin dashboard
import Dashboard from './pages/admin/Dashboard';
import GestionMascotas from './pages/admin/GestionMascotas';
import GestionSolicitudes from './pages/admin/GestionSolicitudes';
import GestionUsuarios from './pages/admin/GestionUsuarios';
import RutaPrivada from './components/RutaPrivada';
import AdminNav from './components/admin/AdminNav'; // Importar el componente AdminNav

const App = () => {
    const [isAuthenticated, setIsAuthenticated] = useState(false);
    const [user, setUser] = useState(null);

    // Verificar si hay un token guardado en localStorage al cargar la página
    useEffect(() => {
        const token = localStorage.getItem('token'); 
        const userId = localStorage.getItem('userId');
        
        
        if (token && userId) {
            const rol_id = localStorage.getItem('rol_id');
            const userData = { id: userId, token, rol_id };  // Aquí debería incluirse `role` si viene del backend
            setIsAuthenticated(true);
            setUser(userData);
            //console.log("Usuario autenticado en useEffect:", userData);
        }
        
    }, []);
    
    
    // Función para manejar el inicio de sesión y guardar los datos del usuario
    const handleLogin = (userData) => { 
        if (!userData || !userData.id) {
            console.error('Error: Datos de usuario inválidos', userData);
            return;
        }
    
        setIsAuthenticated(true); 
        setUser(userData);  // Solo almacenar los datos del usuario, no el token
        
        localStorage.setItem('token', userData.token); // Guardar el token en localStorage
        localStorage.setItem('userId', userData.id); // Guardar el ID del usuario
        localStorage.setItem('rol_id', userData.rol_id); // Guardar
        console.log("Usuario autenticado en handleLogin:", userData);
        if (userData.rol_id === 1) {
    window.location.href = '/admin/dashboard';
} else {
    window.location.href = '/';
}

    
    };
    

    // Función para manejar el cierre de sesión
    const handleLogout = () => {
        setIsAuthenticated(false);
        setUser(null);
        localStorage.removeItem('token'); // Eliminar el token del localStorage
        localStorage.removeItem('userId'); // Eliminar el ID del usuario
        localStorage.removeItem('rol_id'); // Eliminar el rol del usuario
        window.location.href = '/iniciar-sesion'; 
    };

    // Renderizar la app con sus componentes y rutas protegidas
    return (
        <Router>
            <Header isAuthenticated={isAuthenticated} user={user} onLogout={handleLogout} />
            <Routes>
                <Route path="/" element={<Home />} />

                <Route path="/admin" element={
                    <RutaPrivada rolRequerido={1}>
                        <AdminNav />
                    </RutaPrivada>
                } />
                {/*dashboard for admin*/}
                <Route path="/admin/dashboard" element={
                    <RutaPrivada rolRequerido={1}>
                        <Dashboard />
                    </RutaPrivada>
                } />
                
                


                <Route path="/admin/mascotas" element={
                    <RutaPrivada rolRequerido={1}>
                        <GestionMascotas />
                    </RutaPrivada>
                } />

                <Route path="/admin/solicitudes" element={
                    <RutaPrivada rolRequerido={1}>
                        <GestionSolicitudes />
                    </RutaPrivada>
                } />

                <Route path="/admin/usuarios" element={
                    <RutaPrivada rolRequerido={1}>
                        <GestionUsuarios />
                    </RutaPrivada>
                } />
                
                <Route path="/mascotas" element={<Mascotas />} />
                <Route path="/mascotas/:id" element={<MascotaDetalle />} />
                <Route path="/adopciones" element={<Adopciones />} />
                <Route path="/iniciar-sesion" element={<IniciarSesion onLogin={handleLogin} />} />
                <Route path="/registrarse" element={<Registrarse />} />
                <Route path="/perfil" element={<Perfil user={user} />} />
                {/*<Route path="/mis-publicaciones" element={<MisPublicaciones user={user} />} />*/}
            </Routes>
        </Router>
    );
};

export default App;
