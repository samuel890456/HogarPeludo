import axios from 'axios';
import { API_BASE_URL } from '../config';

const adminApi = axios.create({
    baseURL: `${API_BASE_URL}/admin`
});

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
export async function fetchSolicitudes() {
    try {
        const response = await adminApi.get(`/solicitudes`);

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