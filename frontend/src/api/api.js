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

export const getMascotaById = async (id) => {
    try {
        const response = await axios.get(`${API_URL}/mascotas/${id}`);
        return response.data;
    } catch (error) {
        console.error('Error al obtener la mascota:', error);
        throw error;
    }
};

export const createMascota = async (mascota) => {
    try {
        const token = localStorage.getItem('token');
        console.log("Enviando mascota:", mascota); // 🔍 Verifica los datos antes de enviar
        const response = await axios.post(`${API_URL}/mascotas`, mascota, {
            headers: {
                Authorization: `Bearer ${token}`,
                "Content-Type": "application/json"
            },
        });
        return response.data;
    } catch (error) {
        console.error('Error al crear la mascota:', error);
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
        return response.data;
    } catch (error) {
        console.error('Error al iniciar sesión:', error);
        throw error;
    }
};

// Funciones para solicitudes de adopción
export const crearSolicitud = async (solicitud) => {
    try {
        const token = localStorage.getItem('token'); // Obtener el token del localStorage
        const response = await axios.post(`${API_URL}/solicitudes`, solicitud, {
            headers: {
                Authorization: `Bearer ${token}`, // Enviar el token en el encabezado
            },
        });
        return response.data;
    } catch (error) {
        console.error('Error al crear la solicitud:', error);
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
        console.error('Error al obtener las solicitudes:', error);
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