import axios from 'axios';
import { API_BASE_URL } from '../config';

const api = axios.create({
    baseURL: `${API_BASE_URL}/api`
});

api.interceptors.request.use(config => {
    const token = localStorage.getItem('token');
    if (token) {
        config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
}, error => {
    return Promise.reject(error);
});

// Funciones para mascotas
export const getMascotas = async () => {
    try {
        const response = await api.get(`/mascotas`);
        return response.data;
    } catch (error) {
        console.error('Error al obtener las mascotas:', error.response ? error.response.data : error.message);
        throw error;
    }
};
// Nueva función para obtener mascotas por el ID del usuario
export const getMascotasByUserId = async (userId) => {
    try {
        const response = await api.get(`/mascotas/usuario/${userId}`);
        return response.data;
    } catch (error) {
        console.error('Error al obtener las mascotas por ID de usuario:', error.response ? error.response.data : error.message);
        throw error;
    }
};
// ¡ELIMINAR MASCOTAS!
export const deleteMascota = async (id) => {
    try {
        const response = await api.delete(`/mascotas/${id}`);
        return response.data;
    } catch (error) {
        console.error('Error al eliminar la mascota:', error.response ? error.response.data : error.message);
        throw error;
    }
};
export const getMascotaById = async (id) => {
    try {
        const response = await api.get(`/mascotas/${id}`);
        return response.data;
    } catch (error) {
        console.error('Error al obtener la mascota:', error.response ? error.response.data : error.message);
        throw error;
    }
};

export const createMascota = async (mascotaData) => { // Recibe FormData
    try {
        const response = await api.post(`/mascotas`, mascotaData);
        return response.data;
    } catch (error) {
        console.error('Error al crear la mascota:', error.response ? error.response.data : error.message);
        throw error;
    }
};
export const updateMascota = async (id, mascotaData) => { // Recibe FormData
    try {
        const response = await api.put(`/mascotas/${id}`, mascotaData);
        return response.data;
    } catch (error) {
        console.error('Error al actualizar la mascota:', error.response ? error.response.data : error.message);
        throw error;
    }
};



// Funciones para autenticación
export const registrarUsuario = async (usuario) => {
    try {
        const response = await api.post(`/auth/registrarse`, usuario);
        return response.data;
    } catch (error) {
        console.error('Error al registrar el usuario:', error.response ? error.response.data : error.message);
        throw error;
    }
};

export const iniciarSesion = async (credenciales) => {
    try {
        const response = await api.post(`/auth/iniciar-sesion`, credenciales); 
        // No guardar aquí, el store de Zustand se encargará de persistir
        return response.data;
    } catch (error) {
        console.error('Error al iniciar sesión:', error.response ? error.response.data : error.message);
        throw error;
    }
};

// NUEVA FUNCIÓN: Iniciar Sesión con Google
export const googleLogin = async ({ idToken }) => {
    try {
        const response = await api.post(`/auth/google-login`, { idToken });
        // La respuesta del backend ya incluirá el token de tu app y los roles
        return response.data;
    } catch (error) {
        console.error('Error al iniciar sesión con Google:', error.response ? error.response.data : error.message);
        throw error;
    }
};
//funciones para restablecimiento de contraseña
export const solicitarRestablecimientoContrasena = async (data) => {
    const response = await api.post(`/auth/forgot-password`, data);
    return response.data;
};

export const restablecerContrasena = async (token, data) => {
    const response = await api.post(`/auth/reset-password/${token}`, data);
    return response.data;
};
// Funciones para solicitudes de adopción

export const crearSolicitud = async (solicitud) => {
    try {
        const response = await api.post(`/solicitudes`, solicitud);
        return response.data;
    } catch (error) {
        console.error('Error al crear la solicitud:', error.response ? error.response.data : error.message);
        throw error;
    }
};

export const getSolicitudes = async () => {
    try {
        const response = await api.get(`/solicitudes`);
        return response.data;
    } catch (error) {
        console.error('Error al obtener las solicitudes:', error.response ? error.response.data : error.message);
        throw error;
    }
};

export const updateSolicitudEstado = async (id, estado) => {
    try {
        const response = await api.put(`/solicitudes/${id}/estado`, { estado });
        return response.data;
    } catch (error) {
        console.error('Error al actualizar el estado de la solicitud:', error.response ? error.response.data : error.message);
        throw error;
    }
};

export const deleteSolicitud = async (id) => {
    try {
        const response = await api.delete(`/solicitudes/${id}`);
        return response.data;
    } catch (error) {
        console.error('Error al eliminar la solicitud:', error.response ? error.response.data : error.message);
        throw error;
    }
};
//notificaciones
// Función existente para obtener notificaciones no leídas
export const getUnreadNotifications = async () => {
    try {
        const response = await api.get(`/notificaciones`);
        return response.data;
    } catch (error) {
        console.error('Error al obtener notificaciones no leídas:', error.response ? error.response.data : error.message);
        throw error;
    }
};

// Función existente para marcar una notificación específica como leída
export const markNotificationAsRead = async (id) => {
    try {
        await api.put(`/notificaciones/${id}/leida`, {});
        return true;
    } catch (error) {
        console.error('Error al marcar notificación como leída:', error.response ? error.response.data : error.message);
        throw error;
    }
};

// NUEVAS FUNCIONES para la bandeja completa:

// Obtener TODAS las notificaciones de un usuario
export const getAllNotifications = async () => {
    try {
        const response = await api.get(`/notificaciones/todas`);
        return response.data;
    } catch (error) {
        console.error('Error al obtener todas las notificaciones:', error.response ? error.response.data : error.message);
        throw error;
    }
};

// Marcar TODAS las notificaciones de un usuario como leídas
export const markAllNotificationsAsRead = async () => {
    try {
        await api.put(`/notificaciones/marcar-todas-leidas`, {});
        return true;
    } catch (error) {
        console.error('Error al marcar todas las notificaciones como leídas:', error.response ? error.response.data : error.message);
        throw error;
    }
};

// Eliminar una notificación específica
export const deleteNotification = async (id) => {
    try {
        await api.delete(`/notificaciones/${id}`);
        return true;
    } catch (error) {
        console.error('Error al eliminar notificación:', error.response ? error.response.data : error.message);
        throw error;
    }
};


// Funciones para el perfil del usuario
export const obtenerPerfil = async () => {
    try {
        const response = await api.get(`/usuarios/perfil`);
        return response.data;
    } catch (error) {
        console.error('Error al obtener el perfil:', error.response ? error.response.data : error.message);
        throw error;
    }
};



export const getUsuario = async (id) => {
    try {
        const response = await api.get(`/usuarios/${id}`);
        return response.data;
    } catch (error) {
        console.error('Error al obtener el usuario:', error.response ? error.response.data : error.message);
        throw error;
    }
};

export const updateUsuario = async (id, datos) => {
    try {
        const response = await api.put(`/usuarios/${id}`, datos, {
            headers: {
                'Content-Type': 'multipart/form-data', // Importante para enviar FormData
            },
        });
        return response.data;
    } catch (error) {
        console.error('Error al actualizar el usuario:', error.response ? error.response.data : error.message);
        throw error;
    }
};

export const changePassword = async (userId, currentPassword, newPassword) => {
    try {
        const response = await api.put(`/usuarios/${userId}/cambiar-contrasena`, { currentPassword, newPassword });
        return response.data;
    } catch (error) {
        console.error('Error al cambiar la contraseña:', error.response ? error.response.data : error.message);
        throw error;
    }
};

export const requestRoleChange = async (userId, motivacion) => {
    try {
        const response = await api.post(`/usuarios/${userId}/solicitar-rol-refugio`, { motivacion });
        return response.data;
    } catch (error) {
        console.error('Error al solicitar cambio de rol:', error.response ? error.response.data : error.message);
        throw error;
    }
};

export const deleteAccount = async (userId) => {
    try {
        const response = await api.delete(`/usuarios/${userId}`);
        return response.data;
    } catch (error) {
        console.error('Error al eliminar la cuenta:', error.response ? error.response.data : error.message);
        throw error;
    }
};

// Funciones para Fundaciones
export const getFundaciones = async () => {
    try {
        const response = await api.get(`/fundaciones`);
        return response.data;
    } catch (error) {
        console.error('Error al obtener las fundaciones:', error.response ? error.response.data : error.message);
        throw error;
    }
};

export const getFundacionById = async (id) => {
    try {
        const response = await api.get(`/fundaciones/${id}`);
        return response.data;
    } catch (error) {
        console.error('Error al obtener la fundación por ID:', error.response ? error.response.data : error.message);
        throw error;
    }
};

export const getFundacionByUserId = async (userId) => {
    try {
        const response = await api.get(`/fundaciones/user/${userId}`);
        return response.data;
    } catch (error) {
        console.error('Error al obtener la fundación por ID de usuario:', error.response ? error.response.data : error.message);
        throw error;
    }
};

export const updateFundacionByUserId = async (userId, fundacionData) => {
    try {
        const response = await api.put(`/fundaciones/user/${userId}`, fundacionData);
        return response.data;
    } catch (error) {
        console.error('Error al actualizar la fundación por ID de usuario:', error.response ? error.response.data : error.message);
        throw error;
    }
};

// ✅ CAMPAÑAS Y NOTICIAS
export const getCampanasNoticias = async (params = {}) => {
    try {
        const queryParams = new URLSearchParams(params).toString();
        const response = await api.get(`/campanas-noticias?${queryParams}`);
        return response.data;
    } catch (error) {
        console.error('Error al obtener campañas y noticias:', error.response ? error.response.data : error.message);
        throw error;
    }
};

export const getCampanaNoticiaById = async (id) => {
    try {
        const response = await api.get(`/campanas-noticias/${id}`);
        return response.data;
    } catch (error) {
        console.error('Error al obtener campaña/noticia:', error.response ? error.response.data : error.message);
        throw error;
    }
};

export const getCampanasNoticiasByTipo = async (tipo) => {
    try {
        const response = await api.get(`/campanas-noticias/tipo/${tipo}`);
        return response.data;
    } catch (error) {
        console.error('Error al obtener campañas/noticias por tipo:', error.response ? error.response.data : error.message);
        throw error;
    }
};

export const likeCampanaNoticia = async (id) => {
    try {
        const response = await api.post(`/campanas-noticias/${id}/like`);
        return response.data;
    } catch (error) {
        console.error('Error al dar like:', error.response ? error.response.data : error.message);
        throw error;
    }
};