// src/hooks/useUserProfile.js
import { useState, useEffect, useCallback } from 'react';
import { getUsuario, updateUsuario } from '../api/api.js'; // Asegúrate de que las rutas sean correctas
import axios from 'axios'; // Para la eliminación de cuenta
import { toast } from 'react-toastify';

/**
 * Custom hook para gestionar la lógica de carga, actualización y eliminación del perfil de usuario.
 * @param {string} userId - El ID del usuario cuyo perfil se va a gestionar.
 * @returns {object} Un objeto con el estado del perfil, funciones de manejo y estados de UI.
 */
export const useUserProfile = (userId) => {
    const [userData, setUserData] = useState(null); // Almacena todos los datos del usuario
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [isSaving, setIsSaving] = useState(false); // Para el estado de guardar cambios
    const [isDeleting, setIsDeleting] = useState(false); // Para el estado de eliminar cuenta

    // Carga inicial del perfil del usuario
    useEffect(() => {
        const fetchUserProfile = async () => {
            if (!userId) {
                setError('ID de usuario no proporcionado.');
                setLoading(false);
                return;
            }
            try {
                setLoading(true);
                setError(null); // Limpiar errores previos
                const data = await getUsuario(userId);
                // Mapear los valores de 0/1 a booleanos para los switches
                setUserData({
                    ...data,
                    notificarEmail: data.notificar_email !== 0,
                    notificarWeb: data.notificar_web !== 0,
                });
            } catch (err) {
                console.error('Error al cargar el perfil:', err);
                setError('No se pudo cargar la información del perfil. Por favor, inténtalo de nuevo más tarde.');
                toast.error('Error al cargar el perfil.');
            } finally {
                setLoading(false);
            }
        };

        fetchUserProfile();
    }, [userId]); // Dependencia del userId para recargar si cambia

    // Función para actualizar el perfil
    const updateProfile = useCallback(async (formData) => {
        setIsSaving(true);
        setError(null);
        try {
            // Mapear los booleanos de los switches de vuelta a 0/1 para la API
            const apiData = {
                ...formData,
                notificar_email: formData.notificarEmail ? 1 : 0,
                notificar_web: formData.notificarWeb ? 1 : 0,
            };
            await updateUsuario(userId, apiData);
            setUserData(prev => ({
                ...prev,
                ...formData, // Actualiza el estado local con los datos del formulario (ya mapeados a booleanos si es el caso)
            }));
            toast.success('Perfil actualizado correctamente.');
        } catch (err) {
            console.error('Error al actualizar el perfil:', err);
            const errorMessage = err.response?.data?.message || 'Error al actualizar el perfil. Por favor, inténtalo de nuevo.';
            setError(errorMessage);
            toast.error(errorMessage);
        } finally {
            setIsSaving(false);
        }
    }, [userId]);

    // Función para eliminar la cuenta
    const deleteAccount = useCallback(async () => {
        setIsDeleting(true);
        setError(null);
        try {
            const token = localStorage.getItem('token');
            // Nota: Aquí se usa axios directamente porque tu api.js no tiene deleteAccount
            await axios.delete('http://localhost:5000/api/usuarios/eliminar-cuenta', {
                headers: { Authorization: `Bearer ${token}` }
            });
            toast.success('Cuenta eliminada correctamente.');
            // Limpia la sesión y redirige después de una eliminación exitosa
            localStorage.clear();
            window.location.href = '/'; // Redirección completa para borrar el estado de la app
        } catch (err) {
            console.error('Error al eliminar la cuenta:', err);
            const errorMessage = err.response?.data?.message || 'Error al eliminar la cuenta. Por favor, inténtalo de nuevo.';
            setError(errorMessage);
            toast.error(errorMessage);
        } finally {
            setIsDeleting(false);
        }
    }, []);

    return {
        userData,
        loading,
        error,
        isSaving,
        isDeleting,
        updateProfile,
        deleteAccount,
    };
};