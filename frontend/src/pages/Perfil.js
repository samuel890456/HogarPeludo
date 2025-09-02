import React, { useState, useEffect } from 'react';
import Switch from "react-switch";
import { useUserProfile } from '../hooks/useUserProfile.js';
import ConfirmationDialog from '../components/ConfirmationDialog.js';
import LoadingSpinner from '../components/LoadingSpinner.js';
import ErrorMessage from '../components/ErrorMessage.js';
import useAuthStore from '../store/authStore.js'; // Import useAuthStore
import { Link } from 'react-router-dom'; // Needed for navigation within profile
import { changePassword, requestRoleChange, deleteAccount as apiDeleteAccount, updateUsuario } from '../api/api'; // Import new API functions

// Import Heroicons for tabs
import { toast } from 'react-toastify';
import { UserIcon, Cog6ToothIcon, DocumentTextIcon, PhotoIcon, KeyIcon, BellIcon, ArrowRightOnRectangleIcon, TrashIcon, ExclamationTriangleIcon, UserGroupIcon, HeartIcon } from '@heroicons/react/24/outline';

const UPLOADS_BASE_URL = 'http://localhost:5000/uploads/'; // Asegúrate de que esta URL sea correcta

const Perfil = () => {
    const { user, logout, setUser } = useAuthStore(); // Get user, logout, and setUser from Zustand store
    const userId = user?.id; // Get userId from Zustand store

    const {
        userData,
        loading,
        error,
        setError, // Add setError here
        isSaving,
        isDeleting,
        updateProfile,
    } = useUserProfile(userId); // useUserProfile will now handle fetching and initial update

    const [formData, setFormData] = useState({
        nombre: '',
        email: '',
        telefono: '',
        direccion: '',
        biografia: '', // New field
        foto_perfil: null, // For file upload
        foto_perfil_url: null, // For preview
        notificarEmail: true,
        notificarWeb: true,
        clear_foto_perfil: false, // To signal backend to remove photo
    });

    const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
    const [activeTab, setActiveTab] = useState('personal'); // State for active tab

    // New state for password change form
    const [passwordForm, setPasswordForm] = useState({
        currentPassword: '',
        newPassword: '',
        confirmNewPassword: '',
    });
    const [passwordError, setPasswordError] = useState('');
    const [passwordSaving, setPasswordSaving] = useState(false);

    // New state for role request form
    const [roleRequestForm, setRoleRequestForm] = useState({
        motivacion: '',
        aceptaTerminos: false,
    });
    const [roleRequestError, setRoleRequestError] = useState('');
    const [roleRequestSaving, setRoleRequestSaving] = useState(false);

    useEffect(() => {
        if (userData) {
            setFormData({
                nombre: userData.nombre || '',
                email: userData.email || '',
                telefono: userData.telefono || '',
                direccion: userData.direccion || '',
                biografia: userData.biografia || '', // Initialize new field
                foto_perfil: null, // Always null on load, file input is separate
                foto_perfil_url: userData.foto_perfil_url ? `${UPLOADS_BASE_URL}${userData.foto_perfil_url}` : null, // Initialize new field
                notificarEmail: userData.notificarEmail,
                notificarWeb: userData.notificarWeb,
                clear_foto_perfil: false,
            });
        }
    }, [userData]);

    const handleChange = (e) => {
        const { name, value, type, checked } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: type === 'checkbox' ? checked : value,
        }));
    };

    const handlePasswordChange = (e) => {
        const { name, value } = e.target;
        setPasswordForm(prev => ({ ...prev, [name]: value }));
        setPasswordError('');
    };

    const handleRoleRequestChange = (e) => {
        const { name, value, type, checked } = e.target;
        setRoleRequestForm(prev => ({
            ...prev,
            [name]: type === 'checkbox' ? checked : value,
        }));
        setRoleRequestError('');
    };

    const handleSwitchChange = (checked, field) => {
        setFormData(prev => ({
            ...prev,
            [field]: checked,
        }));
    };

    const handleFileChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            setFormData(prev => ({
                ...prev,
                foto_perfil: file,
                foto_perfil_url: URL.createObjectURL(file),
                clear_foto_perfil: false,
            }));
        }
    };

    const handleRemoveProfilePhoto = () => {
        setFormData(prev => ({
            ...prev,
            foto_perfil: null,
            foto_perfil_url: null,
            clear_foto_perfil: true, // Signal to backend to remove photo
        }));
    };

    const handleSubmitPersonal = async (e) => {
        e.preventDefault();
        // Manually create FormData for file upload and other fields
        const data = new FormData();
        data.append('nombre', formData.nombre);
        data.append('email', formData.email);
        data.append('telefono', formData.telefono);
        data.append('direccion', formData.direccion);
        data.append('biografia', formData.biografia);
        data.append('notificarEmail', formData.notificarEmail);
        data.append('notificarWeb', formData.notificarWeb);

        if (formData.foto_perfil) {
            data.append('foto_perfil', formData.foto_perfil);
        }
        if (formData.clear_foto_perfil) {
            data.append('clear_foto_perfil', 'true');
        }

        try {
            const updatedUser = await updateUsuario(userId, data);
            toast.success('Perfil actualizado con éxito!');
            // Update Zustand store with new user data (especially if roles change or photo URL)
            setUser({ ...user, ...updatedUser }); // Merge updated data into current user state
        } catch (err) {
            console.error("Error al guardar perfil:", err);
            const errorMessage = err.response?.data?.message || 'Error al actualizar el perfil.';
            toast.error(errorMessage);
            setError(errorMessage);
        }
    };

    const handleSubmitPassword = async (e) => {
        e.preventDefault();
        setPasswordSaving(true);
        setPasswordError('');
        if (passwordForm.newPassword !== passwordForm.confirmNewPassword) {
            setPasswordError('Las nuevas contraseñas no coinciden.');
            setPasswordSaving(false);
            return;
        }
        if (passwordForm.newPassword.length < 6) {
            setPasswordError('La nueva contraseña debe tener al menos 6 caracteres.');
            setPasswordSaving(false);
            return;
        }

        try {
            await changePassword(userId, passwordForm.currentPassword, passwordForm.newPassword);
            toast.success('Contraseña actualizada con éxito!');
            setPasswordForm({ currentPassword: '', newPassword: '', confirmNewPassword: '' });
        } catch (err) {
            console.error("Error al cambiar la contraseña:", err);
            setPasswordError(err.response?.data?.message || 'Error al cambiar la contraseña.');
            toast.error('Error al cambiar la contraseña.');
        } finally {
            setPasswordSaving(false);
        }
    };

    const handleSubmitRoleRequest = async (e) => {
        e.preventDefault();
        setRoleRequestSaving(true);
        setRoleRequestError('');

        if (!roleRequestForm.aceptaTerminos) {
            setRoleRequestError('Debes aceptar los términos y condiciones.');
            setRoleRequestSaving(false);
            return;
        }
        if (!roleRequestForm.motivacion.trim()) {
            setRoleRequestError('Debes proporcionar una motivación.');
            setRoleRequestSaving(false);
            return;
        }

        // Check if profile is complete
        const isProfileComplete = formData.nombre && formData.email && formData.telefono && formData.direccion && formData.biografia;
        if (!isProfileComplete) {
            setRoleRequestError('Debes completar tu perfil (nombre, email, teléfono, dirección, biografía) antes de solicitar ser refugio.');
            setRoleRequestSaving(false);
            return;
        }

        try {
            await requestRoleChange(userId, roleRequestForm.motivacion);
            toast.success('Solicitud para ser Refugio enviada con éxito. Será revisada por un administrador.');
            // Update user state in Zustand to reflect pending request
            setUser({ ...user, solicitud_rol_refugio_estado: 'pendiente_aprobacion_admin' });
        } catch (err) {
            console.error("Error al enviar la solicitud:", err);
            setRoleRequestError(err.response?.data?.message || 'Error al enviar la solicitud.');
            toast.error('Error al enviar la solicitud.');
        } finally {
            setRoleRequestSaving(false);
        }
    };

    const handleInitiateDelete = () => {
        setShowDeleteConfirm(true);
    };

    const handleConfirmDelete = async () => {
        try {
            await apiDeleteAccount(userId);
            toast.success('Cuenta eliminada con éxito.');
            setShowDeleteConfirm(false);
            logout(); // Logout after account deletion
        } catch (err) {
            console.error("Error al eliminar la cuenta:", err);
            toast.error(err.response?.data?.message || 'Error al eliminar la cuenta.');
            setShowDeleteConfirm(false);
        }
    };

    const handleCancelDelete = () => {
        setShowDeleteConfirm(false);
    };

    // Check if user has 'usuario' role
    const isUsuario = user?.roles?.includes('usuario');
    // Check if profile is complete for role request
    const isProfileCompleteForRoleRequest = formData.nombre && formData.email && formData.telefono && formData.direccion && formData.biografia;
    // Check current role request status (assuming it's part of user data from backend)
    const roleRequestStatus = user?.solicitud_rol_refugio_estado; // e.g., 'pendiente_aprobacion_admin', 'aprobada', 'rechazada'

    if (loading) {
        return <LoadingSpinner message="Cargando perfil..." />;
    }

    if (error && !userData) {
        return <ErrorMessage message={error} />;
    }

    return (
        <div className="min-h-screen bg-gray-100 p-4 sm:p-6 lg:p-8">
            <div className="max-w-5xl mx-auto bg-white rounded-xl shadow-lg overflow-hidden md:flex">
                {/* Sidebar / Tabs Navigation */}
                <div className="md:w-1/4 bg-gray-50 border-r border-gray-200 p-6">
                    <div className="flex flex-col items-center mb-6">
                        <div className="w-24 h-24 rounded-full bg-gray-200 flex items-center justify-center overflow-hidden mb-3">
                            {formData.foto_perfil_url ? (
                                <img src={formData.foto_perfil_url} alt="Foto de perfil" className="w-full h-full object-cover" />
                            ) : (
                                <UserIcon className="w-16 h-16 text-gray-400" />
                            )}
                        </div>
                        <h2 className="text-xl font-semibold text-gray-800">{user?.nombre || 'Usuario'}</h2>
                        <p className="text-sm text-gray-500">{user?.email}</p>
                    </div>

                    <nav className="space-y-2">
                        <button
                            className={`w-full flex items-center px-4 py-3 rounded-lg text-left font-medium transition-colors duration-200 ${activeTab === 'personal' ? 'bg-orange-100 text-orange-700' : 'text-gray-700 hover:bg-gray-100'}`}
                            onClick={() => setActiveTab('personal')}
                        >
                            <UserIcon className="w-5 h-5 mr-3" />
                            Información Personal
                        </button>
                        <button
                            className={`w-full flex items-center px-4 py-3 rounded-lg text-left font-medium transition-colors duration-200 ${activeTab === 'settings' ? 'bg-orange-100 text-orange-700' : 'text-gray-700 hover:bg-gray-100'}`}
                            onClick={() => setActiveTab('settings')}
                        >
                            <Cog6ToothIcon className="w-5 h-5 mr-3" />
                            Configuración
                        </button>
                        <button
                            className={`w-full flex items-center px-4 py-3 rounded-lg text-left font-medium transition-colors duration-200 ${activeTab === 'activity' ? 'bg-orange-100 text-orange-700' : 'text-gray-700 hover:bg-gray-100'}`}
                            onClick={() => setActiveTab('activity')}
                        >
                            <DocumentTextIcon className="w-5 h-5 mr-3" />
                            Actividad
                        </button>
                    </nav>
                </div>

                {/* Main Content Area */}
                <div className="md:w-3/4 p-6 sm:p-8">
                    {activeTab === 'personal' && (
                        <section>
                            <h1 className="text-3xl font-bold text-gray-800 mb-6">Información Personal</h1>
                            {error && <p className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative mb-4 text-sm">{error}</p>}
                            <form onSubmit={handleSubmitPersonal} className="space-y-6">
                                {/* Photo Upload */}
                                <div className="flex items-center space-x-4">
                                    <div className="w-24 h-24 rounded-full bg-gray-200 flex items-center justify-center overflow-hidden">
                                        {formData.foto_perfil_url ? (
                                            <img src={formData.foto_perfil_url} alt="Foto de perfil" className="w-full h-full object-cover" />
                                        ) : (
                                            <UserIcon className="w-16 h-16 text-gray-400" />
                                        )}
                                    </div>
                                    <div>
                                        <input
                                            type="file"
                                            id="foto_perfil"
                                            name="foto_perfil"
                                            accept="image/*"
                                            onChange={handleFileChange}
                                            className="hidden"
                                        />
                                        <label
                                            htmlFor="foto_perfil"
                                            className="cursor-pointer inline-flex items-center px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-orange-500"
                                        >
                                            <PhotoIcon className="w-5 h-5 mr-2" />
                                            Cambiar Foto
                                        </label>
                                        {formData.foto_perfil_url && (
                                            <button
                                                type="button"
                                                onClick={handleRemoveProfilePhoto}
                                                className="ml-3 inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-red-600 hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500"
                                            >
                                                <TrashIcon className="w-5 h-5 mr-2" />
                                                Eliminar Foto
                                            </button>
                                        )}
                                    </div>
                                </div>

                                {/* Personal Info Fields */}
                                <div>
                                    <label htmlFor="nombre" className="block text-sm font-medium text-gray-700 mb-1">Nombre Completo</label>
                                    <input type="text" id="nombre" name="nombre" value={formData.nombre} onChange={handleChange} required className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-orange-500 focus:ring-orange-500 sm:text-sm p-2" />
                                </div>
                                <div>
                                    <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">Correo Electrónico</label>
                                    <input type="email" id="email" name="email" value={formData.email} onChange={handleChange} required className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-orange-500 focus:ring-orange-500 sm:text-sm p-2" />
                                </div>
                                <div>
                                    <label htmlFor="telefono" className="block text-sm font-medium text-gray-700 mb-1">Teléfono</label>
                                    <input type="tel" id="telefono" name="telefono" value={formData.telefono} onChange={handleChange} className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-orange-500 focus:ring-orange-500 sm:text-sm p-2" />
                                </div>
                                <div>
                                    <label htmlFor="direccion" className="block text-sm font-medium text-gray-700 mb-1">Dirección</label>
                                    <input type="text" id="direccion" name="direccion" value={formData.direccion} onChange={handleChange} className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-orange-500 focus:ring-orange-500 sm:text-sm p-2" />
                                </div>
                                <div>
                                    <label htmlFor="biografia" className="block text-sm font-medium text-gray-700 mb-1">Biografía / Presentación</label>
                                    <textarea id="biografia" name="biografia" value={formData.biografia} onChange={handleChange} rows="3" className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-orange-500 focus:ring-orange-500 sm:text-sm p-2"></textarea>
                                </div>

                                <button type="submit" className="w-full btn-primary" disabled={isSaving}>
                                    {isSaving ? 'Guardando...' : 'Guardar Cambios'}
                                </button>
                            </form>
                        </section>
                    )}

                    {activeTab === 'settings' && (
                        <section>
                            <h1 className="text-3xl font-bold text-gray-800 mb-6">Configuración de Cuenta</h1>

                            {/* Change Password */}
                            <div className="bg-gray-50 p-6 rounded-lg shadow-sm mb-6">
                                <h2 className="text-xl font-semibold text-gray-700 mb-4 flex items-center"><KeyIcon className="w-6 h-6 mr-2" /> Cambiar Contraseña</h2>
                                {passwordError && <p className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative mb-4 text-sm">{passwordError}</p>}
                                <form onSubmit={handleSubmitPassword} className="space-y-4">
                                    <div>
                                        <label htmlFor="currentPassword" className="block text-sm font-medium text-gray-700 mb-1">Contraseña Actual</label>
                                        <input type="password" id="currentPassword" name="currentPassword" value={passwordForm.currentPassword} onChange={handlePasswordChange} className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-orange-500 focus:ring-orange-500 sm:text-sm p-2" />
                                    </div>
                                    <div>
                                        <label htmlFor="newPassword" className="block text-sm font-medium text-gray-700 mb-1">Nueva Contraseña</label>
                                        <input type="password" id="newPassword" name="newPassword" value={passwordForm.newPassword} onChange={handlePasswordChange} className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-orange-500 focus:ring-orange-500 sm:text-sm p-2" />
                                    </div>
                                    <div>
                                        <label htmlFor="confirmNewPassword" className="block text-sm font-medium text-gray-700 mb-1">Confirmar Nueva Contraseña</label>
                                        <input type="password" id="confirmNewPassword" name="confirmNewPassword" value={passwordForm.confirmNewPassword} onChange={handlePasswordChange} className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-orange-500 focus:ring-orange-500 sm:text-sm p-2" />
                                    </div>
                                    <button type="submit" className="w-full btn-primary" disabled={passwordSaving}>
                                        {passwordSaving ? 'Guardando...' : 'Cambiar Contraseña'}
                                    </button>
                                </form>
                            </div>

                            {/* Notification Preferences */}
                            <div className="bg-gray-50 p-6 rounded-lg shadow-sm mb-6">
                                <h2 className="text-xl font-semibold text-gray-700 mb-4 flex items-center"><BellIcon className="w-6 h-6 mr-2" /> Preferencias de Notificación</h2>
                                <div className="space-y-4">
                                    <div className="flex items-center justify-between">
                                        <label htmlFor="notificarEmail" className="flex items-center text-gray-700 text-sm font-medium cursor-pointer">
                                            <span className="mr-3">Notificar por email</span>
                                            <Switch
                                                id="notificarEmail"
                                                checked={formData.notificarEmail}
                                                onChange={(checked) => handleSwitchChange(checked, 'notificarEmail')}
                                                onColor="#F97316" // Tailwind orange-500
                                                onHandleColor="#EA580C" // Tailwind orange-600
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
                                    <div className="flex items-center justify-between">
                                        <label htmlFor="notificarWeb" className="flex items-center text-gray-700 text-sm font-medium cursor-pointer">
                                            <span className="mr-3">Notificar en la web</span>
                                            <Switch
                                                id="notificarWeb"
                                                checked={formData.notificarWeb}
                                                onChange={(checked) => handleSwitchChange(checked, 'notificarWeb')}
                                                onColor="#F97316" // Tailwind orange-500
                                                onHandleColor="#EA580C" // Tailwind orange-600
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
                                </div>
                            </div>

                            {/* Request Refugio Role */}
                            {isUsuario && roleRequestStatus !== 'pendiente_aprobacion_admin' && (
                                <div className="bg-gray-50 p-6 rounded-lg shadow-sm mb-6">
                                    <h2 className="text-xl font-semibold text-gray-700 mb-4 flex items-center"><UserGroupIcon className="w-6 h-6 mr-2" /> Solicitar Rol de Refugio</h2>
                                    {roleRequestError && <p className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative mb-4 text-sm">{roleRequestError}</p>}
                                    {!isProfileCompleteForRoleRequest && (
                                        <p className="bg-yellow-100 border border-yellow-400 text-yellow-700 px-4 py-3 rounded relative mb-4 text-sm flex items-center">
                                            <ExclamationTriangleIcon className="w-5 h-5 mr-2" />
                                            Debes completar tu perfil (nombre, email, teléfono, dirección, biografía) antes de solicitar ser refugio.
                                        </p>
                                    )}
                                    <form onSubmit={handleSubmitRoleRequest} className="space-y-4">
                                        <div>
                                            <label htmlFor="motivacion" className="block text-sm font-medium text-gray-700 mb-1">¿Por qué deseas ser refugio?</label>
                                            <textarea id="motivacion" name="motivacion" value={roleRequestForm.motivacion} onChange={handleRoleRequestChange} rows="3" className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-orange-500 focus:ring-orange-500 sm:text-sm p-2" disabled={!isProfileCompleteForRoleRequest}></textarea>
                                        </div>
                                        <div className="flex items-center">
                                            <input type="checkbox" id="aceptaTerminos" name="aceptaTerminos" checked={roleRequestForm.aceptaTerminos} onChange={handleRoleRequestChange} className="h-4 w-4 text-orange-600 focus:ring-orange-500 border-gray-300 rounded" disabled={!isProfileCompleteForRoleRequest} />
                                            <label htmlFor="aceptaTerminos" className="ml-2 block text-sm text-gray-700">Acepto los términos y condiciones de ser un refugio responsable.</label>
                                        </div>
                                        <button type="submit" className="w-full btn-primary" disabled={!isProfileCompleteForRoleRequest || roleRequestSaving}>
                                            {roleRequestSaving ? 'Enviando Solicitud...' : 'Solicitar ser Refugio'}
                                        </button>
                                    </form>
                                </div>
                            )}
                            {roleRequestStatus === 'pendiente_aprobacion_admin' && (
                                <div className="bg-blue-100 border border-blue-400 text-blue-700 px-4 py-3 rounded relative mb-4 text-sm flex items-center">
                                    <DocumentTextIcon className="w-5 h-5 mr-2" />
                                    Tu solicitud para ser Refugio está en revisión.
                                </div>
                            )}

                            {/* Logout */}
                            <div className="bg-gray-50 p-6 rounded-lg shadow-sm mb-6">
                                <h2 className="text-xl font-semibold text-gray-700 mb-4 flex items-center"><ArrowRightOnRectangleIcon className="w-6 h-6 mr-2" /> Cerrar Sesión</h2>
                                <button
                                    onClick={logout} // Use logout from useAuthStore
                                    className="w-full btn-danger"
                                >
                                    Cerrar Sesión
                                </button>
                            </div>

                            {/* Delete Account */}
                            <div className="bg-gray-50 p-6 rounded-lg shadow-sm">
                                <h2 className="text-xl font-semibold text-gray-700 mb-4 flex items-center"><TrashIcon className="w-6 h-6 mr-2" /> Eliminar Cuenta</h2>
                                <p className="text-gray-600 text-sm mb-4">Esta acción es irreversible y eliminará permanentemente tu cuenta y todos los datos asociados.</p>
                                <button
                                    onClick={handleInitiateDelete}
                                    className="w-full btn-danger"
                                    disabled={isDeleting}
                                >
                                    {isDeleting ? 'Eliminando...' : 'Eliminar Mi Cuenta'}
                                </button>
                            </div>
                        </section>
                    )}

                    {activeTab === 'activity' && (
                        <section>
                            <h1 className="text-3xl font-bold text-gray-800 mb-6">Mi Actividad</h1>
                            <div className="space-y-6">
                                {/* Mascotas Publicadas (if publicador) */}
                                {user?.roles?.includes('refugio') && ( // Check for 'refugio' role
                                    <div className="bg-gray-50 p-6 rounded-lg shadow-sm">
                                        <h2 className="text-xl font-semibold text-gray-700 mb-4 flex items-center"><DocumentTextIcon className="w-6 h-6 mr-2" /> Mis Publicaciones</h2>
                                        <p className="text-gray-600 mb-4">Aquí puedes ver y gestionar las mascotas que has publicado para adopción.</p>
                                        <Link to="/mis-publicaciones" className="btn-primary">
                                            Ver Mis Publicaciones
                                        </Link>
                                    </div>
                                )}

                                {/* Solicitudes Enviadas (as adoptante) */}
                                {user?.roles?.includes('usuario') && ( // Check for 'usuario' role
                                    <div className="bg-gray-50 p-6 rounded-lg shadow-sm">
                                        <h2 className="text-xl font-semibold text-gray-700 mb-4 flex items-center"><DocumentTextIcon className="w-6 h-6 mr-2" /> Mis Solicitudes de Adopción</h2>
                                        <p className="text-gray-600 mb-4">Revisa el estado de las solicitudes de adopción que has enviado.</p>
                                        <Link to="/solicitudes" className="btn-primary">
                                            Ver Mis Solicitudes
                                        </Link>
                                    </div>
                                )}

                                {/* Notifications */}
                                <div className="bg-gray-50 p-6 rounded-lg shadow-sm">
                                    <h2 className="text-xl font-semibold text-gray-700 mb-4 flex items-center"><BellIcon className="w-6 h-6 mr-2" /> Notificaciones</h2>
                                    <p className="text-gray-600 mb-4">Mantente al día con las actualizaciones importantes de tu cuenta y solicitudes.</p>
                                    <Link to="/notificaciones" className="btn-primary">
                                        Ver Notificaciones
                                    </Link>
                                </div>

                                {/* Mascotas Adoptadas (Placeholder) */}
                                <div className="bg-gray-50 p-6 rounded-lg shadow-sm">
                                    <h2 className="text-xl font-semibold text-gray-700 mb-4 flex items-center"><HeartIcon className="w-6 h-6 mr-2" /> Mascotas Adoptadas</h2>
                                    <p className="text-gray-600 mb-4">Aquí aparecerán las mascotas que has adoptado exitosamente.</p>
                                    {/* Future: Link to a page showing adopted pets */}
                                </div>
                            </div>
                        </section>
                    )}
                </div>
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