import React, { lazy, Suspense, useEffect, useState } from 'react'; 
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom'; 
import { GoogleOAuthProvider } from '@react-oauth/google';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import useAuthStore from './store/authStore';

// Regular imports
import Home from './pages/Home';
import Mascotas from './pages/Mascotas';
import SolicitudesPage from './pages/SolicitudesPage';
import NotificationsPage from './pages/NotificationsPage'; 
import IniciarSesion from './pages/IniciarSesion';
import Registrarse from './pages/Registrarse';
import OlvideContrasena from './pages/OlvideContrasena'; 
import RestablecerContrasena from './pages/RestablecerContrasena'; 
import Perfil from './pages/Perfil';
import MascotaDetalle from './components/MascotaDetalle';
import PublicarMascota from './pages/PublicarMascota';
import MisPublicaciones from './pages/MisPublicaciones';
import MascotaForm from './components/MascotaForm'; 
import Fundaciones from './pages/Fundaciones';
import FundacionDetail from './pages/FundacionDetail';
import Campanas from './pages/Campanas';
import Noticias from './pages/Noticias'; 
import RutaPrivada from './components/RutaPrivada';
import Layout from './components/Layout';
import AdminLayout from './components/admin/AdminLayout';

// Lazy imports for admin components
const Dashboard = lazy(() => import('./pages/admin/Dashboard'));
const GestionMascotas = lazy(() => import('./pages/admin/GestionMascotas'));
const GestionSolicitudes = lazy(() => import('./pages/admin/GestionSolicitudes'));
const GestionUsuarios = lazy(() => import('./pages/admin/GestionUsuarios'));
const GestionFundaciones = lazy(() => import('./pages/admin/GestionFundaciones')); 
const GestionCampanasNoticias = lazy(() => import('./pages/admin/GestionCampanasNoticias'));
const FundacionForm = lazy(() => import('./components/admin/FundacionForm'));
const Reportes = lazy(() => import('./pages/admin/Reportes')); 

// Componente de carga inicial
const LoadingScreen = () => (
  <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-orange-50 to-pink-50">
    <div className="text-center">
      <div className="w-16 h-16 mx-auto mb-4 bg-gradient-to-br from-orange-400 to-pink-500 rounded-xl flex items-center justify-center shadow-lg animate-pulse">
        <svg className="w-8 h-8 text-white" fill="currentColor" viewBox="0 0 20 20">
          <path fillRule="evenodd" d="M3.172 5.172a4 4 0 015.656 0L10 6.343l1.172-1.171a4 4 0 115.656 5.656L10 17.657l-6.828-6.829a4 4 0 010-5.656z" clipRule="evenodd" />
        </svg>
      </div>
      <h2 className="text-xl font-semibold text-gray-700 mb-2">Hogar Peludo</h2>
      <p className="text-gray-500">Cargando...</p>
    </div>
  </div>
);

const App = () => {
  const [isAppReady, setIsAppReady] = useState(false);
  const { isInitialized, initializeAuth } = useAuthStore();

  useEffect(() => {
    // Inicializar el store de autenticación
    initializeAuth();
    
    // Simular un pequeño delay para asegurar que todo esté listo
    const timer = setTimeout(() => {
      setIsAppReady(true);
    }, 100);

    return () => clearTimeout(timer);
  }, [initializeAuth]);

  // Mostrar pantalla de carga mientras se inicializa
  if (!isInitialized || !isAppReady) {
    return <LoadingScreen />;
  }

  return (
    <GoogleOAuthProvider clientId={process.env.REACT_APP_GOOGLE_CLIENT_ID}>
      <Router>
        <Routes>
          {/* Admin routes - No usar Layout principal */}
          <Route path="/admin" element={
            <RutaPrivada allowedRoles={['admin']}>
              <AdminLayout />
            </RutaPrivada>
          }>
            <Route index element={
              <Suspense fallback={<div>Cargando Dashboard...</div>}>
                <Dashboard />
              </Suspense>
            } />
            <Route path="dashboard" element={
              <Suspense fallback={<div>Cargando Dashboard...</div>}>
                <Dashboard />
              </Suspense>
            } />
            <Route path="mascotas" element={
              <Suspense fallback={<div>Cargando Gestión de Mascotas...</div>}>
                <GestionMascotas />
              </Suspense>
            } />
            <Route path="solicitudes" element={
              <Suspense fallback={<div>Cargando Gestión de Solicitudes...</div>}>
                <GestionSolicitudes />
              </Suspense>
            } />
            <Route path="usuarios" element={
              <Suspense fallback={<div>Cargando Gestión de Usuarios...</div>}>
                <GestionUsuarios />
              </Suspense>
            } />
            <Route path="fundaciones" element={
                <Suspense fallback={<div>Cargando Gestión de Fundaciones...</div>}>
                  <GestionFundaciones />
                </Suspense>
              } />
              <Route path="fundaciones/nueva" element={
                <Suspense fallback={<div>Cargando Formulario de Fundación...</div>}>
                  <FundacionForm />
                </Suspense>
              } />
              <Route path="fundaciones/:id/editar" element={
                <Suspense fallback={<div>Cargando Formulario de Fundación...</div>}>
                  <FundacionForm />
                </Suspense>
              } />
            <Route path="campanas-noticias" element={
              <Suspense fallback={<div>Cargando Gestión de Campañas y Noticias...</div>}>
                <GestionCampanasNoticias />
              </Suspense>
            } />
            <Route path="campanas" element={
              <Suspense fallback={<div>Cargando Gestión de Campañas...</div>}>
                <GestionCampanasNoticias />
              </Suspense>
            } />
            <Route path="reportes" element={
              <Suspense fallback={<div>Cargando Reportes...</div>}>
                <Reportes />
              </Suspense>
            } />
          </Route>

          {/* Public routes - Usar Layout principal */}
          <Route path="/" element={<Layout><Home /></Layout>} />
          <Route path="/mascotas" element={<Layout><Mascotas /></Layout>} />
          <Route path="/mascotas/:id" element={<Layout><MascotaDetalle /></Layout>} />
          <Route path="/campanas" element={<Layout><Campanas /></Layout>} />
          <Route path="/noticias" element={<Layout><Noticias /></Layout>} />
          
          {/* Routes that require any authenticated user, or specific roles */}
          <Route path="/publicar-mascota" element={
            <Layout>
              <RutaPrivada allowedRoles={['refugio', 'admin']}>
                <MascotaForm />
              </RutaPrivada>
            </Layout>
          } />
          <Route path="/mascotas/:id/editar" element={
            <Layout>
              <RutaPrivada allowedRoles={['refugio', 'admin']}>
                <MascotaForm />
              </RutaPrivada>
            </Layout>
          } />

          {/* SolicitudesPage and Perfil should be accessible to authenticated users */}
          <Route path="/solicitudes" element={
            <Layout>
              <RutaPrivada>
                <SolicitudesPage />
              </RutaPrivada>
            </Layout>
          } />
          <Route path="/notificaciones" element={
            <Layout>
              <RutaPrivada>
                <NotificationsPage />
              </RutaPrivada>
            </Layout>
          } />
          <Route path="/iniciar-sesion" element={<Layout><IniciarSesion /></Layout>} />
          <Route path="/registrarse" element={<Layout><Registrarse /></Layout>} />
          <Route path="/olvide-contrasena" element={<Layout><OlvideContrasena /></Layout>} /> 
          <Route path="/restablecer-contrasena/:token" element={<Layout><RestablecerContrasena /></Layout>} /> 
          <Route path="/perfil" element={
            <Layout>
              <RutaPrivada>
                <Perfil />
              </RutaPrivada>
            </Layout>
          } />
          <Route path="/mis-publicaciones" element={
            <Layout>
              <RutaPrivada allowedRoles={['refugio', 'admin']}>
                <MisPublicaciones />
              </RutaPrivada>
            </Layout>
          } />
          <Route path="/fundaciones" element={<Layout><Fundaciones /></Layout>} />
          <Route path="/fundaciones/:id" element={<Layout><FundacionDetail /></Layout>} />
        </Routes>
        <ToastContainer position="top-right" autoClose={3000} />
      </Router>
    </GoogleOAuthProvider>
  );
};

export default App;