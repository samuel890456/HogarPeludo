import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import { obtenerPerfil } from '../api/api'; // Importar la función obtenerPerfil

const useAuthStore = create(
  persist(
    (set, get) => ({
      isLoggedIn: false,
      token: null,
      user: null,
      isInitialized: false,

      // Función para inicializar el estado desde localStorage
      initializeAuth: async () => { // Hacerla asíncrona
        try {
          const token = localStorage.getItem('token');
          const userId = localStorage.getItem('userId');
          
          if (token && userId) {
            // Si hay token y userId, intentar obtener el perfil completo
            try {
              const userProfile = await obtenerPerfil();
              set({
                isLoggedIn: true,
                token: token,
                user: userProfile, // Usar el perfil completo de la API
                isInitialized: true,
              });
            } catch (apiError) {
              console.error('Error al obtener perfil en initializeAuth:', apiError);
              // Si falla la API, limpiar el estado y localStorage
              localStorage.removeItem('token');
              localStorage.removeItem('userId');
              localStorage.removeItem('rol_id');
              set({ 
                isLoggedIn: false,
                token: null,
                user: null,
                isInitialized: true 
              });
            }
          } else {
            set({ 
              isLoggedIn: false,
              token: null,
              user: null,
              isInitialized: true 
            });
          }
        } catch (error) {
          console.error('Error general en initializeAuth:', error);
          set({ 
            isLoggedIn: false,
            token: null,
            user: null,
            isInitialized: true 
          });
        }
      },

      login: (userData) => {
        try {
          const roleMap = {
            '1': 'admin',
            '2': 'refugio',
            '3': 'usuario',
          };
          const mappedRoles = (userData.roles || []).map(roleId => roleMap[roleId] || 'desconocido');

          set({
            isLoggedIn: true,
            token: userData.token,
            user: {
              id: userData.id,
              nombre: userData.nombre,
              email: userData.email,
              roles: mappedRoles,
            },
            isInitialized: true,
          });
          
          // También guardar en localStorage para compatibilidad con interceptors
          localStorage.setItem('token', userData.token);
          localStorage.setItem('userId', userData.id);
          if (userData.rol_id) {
            localStorage.setItem('rol_id', userData.rol_id);
          }
        } catch (error) {
          console.error('Error en login:', error);
        }
      },

      logout: () => {
        try {
          set({
            isLoggedIn: false,
            token: null,
            user: null,
            isInitialized: true,
          });
          
          // Limpiar localStorage
          localStorage.removeItem('token');
          localStorage.removeItem('userId');
          localStorage.removeItem('rol_id');
        } catch (error) {
          console.error('Error en logout:', error);
        }
      },

      setUser: (user) => {
        set((state) => ({ ...state, user }));
      },

      // Función para verificar si el usuario es admin
      isAdmin: () => {
        const state = get();
        return state.user?.roles?.includes('admin') || false;
      },

      // Función para verificar si el usuario está autenticado
      isAuthenticated: () => {
        const state = get();
        return state.isLoggedIn && state.token && state.user;
      },
    }),
    {
      name: 'auth-storage',
      storage: createJSONStorage(() => localStorage),
      partialize: (state) => ({ 
        token: state.token, 
        user: state.user, 
        isLoggedIn: state.isLoggedIn,
        isInitialized: state.isInitialized 
      }),
      onRehydrateStorage: () => (state) => {
        // Cuando se rehidrata, asegurar que isInitialized sea true
        if (state) {
          state.isInitialized = true;
        }
      },
    }
  )
);

export default useAuthStore;
