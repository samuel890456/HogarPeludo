//src/api.js
import axios from 'axios';

const API_URL = 'http://localhost:5000/api'; // URL base del backend

// Funciones para mascotas
export const getMascotas = async () => {
    try {
        const response = await axios.get(`${API_URL}/mascotas`);
        return response.data;
    } catch (error) {
        console.error('Error al obtener las mascotas:', error);
        throw error;
    }
};
// Nueva función para obtener mascotas por el ID del usuario
export const getMascotasByUserId = async (userId) => {
    try {
        const token = localStorage.getItem('token'); // Necesitas el token para la autenticación
        if (!token) {
            throw new Error('No hay token de autenticación. Inicia sesión.');
        }

        const response = await axios.get(`${API_URL}/mascotas/usuario/${userId}`, {
            headers: {
                Authorization: `Bearer ${token}`,
            },
        });
        return response.data;
    } catch (error) {
        console.error('Error al obtener las mascotas por ID de usuario:', error.response ? error.response.data : error.message);
        throw error;
    }
};
// ¡ELIMINAR MASCOTAS!
export const deleteMascota = async (id) => {
    try {
        const token = localStorage.getItem('token');
        const response = await axios.delete(`${API_URL}/mascotas/${id}`, {
            headers: {
                Authorization: `Bearer ${token}`,
            },
        });
        return response.data;
    } catch (error) {
        console.error('Error al eliminar la mascota:', error.response ? error.response.data : error.message);
        throw error;
    }
};
export const getMascotaById = async (id) => {
    try {
        const response = await axios.get(`${API_URL}/mascotas/${id}`);
        return response.data;
    } catch (error) {
        console.error('Error al obtener la mascota:', error);
        throw error;
    }
};

export const createMascota = async (mascotaData) => { // Recibe FormData
    try {
        const token = localStorage.getItem('token');
        const response = await axios.post(`${API_URL}/mascotas`, mascotaData, {
            headers: {
                Authorization: `Bearer ${token}`,
                // "Content-Type": 'multipart/form-data' // Axios lo establece automáticamente con FormData
            },
        });
        return response.data;
    } catch (error) {
        console.error('Error al crear la mascota:', error.response ? error.response.data : error.message);
        throw error;
    }
};
export const updateMascota = async (id, mascotaData) => { // Recibe FormData
    try {
        const token = localStorage.getItem('token');
        const response = await axios.put(`${API_URL}/mascotas/${id}`, mascotaData, {
            headers: {
                Authorization: `Bearer ${token}`,
                // "Content-Type": 'multipart/form-data' // Axios lo establece automáticamente con FormData
            },
        });
        return response.data;
    } catch (error) {
        console.error('Error al actualizar la mascota:', error.response ? error.response.data : error.message);
        throw error;
    }
};



// Funciones para autenticación
export const registrarUsuario = async (usuario) => {
    try {
        const response = await axios.post(`${API_URL}/auth/registrarse`, usuario);
        return response.data;
    } catch (error) {
        console.error('Error al registrar el usuario:', error);
        throw error;
    }
};

export const iniciarSesion = async (credenciales) => {
    try {
        const response = await axios.post(`${API_URL}/auth/iniciar-sesion`, credenciales); 
        localStorage.setItem('token', response.data.token); // Guardar el token
        localStorage.setItem('userId', response.data.id); // Guardar el userId
        localStorage.setItem('rol_id', response.data.rol_id); // Guardar el rol_id
        return response.data;
    } catch (error) {
        console.error('Error al iniciar sesión:', error);
        throw error;
    }
};
//funciones para restablecimiento de contraseña
export const solicitarRestablecimientoContrasena = async (data) => {
    const response = await axios.post(`${API_URL}/auth/forgot-password`, data);
    return response.data;
};

export const restablecerContrasena = async (token, data) => {
    const response = await axios.post(`${API_URL}/auth/reset-password/${token}`, data);
    return response.data;
};
// Funciones para solicitudes de adopción

export const crearSolicitud = async (solicitud) => {
    try {
        const token = localStorage.getItem('token');
        const response = await axios.post(`${API_URL}/solicitudes`, solicitud, {
            headers: {
                Authorization: `Bearer ${token}`,
            },
        });
        return response.data;
    } catch (error) {
        console.error('Error al crear la solicitud:', error.response ? error.response.data : error.message);
        throw error;
    }
};

export const getSolicitudes = async () => {
    try {
        const token = localStorage.getItem('token');
        const response = await axios.get(`${API_URL}/solicitudes`, {
            headers: {
                Authorization: `Bearer ${token}`,
            },
        });
        return response.data;
    } catch (error) {
        console.error('Error al obtener las solicitudes:', error.response ? error.response.data : error.message);
        throw error;
    }
};

export const updateSolicitudEstado = async (id, estado) => {
    try {
        const token = localStorage.getItem('token');
        const response = await axios.put(`${API_URL}/solicitudes/${id}/estado`, { estado }, {
            headers: {
                Authorization: `Bearer ${token}`,
            },
        });
        return response.data;
    } catch (error) {
        console.error('Error al actualizar el estado de la solicitud:', error.response ? error.response.data : error.message);
        throw error;
    }
};

export const deleteSolicitud = async (id) => {
    try {
        const token = localStorage.getItem('token');
        const response = await axios.delete(`${API_URL}/solicitudes/${id}`, {
            headers: {
                Authorization: `Bearer ${token}`,
            },
        });
        return response.data;
    } catch (error) {
        console.error('Error al eliminar la solicitud:', error.response ? error.response.data : error.message);
        throw error;
    }
};

// Funciones para el perfil del usuario
export const obtenerPerfil = async () => {
    try {
        const token = localStorage.getItem('token'); // Obtener el token del localStorage
        const response = await axios.get(`${API_URL}/usuarios/perfil`, {
            headers: {
                Authorization: `Bearer ${token}`, // Enviar el token en el encabezado
            },
        });
        return response.data;
    } catch (error) {
        console.error('Error al obtener el perfil:', error);
        throw error;
    }
};



export const getUsuario = async (id) => {
    try {
        const token = localStorage.getItem('token');
        const response = await axios.get(`${API_URL}/usuarios/${id}`, {
            headers: {
                Authorization: `Bearer ${token}`,
            },
        });
        return response.data;
    } catch (error) {
        console.error('Error al obtener el usuario:', error);
        throw error;
    }
};

export const updateUsuario = async (id, datos) => {
    try {
        const token = localStorage.getItem('token');
        const response = await axios.put(`${API_URL}/usuarios/${id}`, datos, {
            headers: {
                Authorization: `Bearer ${token}`,
            },
        });
        return response.data;
    } catch (error) {
        console.error('Error al actualizar el usuario:', error);
        throw error;
    }
};
/*
export const getMisPublicaciones = async (usuarioId) => {
    try {
        const token = localStorage.getItem('token');
        const response = await axios.get(`${API_URL}/publicaciones?usuario_id=${usuarioId}`, {
            headers: {
                Authorization: `Bearer ${token}`,
            },
        });
        return response.data;
    } catch (error) {
        console.error('Error al obtener las publicaciones:', error);
        throw error;
    }
};*/