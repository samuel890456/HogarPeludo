// src/pages/Perfil.js
import React, { useState, useEffect } from 'react';
import Switch from "react-switch";
import { useUserProfile } from '../hooks/useUserProfile.js'; // Importa el hook personalizado
import ConfirmationDialog from '../components/ConfirmationDialog.js'; // Importa el nuevo componente
import LoadingSpinner from '../components/LoadingSpinner.js'; // Asume que tienes un spinner básico
import ErrorMessage from '../components/ErrorMessage.js'; // Asume que tienes un componente para mensajes de error
import '../styles/Perfil.css';

/**
 * Componente principal para gestionar y mostrar el perfil del usuario.
 * Utiliza el hook `useUserProfile` para la lógica de datos y `ConfirmationDialog` para la eliminación de cuenta.
 *
 * @param {object} props - Propiedades del componente.
 * @param {object} props.user - Objeto de usuario autenticado (debería contener al menos el 'id').
 */
const Perfil = ({ user }) => {
    // Obtenemos el ID del usuario de las props. Si no está, intentamos de localStorage (como fallback)
    // Es crucial que 'user' se pase correctamente desde el componente principal (App.js)
    const userId = user?.id || localStorage.getItem('userId');

    // Usamos el hook personalizado para toda la lógica de gestión del perfil
    const {
        userData,
        loading,
        error,
        isSaving,
        isDeleting,
        updateProfile,
        deleteAccount,
    } = useUserProfile(userId);

    // Estados locales para los campos del formulario, inicializados con los datos del hook
    const [formData, setFormData] = useState({
        nombre: '',
        email: '',
        telefono: '',
        direccion: '',
        notificarEmail: true,
        notificarWeb: true,
    });

    // Estado para controlar la visibilidad del diálogo de confirmación
    const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);

    // Actualiza el estado del formulario cuando userData cambie (ej. al cargar el perfil)
    useEffect(() => {
        if (userData) {
            setFormData({
                nombre: userData.nombre || '',
                email: userData.email || '',
                telefono: userData.telefono || '',
                direccion: userData.direccion || '',
                notificarEmail: userData.notificarEmail, // Ya mapeado a booleano por el hook
                notificarWeb: userData.notificarWeb,     // Ya mapeado a booleano por el hook
            });
        }
    }, [userData]); // Solo se ejecuta cuando `userData` cambia

    // Manejador genérico para cambios en los campos de texto
    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: value,
        }));
    };

    // Manejador para los switches (react-switch pasa directamente el valor booleano)
    const handleSwitchChange = (checked, name) => {
        setFormData(prev => ({
            ...prev,
            [name]: checked,
        }));
    };

    // Manejador del envío del formulario de actualización
    const handleSubmit = async (e) => {
        e.preventDefault();
        // Llamar a la función de actualización del hook
        await updateProfile(formData);
    };

    // Manejador para iniciar el proceso de eliminación (mostrar diálogo)
    const handleInitiateDelete = () => {
        setShowDeleteConfirm(true);
    };

    // Manejador para confirmar la eliminación
    const handleConfirmDelete = async () => {
        await deleteAccount();
        // El hook se encarga de la redirección y limpieza
        setShowDeleteConfirm(false); // Ocultar el diálogo independientemente del resultado (para evitar que se quede pegado)
    };

    // Manejador para cancelar la eliminación
    const handleCancelDelete = () => {
        setShowDeleteConfirm(false);
    };

    if (loading) {
        return <LoadingSpinner message="Cargando perfil..." />; // Componente de carga
    }

    if (error && !userData) { // Solo muestra el error si no hay datos cargados en absoluto
        return <ErrorMessage message={error} />; // Componente de error
    }

    // Si hay un error, pero ya se cargaron datos (ej. error al actualizar), lo mostramos en el formulario
    return (
        <div className="perfil-container">
            <div className="perfil-card">
                <h1>Mi Perfil</h1>

                {error && <p className="form-error-message">{error}</p>} {/* Error específico del formulario */}

                <form onSubmit={handleSubmit}>
                    <div className="form-group">
                        <label htmlFor="nombre">Nombre</label>
                        <input
                            id="nombre"
                            type="text"
                            name="nombre"
                            placeholder="Tu nombre"
                            value={formData.nombre}
                            onChange={handleChange}
                            required
                            aria-invalid={error ? "true" : "false"}
                            aria-describedby={error ? "nombre-error" : undefined}
                        />
                        {/* {error && <span id="nombre-error" className="input-error-text">{error}</span>} */}
                    </div>

                    <div className="form-group">
                        <label htmlFor="email">Correo electrónico</label>
                        <input
                            id="email"
                            type="email"
                            name="email"
                            placeholder="Tu correo electrónico"
                            value={formData.email}
                            onChange={handleChange}
                            required
                            aria-invalid={error ? "true" : "false"}
                            aria-describedby={error ? "email-error" : undefined}
                        />
                    </div>

                    <div className="form-group">
                        <label htmlFor="telefono">Teléfono</label>
                        <input
                            id="telefono"
                            type="tel" // Use type "tel" for phone numbers
                            name="telefono"
                            placeholder="Tu número de teléfono (opcional)"
                            value={formData.telefono}
                            onChange={handleChange}
                        />
                    </div>

                    <div className="form-group">
                        <label htmlFor="direccion">Dirección</label>
                        <input
                            id="direccion"
                            type="text"
                            name="direccion"
                            placeholder="Tu dirección (opcional)"
                            value={formData.direccion}
                            onChange={handleChange}
                        />
                    </div>

                    <div className="notificaciones-preferencias">
                        <label htmlFor="notificarEmail">
                            <span>Notificar por email</span>
                            <Switch
                                id="notificarEmail"
                                checked={formData.notificarEmail}
                                onChange={(checked) => handleSwitchChange(checked, 'notificarEmail')}
                                onColor="#86d3ff"
                                onHandleColor="#2693e6"
                                handleDiameter={20}
                                uncheckedIcon={false}
                                checkedIcon={false}
                                boxShadow="0px 1px 5px rgba(0, 0, 0, 0.6)"
                                activeBoxShadow="0px 0px 1px 10px rgba(0, 0, 0, 0.2)"
                                height={24}
                                width={48}
                            />
                        </label>
                        <label htmlFor="notificarWeb">
                            <span>Notificar en la web</span>
                            <Switch
                                id="notificarWeb"
                                checked={formData.notificarWeb}
                                onChange={(checked) => handleSwitchChange(checked, 'notificarWeb')}
                                onColor="#86d3ff"
                                onHandleColor="#2693e6"
                                handleDiameter={20}
                                uncheckedIcon={false}
                                checkedIcon={false}
                                boxShadow="0px 1px 5px rgba(0, 0, 0, 0.6)"
                                activeBoxShadow="0px 0px 1px 10px rgba(0, 0, 0, 0.2)"
                                height={24}
                                width={48}
                            />
                        </label>
                    </div>

                    <button type="submit" className="btn-primary" disabled={isSaving}>
                        {isSaving ? 'Guardando...' : 'Guardar Cambios'}
                    </button>
                </form>

                <button
                    className="btn-delete-account"
                    onClick={handleInitiateDelete}
                    disabled={isDeleting}
                >
                    {isDeleting ? 'Eliminando...' : 'Eliminar Cuenta'}
                </button>
            </div>

            {/* Diálogo de confirmación para eliminar cuenta */}
            <ConfirmationDialog
                isOpen={showDeleteConfirm}
                title="Confirmar Eliminación de Cuenta"
                message="¿Estás seguro de que deseas eliminar tu cuenta? Esta acción es irreversible y se perderán todos tus datos asociados. ¿Deseas continuar?"
                confirmText="Sí, Eliminar Cuenta"
                cancelText="No, Cancelar"
                onConfirm={handleConfirmDelete}
                onCancel={handleCancelDelete}
                isLoading={isDeleting}
            />
        </div>
    );
};

export default Perfil;