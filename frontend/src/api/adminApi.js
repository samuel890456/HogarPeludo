import axios from 'axios';
import { API_BASE_URL } from '../config';

const adminApi = axios.create({
    baseURL: `${API_BASE_URL}/admin`
});

export { adminApi };

adminApi.interceptors.request.use(config => {
    const token = localStorage.getItem('token');
    if (token) {
        config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
}, error => {
    return Promise.reject(error);
});

// ✅ RESUMEN
export const fetchResumen = async () => {
    try {
        const response = await adminApi.get(`/resumen`);

        if (response.status !== 200) {
            throw new Error(response.data.message || 'Error al obtener resumen');
        }

        return response.data;
    } catch (error) {
        console.error('Error al obtener resumen:', error.response ? error.response.data : error.message);
        throw error;
    }
};

// ✅ MASCOTAS
export async function fetchMascotas() {
    try {
        const response = await adminApi.get(`/mascotas`);

        if (response.status !== 200) throw new Error('Error al obtener mascotas');
        return response.data;
    } catch (error) {
        console.error('Error al obtener mascotas:', error.response ? error.response.data : error.message);
        throw error;
    }
}

export const eliminarMascota = async (id) => {
    try {
        return adminApi.delete(`/mascotas/${id}`);
    } catch (error) {
        console.error('Error al eliminar mascota:', error.response ? error.response.data : error.message);
        throw error;
    }
};

// ✅ SOLICITUDES
export async function fetchSolicitudes(searchTerm = '', estado = '', especie = '') {
    try {
        const response = await adminApi.get(`/solicitudes`, {
            params: { searchTerm, estado, especie }
        });

        if (response.status !== 200) throw new Error('Error al obtener solicitudes');
        return response.data;
    } catch (error) {
        console.error('Error al obtener solicitudes:', error.response ? error.response.data : error.message);
        throw error;
    }
}

export const aprobarSolicitud = async (id) => {
    try {
        return adminApi.put(`/solicitudes/${id}/aprobar`);
    } catch (error) {
        console.error('Error al aprobar solicitud:', error.response ? error.response.data : error.message);
        throw error;
    }
};

export const rechazarSolicitud = async (id) => {
    try {
        return adminApi.put(`/solicitudes/${id}/rechazar`);
    } catch (error) {
        console.error('Error al rechazar solicitud:', error.response ? error.response.data : error.message);
        throw error;
    }
};

// ✅ USUARIOS
export async function fetchUsuarios() {
    try {
        const response = await adminApi.get(`/usuarios`);

        if (response.status !== 200) throw new Error('Error al obtener usuarios');
        return response.data;
    } catch (error) {
        console.error('Error al obtener usuarios:', error.response ? error.response.data : error.message);
        throw error;
    }
}
export const getUsuarios = async () => {
    try {
        const response = await adminApi.get(`/usuarios`);
        
        if (response.status !== 200) throw new Error('Error al obtener usuarios');
        return response.data;
    } catch (error) {
        console.error('Error al obtener usuarios:', error.response ? error.response.data : error.message);
        throw error;
    }
};
export const toggleUsuario = async (id) => {
    try {
        const response = await adminApi.put(`/usuarios/${id}/toggle`);

        if (response.status !== 200) {
            throw new Error(response.data.message || 'Error al cambiar estado del usuario');
        }

        return response.data;
    } catch (error) {
        console.error('Error al cambiar estado del usuario:', error.response ? error.response.data : error.message);
        throw error;
    }
};

// ✅ SOLICITUDES DE CAMBIO DE ROL
export const fetchPendingRoleRequests = async () => {
    try {
        const response = await adminApi.get(`/usuarios/solicitudes-rol-pendientes`);
        if (response.status !== 200) throw new Error('Error al obtener solicitudes de rol pendientes');
        return response.data;
    } catch (error) {
        console.error('Error al obtener solicitudes de rol pendientes:', error.response ? error.response.data : error.message);
        throw error;
    }
};

export const approveRoleRequest = async (userId) => {
    try {
        const response = await adminApi.put(`/usuarios/${userId}/aprobar-rol`);
        if (response.status !== 200) throw new Error(response.data.message || 'Error al aprobar solicitud de rol');
        return response.data;
    } catch (error) {
        console.error('Error al aprobar solicitud de rol:', error.response ? error.response.data : error.message);
        throw error;
    }
};

export const rejectRoleRequest = async (userId) => {
    try {
        const response = await adminApi.put(`/usuarios/${userId}/rechazar-rol`);
        if (response.status !== 200) throw new Error(response.data.message || 'Error al rechazar solicitud de rol');
        return response.data;
    } catch (error) {
        console.error('Error al rechazar solicitud de rol:', error.response ? error.response.data : error.message);
        throw error;
    }
};

// ✅ FUNDACIONES
export async function fetchFundaciones(searchTerm = '', estado = '', ciudad = '') {
    try {
        const response = await adminApi.get(`/fundaciones`, {
            params: { searchTerm, estado, ciudad }
        });
        if (response.status !== 200) throw new Error('Error al obtener fundaciones');
        return response.data;
    } catch (error) {
        console.error('Error al obtener fundaciones:', error.response ? error.response.data : error.message);
        throw error;
    }
}

export const aprobarFundacion = async (id) => {
    try {
        const response = await adminApi.put(`/fundaciones/${id}/aprobar`);
        if (response.status !== 200) throw new Error(response.data.message || 'Error al aprobar fundación');
        return response.data;
    } catch (error) {
        console.error('Error al aprobar fundación:', error.response ? error.response.data : error.message);
        throw error;
    }
};

export const rechazarFundacion = async (id) => {
    try {
        const response = await adminApi.put(`/fundaciones/${id}/rechazar`);
        if (response.status !== 200) throw new Error(response.data.message || 'Error al rechazar fundación');
        return response.data;
    } catch (error) {
        console.error('Error al rechazar fundación:', error.response ? error.response.data : error.message);
        throw error;
    }
};

export const eliminarFundacion = async (id) => {
    try {
        const response = await adminApi.delete(`/fundaciones/${id}`);
        if (response.status !== 200) throw new Error(response.data.message || 'Error al eliminar fundación');
        return response.data;
    } catch (error) {
        console.error('Error al eliminar fundación:', error.response ? error.response.data : error.message);
        throw error;
    }
};

export const updateFundacion = async (id, fundacionData) => {
    try {
        const response = await adminApi.put(`/fundaciones/${id}`, fundacionData);
        if (response.status !== 200) throw new Error(response.data.message || 'Error al actualizar fundación');
        return response.data;
    } catch (error) {
        console.error('Error al actualizar fundación:', error.response ? error.response.data : error.message);
        throw error;
    }
};

export const getFundacionById = async (id) => {
    try {
        const response = await adminApi.get(`/fundaciones/${id}`);
        if (response.status !== 200) throw new Error('Error al obtener fundación');
        return response.data;
    } catch (error) {
        console.error('Error al obtener fundación:', error.response ? error.response.data : error.message);
        throw error;
    }
};

export const createFundacion = async (fundacionData) => {
    try {
        const response = await adminApi.post(`/fundaciones`, fundacionData);
        if (response.status !== 200) throw new Error(response.data.message || 'Error al crear fundación');
        return response.data;
    } catch (error) {
        console.error('Error al crear fundación:', error.response ? error.response.data : error.message);
        throw error;
    }
};

// ✅ CAMPAÑAS Y NOTICIAS
export const fetchCampanasNoticias = async () => {
    try {
        const response = await adminApi.get(`/campanas-noticias`);
        if (response.status !== 200) throw new Error('Error al obtener campañas y noticias');
        return response.data;
    } catch (error) {
        console.error('Error al obtener campañas y noticias:', error.response ? error.response.data : error.message);
        throw error;
    }
};

export const createCampanaNoticia = async (data) => {
    try {
        const response = await adminApi.post(`/campanas-noticias`, data);
        if (response.status !== 200) throw new Error(response.data.message || 'Error al crear campaña/noticia');
        return response.data;
    } catch (error) {
        console.error('Error al crear campaña/noticia:', error.response ? error.response.data : error.message);
        throw error;
    }
};

export const updateCampanaNoticia = async (id, data) => {
    try {
        const response = await adminApi.put(`/campanas-noticias/${id}`, data);
        if (response.status !== 200) throw new Error(response.data.message || 'Error al actualizar campaña/noticia');
        return response.data;
    } catch (error) {
        console.error('Error al actualizar campaña/noticia:', error.response ? error.response.data : error.message);
        throw error;
    }
};

export const deleteCampanaNoticia = async (id) => {
    try {
        const response = await adminApi.delete(`/campanas-noticias/${id}`);
        if (response.status !== 200) throw new Error(response.data.message || 'Error al eliminar campaña/noticia');
        return response.data;
    } catch (error) {
        console.error('Error al eliminar campaña/noticia:', error.response ? error.response.data : error.message);
        throw error;
    }
};