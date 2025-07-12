import React, { useState, useEffect } from 'react';
import Switch from "react-switch";
import { useUserProfile } from '../hooks/useUserProfile.js';
import ConfirmationDialog from '../components/ConfirmationDialog.js';
import LoadingSpinner from '../components/LoadingSpinner.js';
import ErrorMessage from '../components/ErrorMessage.js';
import '../styles/Perfil.css';

const Perfil = ({ user }) => {
    const userId = user?.id || localStorage.getItem('userId');

    const {
        userData,
        loading,
        error,
        isSaving,
        isDeleting,
        updateProfile,
        deleteAccount,
    } = useUserProfile(userId);

    const [formData, setFormData] = useState({
        nombre: '',
        email: '',
        telefono: '',
        direccion: '',
        notificarEmail: true,
        notificarWeb: true,
    });

    const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);

    useEffect(() => {
        if (userData) {
            setFormData({
                nombre: userData.nombre || '',
                email: userData.email || '',
                telefono: userData.telefono || '',
                direccion: userData.direccion || '',
                notificarEmail: userData.notificarEmail,
                notificarWeb: userData.notificarWeb,
            });
        }
    }, [userData]);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: value,
        }));
    };

    const handleSwitchChange = (checked, name) => {
        setFormData(prev => ({
            ...prev,
            [name]: checked,
        }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        await updateProfile(formData);
    };

    const handleInitiateDelete = () => {
        setShowDeleteConfirm(true);
    };

    const handleConfirmDelete = async () => {
        await deleteAccount();
        setShowDeleteConfirm(false);
    };

    const handleCancelDelete = () => {
        setShowDeleteConfirm(false);
    };

    if (loading) {
        return <LoadingSpinner message="Cargando perfil..." />;
    }

    if (error && !userData) {
        return <ErrorMessage message={error} />;
    }

    return (
        <div className="perfil-container">
            <div className="perfil-card">
                <h1>Mi Perfil</h1>

                {error && <p className="form-error-message">{error}</p>}

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
                            type="tel"
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

                    <button type="submit" className="btn btn-primary" disabled={isSaving}>
                        {isSaving ? 'Guardando...' : 'Guardar Cambios'}
                    </button>
                </form>

                <button
                    className="btn btn-danger"
                    onClick={handleInitiateDelete}
                    disabled={isDeleting}
                >
                    {isDeleting ? 'Eliminando...' : 'Eliminar Cuenta'}
                </button>
            </div>

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