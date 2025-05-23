const API_URL = 'http://localhost:5000/admin';

const getAuthHeaders = () => {
    const token = localStorage.getItem('token');
    return {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`
    };
};

// ✅ RESUMEN
export const fetchResumen = async () => {
    const response = await fetch(`${API_URL}/resumen`, {
        headers: getAuthHeaders()
    });

    if (!response.ok) {
        const error = await response.json();
        throw new Error(error.message || 'Error al obtener resumen');
    }

    return response.json();
};

// ✅ MASCOTAS
export async function fetchMascotas() {
    const response = await fetch(`${API_URL}/mascotas`, {
        headers: getAuthHeaders()
    });

    if (!response.ok) throw new Error('Error al obtener mascotas');
    return await response.json();
}

export const eliminarMascota = async (id) => {
    return fetch(`${API_URL}/mascotas/${id}`, {
        method: 'DELETE',
        headers: getAuthHeaders()
    });
};

// ✅ SOLICITUDES
export async function fetchSolicitudes() {
    const response = await fetch(`${API_URL}/solicitudes`, {
        headers: getAuthHeaders()
    });

    if (!response.ok) throw new Error('Error al obtener solicitudes');
    return await response.json();
}

export const aprobarSolicitud = async (id) => {
    return fetch(`${API_URL}/solicitudes/${id}/aprobar`, {
        method: 'PUT',
        headers: getAuthHeaders()
    });
};

export const rechazarSolicitud = async (id) => {
    return fetch(`${API_URL}/solicitudes/${id}/rechazar`, {
        method: 'PUT',
        headers: getAuthHeaders()
    });
};

// ✅ USUARIOS
export async function fetchUsuarios() {
    const response = await fetch(`${API_URL}/usuarios`, {
        headers: getAuthHeaders()
    });

    if (!response.ok) throw new Error('Error al obtener usuarios');
    return await response.json();
}
export const getUsuarios = async () => {
    const response = await fetch(`${API_URL}/usuarios`, {
        headers: getAuthHeaders()
    });
    
    if (!response.ok) throw new Error('Error al obtener usuarios');
    return await response.json();
};
export const toggleUsuario = async (id) => {
    const token = localStorage.getItem('token');
    const response = await fetch(`http://localhost:5000/admin/usuarios/${id}/toggle`, {
        method: 'PUT',
        headers: {
            'Authorization': `Bearer ${token}`
        }
    });

    if (!response.ok) {
        const error = await response.json();
        throw new Error(error.message || 'Error al cambiar estado del usuario');
    }

    return await response.json();
};
