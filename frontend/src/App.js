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
import MisPublicaciones from './pages/MisPublicaciones';
import './styles/App.css';

const App = () => {
    const [isAuthenticated, setIsAuthenticated] = useState(false);
    const [user, setUser] = useState(null);

    // Verificar si hay un token guardado en localStorage al cargar la página
    useEffect(() => {
        const token = localStorage.getItem('token'); 
        if (token) {
            setIsAuthenticated(true);
            setUser({ token }); // Aquí puedes hacer una petición al backend para obtener más datos del usuario
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
    
        window.location.href = '/'; // Redirigir después del login
    };
    

    // Función para manejar el cierre de sesión
    const handleLogout = () => {
        setIsAuthenticated(false);
        setUser(null);
        localStorage.removeItem('token'); // Eliminar el token del localStorage
        window.location.href = '/iniciar-sesion'; 
    };

    // Renderizar la app con sus componentes y rutas protegidas
    return (
        <Router>
            <Header isAuthenticated={isAuthenticated} user={user} onLogout={handleLogout} />
            <Routes>
                <Route path="/" element={<Home />} />
                <Route path="/mascotas" element={<Mascotas />} />
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
