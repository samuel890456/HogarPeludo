import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCheckCircle, faTimesCircle, faEnvelopeOpen, faTrashAlt, faBell, faSpinner, faExclamationTriangle, faSadTear, faPaw } from '@fortawesome/free-solid-svg-icons';
import { getAllNotifications, markNotificationAsRead, markAllNotificationsAsRead, deleteNotification } from '../api/api';
import { toast } from 'react-toastify';

const NotificationsPage = () => {
    const [notifications, setNotifications] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    const fetchNotifications = async () => {
        try {
            setLoading(true);
            const data = await getAllNotifications();
            setNotifications(data);
        } catch (err) {
            setError('Error al cargar las notificaciones.');
            console.error('Error al cargar notificaciones:', err);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchNotifications();
    }, []);

    const handleMarkAsRead = async (id) => {
        try {
            await markNotificationAsRead(id);
            setNotifications(prev =>
                prev.map(notif =>
                    notif.id === id ? { ...notif, leida: true } : notif
                )
            );
        } catch (err) {
            console.error('Error al marcar notificación como leída:', err);
            toast.error('Error al marcar notificación como leída.');
        }
    };

    const handleMarkAllAsRead = async () => {
        try {
            await markAllNotificationsAsRead();
            setNotifications(prev =>
                prev.map(notif =>
                    notif.leida === false ? { ...notif, leida: true } : notif
                )
            );
        } catch (err) {
            console.error('Error al marcar todas como leídas:', err);
        }
    };

    const handleDeleteNotification = async (id) => {
        if (window.confirm('¿Estás seguro de que quieres eliminar esta notificación?')) {
            try {
                await deleteNotification(id);
                setNotifications(prev => prev.filter(notif => notif.id !== id));
                toast.success('Notificación eliminada.');
            } catch (err) {
                console.error('Error al eliminar notificación:', err);
                setError('Error al eliminar la notificación.');
                toast.error('Error al eliminar la notificación.');
            }
        }
    };

    if (loading) {
        return (
            <div className="flex flex-col items-center justify-center py-8 text-gray-600">
                <FontAwesomeIcon icon={faSpinner} spin size="3x" className="mb-4" />
                <p>Cargando notificaciones...</p>
            </div>
        );
    }

    if (error) {
        return (
            <div className="flex flex-col items-center justify-center py-8 bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative mx-auto max-w-md">
                <FontAwesomeIcon icon={faExclamationTriangle} size="2x" className="mb-4" />
                <p className="text-center mb-4">{error}</p>
                <button onClick={fetchNotifications} className="bg-red-500 hover:bg-red-700 text-white font-bold py-2 px-4 rounded-full transition duration-300">
                    Reintentar Carga
                </button>
            </div>
        );
    }

    const hasUnread = notifications.some(notif => !notif.leida);

    return (
        <div className="container mx-auto p-4">
            <h1 className="text-4xl font-bold text-gray-800 mb-6 text-center"><FontAwesomeIcon icon={faBell} className="mr-3" /> Mis Notificaciones</h1>

            {notifications.length === 0 ? (
                <div className="bg-white p-6 rounded-lg shadow-md text-center">
                    <p className="text-gray-600">No tienes notificaciones en este momento.</p>
                </div>
            ) : (
                <>
                    <div className="flex justify-end mb-4">
                        {hasUnread && (
                            <button
                                onClick={handleMarkAllAsRead}
                                className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded-full text-sm inline-flex items-center transition duration-300"
                                title="Marcar todas como leídas"
                            >
                                <FontAwesomeIcon icon={faEnvelopeOpen} className="mr-2" /> Marcar todas como leídas
                            </button>
                        )}
                    </div>

                    <ul className="space-y-4">
                        {notifications.map(notif => (
                            <li key={notif.id} className={`bg-white p-4 rounded-lg shadow-md flex items-center justify-between ${notif.leida ? 'opacity-70' : ''}`}>
                                <div className="flex-grow">
                                    <p className={`text-gray-800 ${notif.leida ? 'font-normal' : 'font-semibold'}`}>{notif.mensaje}</p>
                                    <span className="text-gray-500 text-xs">{new Date(notif.fecha_creacion).toLocaleString()}</span>
                                </div>
                                <div className="flex space-x-2 ml-4">
                                    {!notif.leida && (
                                        <button
                                            onClick={() => handleMarkAsRead(notif.id)}
                                            className="bg-green-500 hover:bg-green-700 text-white p-2 rounded-full text-sm transition duration-300"
                                            title="Marcar como leída"
                                        >
                                            <FontAwesomeIcon icon={faCheckCircle} />
                                        </button>
                                    )}
                                    {notif.enlace && (
                                        <Link
                                            to={notif.enlace}
                                            className="bg-blue-500 hover:bg-blue-700 text-white p-2 rounded-full text-sm transition duration-300 flex items-center justify-center"
                                            onClick={() => handleMarkAsRead(notif.id)}
                                            title="Ver detalles"
                                        >
                                            <FontAwesomeIcon icon={faPaw} />
                                        </Link>
                                    )}
                                    <button
                                        onClick={() => handleDeleteNotification(notif.id)}
                                        className="bg-red-500 hover:bg-red-700 text-white p-2 rounded-full text-sm transition duration-300"
                                        title="Eliminar notificación"
                                    >
                                        <FontAwesomeIcon icon={faTrashAlt} />
                                    </button>
                                </div>
                            </li>
                        ))}
                    </ul>
                </>
            )}
        </div>
    );
};

export default NotificationsPage;